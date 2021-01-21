const { google } = require('googleapis');
const GoogleAuth = require('./GoogleAuth');

class GoogleDocs extends GoogleAuth {
  async replaceFile(fileId, data) {
    const auth = await this.authorize();
    const docs = google.docs({ version: 'v1', auth });
    const validity = data.datePicker
      ? `, срок её действия до ${data.datePicker} г`
      : '';
    const parsePosition = data.position.includes('преподавателя')
      ? 'преподаватель'
      : 'концертмейстер';
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
                  text: '{{RADIOWANTCATEGORY}}',
                  matchCase: true,
                },
                replaceText: data.radioWantCategory,
              },
            },
            {
              replaceAllText: {
                containsText: {
                  text: '{{ONLYPOSITION}}',
                  matchCase: true,
                },
                replaceText: parsePosition,
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
                  text: '{{RADIOISCATEGORY}}',
                  matchCase: true,
                },
                replaceText: data.radioIsCategory,
              },
            },
            {
              replaceAllText: {
                containsText: {
                  text: '{{DATEPICKER}}',
                  matchCase: true,
                },
                replaceText: validity,
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
            // {
            //   replaceAllText: {
            //     containsText: {
            //       text: '{{DATETODAY}}',
            //       matchCase: true,
            //     },
            //     replaceText: data.dateToday,
            //   },
            // },
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
      return console.log(`The API returned an error: ${error}`);
    }
  }
}

module.exports = GoogleDocs;
