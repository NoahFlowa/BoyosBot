// Import shit
const { createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const { stream } = require('play-dl');

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

		const streamData = await stream(song.url, { quality: 'highestaudio', encoderArgs: ['-af', 'bass=g=10,dynaudnorm=f=200'], highWaterMark: 1 << 25 });
		const resource = createAudioResource(streamData.stream, { inputType: streamData.type, inlineVolume: true });

		resource.volume.setVolume(0.5);

		this.player.play(resource);
		this.connection.subscribe(this.player);

		this.player.on(AudioPlayerStatus.Idle, () => {
			this.songs.shift();
			this.play();
		});

		this.player.on('error', error => {
			console.error(`Error: ${error.message}`);
			console.error(`QueueManager Error: ${error.stack}`);
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