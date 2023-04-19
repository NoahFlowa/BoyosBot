// Import shit
const { createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const ytdl = require('ytdl-core');

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

	play() {
		if (!this.connection || this.songs.length === 0) return;

		const song = this.songs[0];

		const resource = createAudioResource(ytdl(song.url, { filter: 'audioonly', quality: 'highestaudio', opusEncoded: true, encoderArgs: ['-af', 'bass=g=10,dynaudnorm=f=200'], highWaterMark: 1 << 25 }), { inputType: 'ogg/opus', inlineVolume: true, encryption: sodium });
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