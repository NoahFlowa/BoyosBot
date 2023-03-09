const ytdl = require('ytdl-core');
const fs = require('node:fs');

export class Queue {
  constructor() {
    this.songs = []; // An array of songs
    this.connection = null; // The voice connection
    this.player = null; // The audio player
    this.failures = 0;
    this.quotes_file = fs.readFile("quotes.json", (_, err) => {
      if (err) {
        throw new Error(err);
      }
    });
    this.quotes_read = JSON.parse(this.quotes_file);
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
      await this.connection.subscribe(this.player);
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
    const resource = createAudioResource(ytdl(song.url, { filter: 'audioonly', quality: 'highestaudio', opusEncoded: true, encoderArgs: ['-af', 'bass=g=10,dynaudnorm=f=200'], highWaterMark: 1 << 25 }), { inputType: 'ogg/opus', inlineVolume: true, encryption: sodium });

    // Play the audio resource
    this.player.play(resource);
  }

  async pause() {
    if (!this.connection) {
      console.warn("Trying to pause but there's no connection to begin with...");
      this.failures++;
    }
    if (this.connection) {
      this.failures = 0;
    }
    if (!this.player.state.status.paused)
      this.player.pause();
  }

  async resume() {
    if (!this.connection) {
      console.warn("Trying to resume but there's no connection to begin with...");
      this.failures++;
    }
    if (this.connection) {
      this.failures = 0;
    }
    if (!this.player.state.status.resume)
      this.player.resume();
  }

  async leave() {
    if (!this.connection) {
      console.warn("Trying to leave but I already left...");
      this.failures++;
    }
    if (this.connection) {
      this.failures = 0;
    }
    if (this.songs.length !== 0) {
      this.songs = [];
      this.player.stop();
      this.player = null;
      this.connection = null;
    }
  }

  async join() {
    if (this.connection) {
      console.warn("Trying to join but I'm already here!");
      this.failures++;
    }
    if (!this.connection) {
      this.failures = 0;
    }
  }

  async clear() {
    if (!this.songs.length) {
      this.failures++;
    }
    if (this.songs.length > 0) {
      this.songs = [];
    }
  }
}

// Create a global queue map
export const queueMap = new Map();
