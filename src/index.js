import { getDocument } from 'pdfjs-dist'; // https://babeljs.io/docs/en/babel-plugin-transform-modules-umd#default-semantics
import XLSX from 'xlsx';
import 'regenerator-runtime/runtime';

// utils
// eslint-disable-next-line
function _getY(item) {
  // scaleX, scale01, scale10, scaleY, x, y
  if (item && Array.isArray(item.transform)) {
    return item.transform[4] || -1;
  }

  return -1;
}

export async function genTextContextMatrix(path, options = {}) {
  const { onProgress, start, end } = options;

  const result = [];
  let numPage = 1;
  let numPages = 0;
  if (typeof start === 'number' && typeof end === 'number' && start < end) {
    numPage = start;
    numPages = end;
  }

  const pdf = await getDocument(path).promise;
  // set end
  if (typeof pdf.numPages === 'number' && numPages === 0) {
    numPages = pdf.numPages;
  }

  // page increase
  while (numPage <= numPages) {
    if (typeof onProgress === 'function') {
      onProgress({ numPage, numPages });
    }

    // eslint-disable-next-line
    const page = await pdf.getPage(numPage);
    // eslint-disable-next-line
    const text = await page.getTextContent();

    if (Array.isArray(text.items)) {
      const { items } = text;
      const min = _getY(items[0]);
      let tmp = [];

      for (let i = 0; i < items.length; i += 1) {
        const y = _getY(items[i]);
        if (y <= min) {
          result.push(tmp);
          tmp = [];
        }
        tmp.push(items[i]);
      }

      if (tmp.length) result.push(tmp);
    }

    numPage += 1;
  }

  return result;
}

export async function genXlsx(pdfPath, xlsxPath, options) {
  const data = await genTextContextMatrix(pdfPath, options);

  const [first = [], ...rest] = data;
  // extract text
  const header = first.map((e) => e.str);
  const ws = XLSX.utils.aoa_to_sheet(rest.map((r) => r.map((e) => e.str)), header);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

  XLSX.writeFile(wb, xlsxPath);
}
