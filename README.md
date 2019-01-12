# YouTube Live Rename

## What is it?
This script helps you rename your YouTube channel video title from the command line. This is very useful when you do regular channel live streams and want to somehow automate the process of renaming your channel's default live stream video.

## How do I use it?

### Client Secret
You need to set up an "Other" OAuth client id in the Google Developer console and turn on the YouTube API. Download the client secret and put it in `~/.credentials/client-secret.json`. If you'd like to keep it in another location, use the `-a` flag to specify that location.
```
youtube-video-rename -a /path/to/client-secret.json
```

### Initial authentication
Before using the CLI in scripts or cron jobs, you'll need to run it once interactively to set up authentication. Afterwards, authentication tokens will be stored on disk (in ~/.credentials/) and the CLI will be available for use in automation.
```
youtube-video-rename
```
or
```
youtube-video-rename -a /path/to/client-secret.json
```

### Renaming a video
To rename a video, simply pass the video id with `-i` and the title as the last argument.
```
youtube-video-rename -i ABCDEFGH "This is my live stream"
```

## What other cool things can it do?

### Dates
With the `-d` or `--date` flag you can enable date format parsing, and your title will automatically be formatted as a date, using the system time.
For example, if you want to spit out a title such as "01-04-2019 AM":
```
youtube-video-rename -i ABCDEFGH -d "MM-DD-YYYY A"
```
