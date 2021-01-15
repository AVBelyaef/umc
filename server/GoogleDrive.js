const { google } = require('googleapis');
const GoogleAuth = require('./GoogleAuth');

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
      return console.log(`The API drive(copyFile) returned an error: ${error}`);
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
        { responseType: 'arraybuffer' },
      );
      const { status } = filePDF;
      if (status === 200) {
        return filePDF.data;
      }
      return { message: 'Ошибка экспорта файла!' };
    } catch (error) {
      return console.log(
        `The API drive(exportFile) returned an error: ${error}`,
      );
    }
  }
}

module.exports = GoogleDrive;
