'use strict';

const config   = require('./config');
const fs       = require('fs-extra');
const google   = require('googleapis').google;
const readline = require('readline');

const OAuth2 = google.auth.OAuth2;

module.exports = async function (creds) {
  const secret = creds.installed.client_secret;
  const id = creds.installed.client_id;
  const redirectUrl = creds.installed.redirect_uris[0];
  const oauth2Client = new OAuth2(id, secret, redirectUrl);

  // Check for old token
  try {
    oauth2Client.credentials = await fs.readJson(config.TOKEN_PATH);
  } catch (_) {
    await getNewToken(oauth2Client);
  }

  return oauth2Client;
};

async function getNewToken (oauth2Client) {
  const authUrl = oauth2Client.generateAuthUrl({ access_type: 'offline', scope: config.SCOPES });

  console.log('Authorize this app by visiting this url: ', authUrl);
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const code = await new Promise((resolve, _) => {
    rl.question('Enter the code from that page here: ', function (code) {
      resolve(code);
    })
  });
  rl.close();

  const token = await new Promise((resolve, reject) => {
    oauth2Client.getToken(code, function (err, token) {
      if (err) {
        reject(err);
      } else {
        resolve(token);
      }
    });
  });

  oauth2Client.credentials = token;
  await fs.mkdirp(config.CREDENTIALS_DIR);
  await fs.writeJson(config.TOKEN_PATH, token);
  console.log('Token written to:', config.TOKEN_PATH);

  return oauth2Client;
}
