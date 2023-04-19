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
        const resource = createAudioResource(ytdl(song.url, { filter: 'audioonly', quality: 'highestaudio', opusEncoded: true, encoderArgs: ['-af', 'bass=g=10,dynaudnorm=f=200'], highWaterMark: 1 << 25}), { inputType: 'ogg/opus', inlineVolume: true, encryption: sodium });

        // Play the audio resource
        this.player.play(resource);
    }
}

// Create a global queue map
const queueMap = new Map();

module.exports = {
    Queue,
    queueMap
};