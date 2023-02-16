// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits, Collection } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');

// Require FFmpeg and discordjs/opus
const ffmpeg = require('ffmpeg-static');
const { OpusEncoder } = require('@discordjs/opus');

// Require sodium for encryption
const sodium = require('sodium');

// Create client options to be passed to the client constructor
const clientOptions = { restRequestTimeout: 60000 }; // 60 seconds

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] }, clientOptions);

// Create a queue class
class Queue {
  constructor() {
    this.songs = []; // An array of songs
    this.connection = null; // The voice connection
    this.player = null; // The audio player
  }

  // Add a song to the queue
  add(song) {
    this.songs.push(song);
  }

  // Play the first song in the queue
  async play() {
    // If the queue is empty, return
    if (this.songs.length === 0) return;

    // Get the first song in the queue
    const song = this.songs[0];

    // If there is no connection, return
    if (!this.connection) return;

    // If there is no player, create one
    if (!this.player) {
      this.player = createAudioPlayer();
      // Subscribe the connection to the player
      this.connection.subscribe(this.player);
      // Listen for the player events
      this.player.on(AudioPlayerStatus.Idle, () => {
        // Remove the finished song from the queue
        this.songs.shift();
        // Play the next song
        this.play();
      });
      this.player.on('error', error => {
        // Log the error
        console.error(error);
        // Remove the errored song from the queue
        this.songs.shift();
        // Play the next song
        this.play();
      });
    }

    // Create an audio resource from the song URL using ytdl-core, FFmpeg, discordjs/opus and sodium
    const resource = createAudioResource(ytdl(song.url, { filter: 'audioonly', quality: 'highestaudio', opusEncoded: true, encoderArgs: ['-af', 'bass=g=10,dynaudnorm=f=200'], highWaterMark: 1 << 25}), { inputType: 'ogg/opus', inlineVolume: true, encryption: sodium });

    // Play the audio resource
    this.player.play(resource);
  }
}

// Create a global queue map
const queueMap = new Map();

// When the client is ready, run this code (only once)
client.once('ready', () => {
  console.log('Ready!');

  // Register the /play slash command
  client.application.commands.create({
    name: 'play',
    description: 'Play a youtube video by URL or search query',
    options: [
      {
        name: 'input',
        type: 3,
        description: 'The youtube URL or search query',
        required: true,
      },
    ],
  });
});

// Listen for interaction events
client.on('interactionCreate', async interaction => {
  // If the interaction is not a slash command, return
  if (!interaction.isCommand()) return;

  // If the slash command is /play, execute this code
  if (interaction.commandName === 'play') {
    // Get the user input from the command option
    const input = interaction.options.getString('input');

    // Reply to the interaction with a message
    await interaction.reply(`Searching for ${input}...`);

    // Search for youtube videos using yt-search
    const videos = await ytSearch(input);

    // If no videos are found, reply with an error message and return
    if (!videos || !videos.videos || !videos.videos.length) {
      await interaction.followUp('No videos found.');
      return;
    }

    // Get the first video from the search results
    const video = videos.videos[0];

    // Get the video URL
    const url = video.url;

    // Get the voice channel of the user who requested the command
    const channel = interaction.member.voice.channel;

    // If the user is not in a voice channel, reply with an error message and return
    if (!channel) {
      await interaction.followUp('You need to be in a voice channel to play music.');
      return;
    }

    // Get the guild id of the interaction
    const guildId = interaction.guildId;

    // Get or create the queue for the guild
    let queue = queueMap.get(guildId);
    if (!queue) {
      queue = new Queue();
      queueMap.set(guildId, queue);
    }

    // Add the song to the queue
    queue.add(video);

    // If there is no connection, join the voice channel and set the connection
    if (!queue.connection) {
      queue.connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
      });
    }

    // If there is only one song in the queue, play it
    if (queue.songs.length === 1) {
      queue.play();
      await interaction.followUp(`Now playing: ${video.title} (${url})`);
    } else {
      // Otherwise, reply with a message that shows the song is added to the queue
      await interaction.followUp(`Added to the queue: ${video.title} (${url})`);
    }
  }
});

// Login to Discord with your client's token
client.login("MTAzNzE0Nzk5NTk0MDA3MzUzMw.GxqfdD.X8t-G_QbiUTcYR7djZyiV9UZpkSwjGO3WyBnGc");  