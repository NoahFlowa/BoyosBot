# Next Steps and Where I Left Off

##### Add Proxy to bypass YouTubes restriction

* Use a proxy package such as:
  * https-proxy-agent
* Follow steps on this page (works with distube/ytdl-core):
  * [YTDL-Core Proxy Example](https://github.com/fent/node-ytdl-core/blob/master/example/proxy.js "ytdl-core proxy")

##### Convert the @distube/ytdl-core to do .mp3 instead

    Apparently, some folks have gotten around the 1 minute restriction by making
	the stream use`.mp3` instead of `.mp4`

##### Try to figure out how to cache or download the video

    This one might be the ultimate way to go.  Try to incorporate these:

* If video is under 1 minute:
  * Stream like it is now
* If video us over 1 minute:
  * Try to continously cache the next minute
    * Maybe even break up the video into <60 parts and stream that?
  * Download the video entirely
    * Only drawback is storage but if we make max video time length 30 minutes we should be fine
    * Also if we can get it to download only the .mp3 then it will shave a lot of storage off
