# Bugs and Shit to Keep Track of

#### Play.js:

***This is the only way to play and search for videos**
***DO NOT USE ytdl.validateURL()!  YOU WILL GET A TRIM() ERROR**

```js
// Search for youtube videos using yt-search
const videos = await ytSearch(input);

// If no videos are found, reply with an error message and return
if (!videos || !videos.videos || !videos.videos.length) {
	await interaction.followUp('No videos found.');
        return;
}

// Get the first video from the search results
const video = videos.videos[0];
```

---
