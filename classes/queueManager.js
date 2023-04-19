// Import shit
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const ytdlDiscord = require('ytdl-core-discord');
const ytSearch = require('yt-search');

// Require sodium for encryption
const sodium = require('sodium');

// Create a queue class
class Queue {
	constructor() {
		this.songs = [];
		this.connection = null;
		this.player = createAudioPlayer();
	}

	add(song) {
		this.songs.push(song);
	}

	async play() {
		if (!this.connection || this.songs.length === 0) return;

		const song = this.songs[0];

		const resource = createAudioResource(await ytdlDiscord(song.url, { filter: 'audioonly', quality: 'highestaudio', highWaterMark: 1 << 25 }), { inputType: 'webm/opus', inlineVolume: true });
		resource.volume.setVolume(0.5);

		this.player.play(resource);
		this.connection.subscribe(this.player);

		this.player.on(AudioPlayerStatus.Idle, () => {
			this.songs.shift();
			this.play();
		});

		this.player.on('error', error => {
			console.error(`Error: ${error.message}`);
			this.songs.shift();
			this.play();
		});
	}

	stop() {
		this.songs = [];
		this.player.stop();
		this.connection.destroy();
		this.connection = null;
	}
}

const queueMap = new Map();

module.exports = {
	Queue,
	queueMap,
};