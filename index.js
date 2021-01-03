const fs = require('fs').promises;
const readline = require('readline');
const { google } = require('googleapis');
require('dotenv').config();

class GoogleAuth {
  scopes = ['https://www.googleapis.com/auth/drive'];
  tokenPath = 'tokenDrive.json';
  credentials = 'credentialsDrive.json';

  async readFile(value) {
    try {
      const data = await fs.readFile(value);
      return JSON.parse(data);
    } catch (error) {
      return console.log('Error loading file:', error);
    }
  }

  async authorize() {
    const contentCred = await this.readFile(this.credentials);
    const { client_secret, client_id, redirect_uris } = contentCred.installed;
    const oAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0]
    );
    try {
      const token = await this.readFile(this.tokenPath);
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
        fs.writeFile(this.tokenPath, JSON.stringify(token), (err) => {
          if (err) return console.error(err);
          console.log('Token stored to', TOKEN_PATH);
        });
        return oAuth2Client;
      });
    });
  }
}

class GoogleDrive extends GoogleAuth {
  async init() {
    const auth = await this.authorize();
    return google.drive({ version: 'v3', auth });
  }

  async copyFile(name) {
    const drive = await this.init();

    try {
      const res = await drive.files.copy({
        fileId: process.env.copyFileId,
        resource: {
          name,
        },
      });
      const fileId = res.data.id;
      return fileId;
    } catch (error) {
      console.log('The API drive(copyFile) returned an error: ' + error);
    }
  }

  async exportFile(id) {
    const drive = await this.init();

    try {
      const filePDF = await drive.files.export(
        {
          fileId: id,
          mimeType: 'application/pdf',
        },
        { responseType: 'arraybuffer' }
      );
      const { status } = filePDF;
      if (status === 200) {
        return filePDF.data;
      }
      return { message: 'Ошибка экспорта файла!' };
    } catch (error) {
      console.log('The API drive(exportFile) returned an error: ' + error);
    }
  }
}

class GoogleSheets extends GoogleAuth {
  async init() {
    const auth = await this.authorize();
    return google.sheets({ version: 'v4', auth });
  }

  async getSheets() {
    const sheets = await this.init();

    try {
      const res = await sheets.spreadsheets.values.get({
        spreadsheetId: process.env.spreadsheetId,
        range: 'ОУ!A1:B130',
      });
      const rows = res.data.values;
      if (rows.length) {
        return rows;
      }
    } catch (error) {
      console.log('The API sheets(getSheets) returned an error: ' + error);
    }
  }

  async appendRow(reqBody) {
    const sheets = await this.init();

    try {
      const res = await sheets.spreadsheets.values.append({
        spreadsheetId: process.env.spreadsheetId,
        range: 'Лист1!A1',
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        resource: {
          values: [reqBody],
        },
      });

      const { status } = res;
      if (status === 200) {
        return { message: 'Заявление записано в гугл таблицу.' };
      }
      return { message: 'Ошибка записи в таблицу!' };
    } catch (error) {
      console.log('The API sheets(appendRow) returned an error: ' + error);
    }
  }
}

class GoogleDocs extends GoogleAuth {
  async replaceFile(fileId, data) {

    const auth = await this.authorize();
    const docs = google.docs({ version: 'v1', auth });

    try {
      const res = await docs.documents.batchUpdate({
        documentId: fileId,
        resource: {
          requests: [
            {
              replaceAllText: {
                containsText: {
                  text: '{{NAME}}',
                  matchCase: true,
                },
                replaceText: data.name,
              },
            },
            {
              replaceAllText: {
                containsText: {
                  text: '{{POSITION}}',
                  matchCase: true,
                },
                replaceText: data.position,
              },
            },
            {
              replaceAllText: {
                containsText: {
                  text: '{{INSTITUTIONS}}',
                  matchCase: true,
                },
                replaceText: data.institutions,
              },
            },
            {
              replaceAllText: {
                containsText: {
                  text: '{{DATEYEAR}}',
                  matchCase: true,
                },
                replaceText: data.dateYear,
              },
            },
            {
              replaceAllText: {
                containsText: {
                  text: '{{RADIOWONTCATEGORY}}',
                  matchCase: true,
                },
                replaceText: data.radioWontCategory,
              },
            },
            {
              replaceAllText: {
                containsText: {
                  text: '{{RADIOHAVECATEGORY}}',
                  matchCase: true,
                },
                replaceText: data.radioHaveCategory,
              },
            },
            {
              replaceAllText: {
                containsText: {
                  text: '{{DATEPICKER}}',
                  matchCase: true,
                },
                replaceText: data.datePicker,
              },
            },
            {
              replaceAllText: {
                containsText: {
                  text: '{{RADIOPRESENCE}}',
                  matchCase: true,
                },
                replaceText: data.radioPresence,
              },
            },
            {
              replaceAllText: {
                containsText: {
                  text: '{{EMAIL}}',
                  matchCase: true,
                },
                replaceText: data.email,
              },
            },
            {
              replaceAllText: {
                containsText: {
                  text: '{{DATETODAY}}',
                  matchCase: true,
                },
                replaceText: data.dateToday,
              },
            },
            {
              replaceAllText: {
                containsText: {
                  text: '{{PHONE}}',
                  matchCase: true,
                },
                replaceText: data.phone,
              },
            },
          ],
        },
      });
      const { status } = res;
      if (status === 200) {
        return { message: 'Заявление создано в гугл документах. ', fileId };
      }
      return { message: 'Ошибка создания документа!' };
    } catch (error) {
      console.log('The API returned an error: ' + error);
    }
  }
}

module.exports = { GoogleDrive, GoogleSheets, GoogleDocs };
