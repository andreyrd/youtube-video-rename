#!/usr/bin/env node

'use strict';

const authenticator = require('./auth');
const config        = require('./config');
const fs            = require('fs-extra');
const google        = require('googleapis').google;
const meow          = require('meow');
const moment        = require('moment');

const cli = meow(`
  Usage:
    $ youtube-video-rename -i <video-id> <title>

  Options:

    --id, -i
      ID of the video you need to update.

    --auth=client-secret.json, -a client-secret.json
      Specify the location of your client-secret.json downloaded from Google Developer Console.
      Upon first run, you will need to interactively authenticate using a web browser, so be sure to run this before
      using this program in automated scripts.

      Default: ~/.credentials/client-secret.json

    --dates, -d
      Enable date parsing. The title will be parsed as a date string, using the current system time.
  
  Examples:

    Renaming a video:
    $ youtube-video-rename -i ABCDEFG "This is the new title"

    Renaming a live video using a date:
    $ youtube-video-rename -i ABCDEFG -d YYYY-MM-dd

  Additional Info:
    This works great for when you need to regulary automatically update your channel's live stream. You will need to
    grab the ID of the live stream first by visiting its page, since YouTube treats a live stream like a regular video
    that just lives on eternally.
`, {
  flags: {
    id: {
      type: 'string',
      alias: 'i'
    },
    auth: {
      type: 'string',
      alias: 'a',
      default: config.SECRET_PATH
    },
    date: {
      type: 'boolean',
      alias: 'd'
    }
  }
});

(async function () {
  const clientSecret = await fs.readJSON(cli.flags.auth);
  const auth = await authenticator(clientSecret);

  if (!cli.flags.id) {
    console.log('Please provide a video ID with the -i flag.');
    return;
  }

  const service = google.youtube('v3');

  const videos = await p(service.videos.list, { auth, id: cli.flags.id, part: 'id,snippet', mine: true });
  const video = videos.data.items[0];

  const input = cli.input.join(' ');
  let title = null;

  if (cli.flags.date) {
    title = moment().format(input);
  } else {
    title = input;
  }

  const categoryId = video.snippet.categoryId;

  await p(service.videos.update, {
    auth,
    id: cli.flags.id,
    part: 'snippet',
    requestBody: {
      id: cli.flags.id,
      snippet: {
        categoryId,
        title
      }
    }
  });
  
  console.log('Title updated to', title);
})().catch((err) => {
  console.error(err);
});

// Converts the terrible YouTube Node api into a promise
async function p (fn, param) {
  return new Promise((resolve, reject) => {
    fn(param, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
}
