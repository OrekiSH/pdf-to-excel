# pdf-to-excel
Convert PDFs to editable Excel spreadsheets

## node
```shell
npm i pdf-to-excel;
```

```js
-- foo.js
-- foo.pdf

// foo.js
const pdf2excel = require('pdf-to-excel');

try {
  const options = {
    // when current pdf page number changes call this function(optional)
    onProcess: (e) => console.warn(`${e.numPage} / ${e.numPages}`),
    // pdf start page number you want to convert (optional, default 1)
    start: 1,
    // pdf end page number you want to convert (optional, default )
    end: 2,
  }

  pdf2excel.genXlsx('foo.pdf', 'bar.xlsx', options);
} catch (err) {
  console.error(err);
}
```

## browser

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.3.200/pdf.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.15.5/xlsx.full.min.js"></script>
<script src="/lib/index.js"></script>

<script>
  try {
    // bar.pdf in your static file server's root dir.
    pdf2excel.genXlsx('/bar.pdf', 'bar.xlsx');
  } catch (err) {
    console.error(err);
  }
</script>
```