const pdfjs = require('pdfjs-dist');
const XLSX = require('xlsx');

// utils
function _getY(item) {
  // scaleX, scale01, scale10, scaleY, x, y
  if (item && Array.isArray(item.transform)) {
    return item.transform[4] || -1;
  }

  return -1;
}

export async function genTextContextMatrix(pathOrArrayBuffer, options = {}) {
  const { onProgress, start, end } = options;
  
  let result = [];
  let numPage = 1;
  let numPages = 0;
  if (typeof start === 'number' && typeof end === 'number' && start < end) {
    numPage = start;
    numPages = end;
  }
  
  const pdf = await pdfjs.getDocument(pathOrArrayBuffer);
  // set end
  if (typeof pdf.numPages === 'number' && numPages === 0) {
    numPages = pdf.numPages;
  }
  // page increase
  while (numPage < numPages) { 
    const page = await pdf.getPage(numPage);
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

    if (typeof onProgress === 'function') {
      onProgress(numPage);
    }
  }

  return result;
}

export async function genXlsx(pdfPathOrArrayBuffer, xlsxPath, options) {
  const data = await genTextContextMatrix(pdfPathOrArrayBuffer, options);

  const [first = [], ...rest] = data;
  // extract text
  const ws = XLSX.utils.json_to_sheet(rest.map(r => r.map(e => e.str)), first.map(e => e.str));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

  XLSX.writeFile(wb, xlsxPath);
}