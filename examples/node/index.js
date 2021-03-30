const pdf2excel = require('../../lib');
const path = require('path');

try {
  pdf2excel.genXlsx(path.resolve(__dirname, '../bar.pdf'), 'bar.xlsx', {
    onProgress: e => console.warn(`${e.numPage} / ${e.numPages}`),
  });
} catch (err) {
  console.error(err);
}