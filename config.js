
const CREDENTIALS_DIR = (process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE) + '/.credentials/';

module.exports = {
  SCOPES: [ 'https://www.googleapis.com/auth/youtube' ],
  CREDENTIALS_DIR,
  TOKEN_PATH: CREDENTIALS_DIR + 'youtube-live-rename.json',
  SECRET_PATH: CREDENTIALS_DIR + 'client-secret.json'
};
