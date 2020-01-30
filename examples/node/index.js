const pdf2excel = require('../../lib');

try {
  pdf2excel.genXlsx('../bar.pdf', 'bar.xlsx', {
    onProgress: e => console.warn(`${e.numPage} / ${e.numPages}`),
  });
} catch (err) {
  console.error(err);
}