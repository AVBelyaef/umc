/* eslint-disable max-classes-per-file */
const fs = require('fs').promises;
const readline = require('readline');
const { google } = require('googleapis');
require('dotenv').config();

class GoogleAuth {
  scopes = ['https://www.googleapis.com/auth/drive'];

  tokenPath = 'token.json';

  credentials = 'credentials.json';

  static async readFile(value) {
    try {
      const data = await fs.readFile(`${__dirname}/${value}`);
      return JSON.parse(data);
    } catch (error) {
      return console.log('Error loading file:', error);
    }
  }

  async authorize() {
    const contentCred = await GoogleAuth.readFile(this.credentials);

    const {
      client_secret: clientSecret,
      client_id: clientId,
      redirect_uris: redirectUris,
    } = contentCred.installed;

    const oAuth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      redirectUris[0],
    );

    try {
      const token = await GoogleAuth.readFile(this.tokenPath);
      if (!token) {
        return this.getAccessToken(oAuth2Client);
      }
      oAuth2Client.setCredentials(token);
      return oAuth2Client;
    } catch (error) {
      return console.log('auth error:', error);
    }
  }

  getAccessToken(oAuth2Client) {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: this.scopes,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
      rl.close();
      oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error('Error retrieving access token', err);
        oAuth2Client.setCredentials(token);
        fs.writeFile(
          `${__dirname}/${this.tokenPath}`,
          JSON.stringify(token),
          (error) => {
            if (error) return console.error(error);
            return console.log('Token stored to', this.tokenPath);
          },
        );
        return oAuth2Client;
      });
    });
  }
}

module.exports = GoogleAuth;