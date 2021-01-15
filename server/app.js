const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const fetch = require('node-fetch');

const app = express();
require('dotenv').config();

const port = process.env.PORT || 5000;
const GoogleDocs = require('./GoogleDocs');
const GoogleDrive = require('./GoogleDrive');
const GoogleSheets = require('./GoogleSheets');

const removePDF = require('./clearDirTemp');

app.use(express.static(path.join(__dirname, '../client/build/')));
// app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/temp/:id', (req, res) => {
  res.status(200).sendFile(`${__dirname}/temp/${req.params.id}`);
});

app.get('/institutions', async (req, res) => {
  try {
    const sheets = new GoogleSheets();
    const result = await sheets.getSheets();
    const data = result.reduce(
      (acc, [institution, position]) => [
        [...acc[0], institution],
        [...acc[1], ...(position ? [position] : [])],
      ],
      [[], []],
    );
    res.send(data);
  } catch (error) {
    res
      .status(500)
      .send({ message: 'Ошибка загрузки образовательных учреждений!', error });
  }
});

app.post('/users', async (req, res) => {
  const { body } = req;
  const secret = process.env.COPY_SECRET_KEY;
  const token = body.reCaptcha;
  const response = await fetch(
    `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`,
    {
      method: 'POST',
    },
  );
  const data = await response.json();

  if (!data.success) {
    return res.status(400).end();
  }
  delete body.reCaptcha;

  const arrData = Object.values(body);
  const docs = new GoogleDocs();
  const sheets = new GoogleSheets();
  const drive = new GoogleDrive();
  const dateNow = Date.now();
  try {
    const fileId = await drive.copyFile(body.name);
    await docs.replaceFile(fileId, body);
    await sheets.appendRow(arrData);
    const filePDF = await drive.exportFile(fileId);

    await fs.writeFile(
      `${__dirname}/temp/${dateNow}.pdf`,
      Buffer.from(filePDF),
    );
    const isFile = await fs
      .access(`./temp/${dateNow}.pdf`)
      .then(() => true)
      .catch(() => false);

    if (isFile) {
      return res.status(200).send({ file: `/temp/${dateNow}.pdf` });
    }
    res.status(500).send({ message: 'Ошибка записи в таблицу!' });
  } catch (error) {
    res.status(500).send({ message: 'Ошибка записи в таблицу!', error });
  } finally {
    try {
      await removePDF();
    } catch (error) {
      console.log(error);
    }
  }
  return null;
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
