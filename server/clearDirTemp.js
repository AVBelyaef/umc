const fs = require('fs').promises;

const dateNow = Date.now();

const selectFileDelete = (name) => name.reduce((acc, file) => {
  const diffDate = dateNow - file.split('.').slice(0, 1);
  if (diffDate > 3 * 3600 * 1000) {
    acc.push(file);
  }
  return acc;
}, []);

const removePDF = async () => {
  try {
    const name = await fs.readdir(`${__dirname}/temp/`);
    const arrFileName = selectFileDelete(name);
    arrFileName.forEach(async (element) => {
      await fs.unlink(`${__dirname}/temp/${element}`);
    });
    console.log('- delete PDF  -', arrFileName);
  } catch (error) {
    console.log('delete PDF file: ', error);
  }
};

module.exports = removePDF;
