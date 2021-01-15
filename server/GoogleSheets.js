const { google } = require('googleapis');
const GoogleAuth = require('./GoogleAuth');

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
      return null;
    } catch (error) {
      return console.log(
        `The API sheets(getSheets) returned an error: ${error}`,
      );
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
      return console.log(
        `The API sheets(appendRow) returned an error: ${error}`,
      );
    }
  }
}

module.exports = GoogleSheets;
