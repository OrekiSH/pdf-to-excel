(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define("pdf2excel", ["exports", "pdfjs-dist", "xlsx", "regenerator-runtime/runtime"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("pdfjs-dist"), require("xlsx"), require("regenerator-runtime/runtime"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.pdfjsLib, global.XLSX, global.runtime);
    global.pdf2excel = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _pdfjsDist, _xlsx, _runtime) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.genTextContextMatrix = genTextContextMatrix;
  _exports.genXlsx = genXlsx;
  _xlsx = _interopRequireDefault(_xlsx);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

  function _toArray(arr) { return _arrayWithHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableRest(); }

  function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

  function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

  function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

  function _getY(item) {
    if (item && Array.isArray(item.transform)) {
      return item.transform[4] || -1;
    }

    return -1;
  }

  function genTextContextMatrix(_x) {
    return _genTextContextMatrix.apply(this, arguments);
  }

  function _genTextContextMatrix() {
    _genTextContextMatrix = _asyncToGenerator(regeneratorRuntime.mark(function _callee(path) {
      var options,
          onProgress,
          start,
          end,
          result,
          numPage,
          numPages,
          pdf,
          page,
          text,
          items,
          min,
          tmp,
          i,
          y,
          _args = arguments;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              options = _args.length > 1 && _args[1] !== undefined ? _args[1] : {};
              onProgress = options.onProgress, start = options.start, end = options.end;
              result = [];
              numPage = 1;
              numPages = 0;

              if (typeof start === 'number' && typeof end === 'number' && start < end) {
                numPage = start;
                numPages = end;
              }

              _context.next = 8;
              return (0, _pdfjsDist.getDocument)(path).promise;

            case 8:
              pdf = _context.sent;

              if (typeof pdf.numPages === 'number' && numPages === 0) {
                numPages = pdf.numPages;
              }

            case 10:
              if (!(numPage <= numPages)) {
                _context.next = 22;
                break;
              }

              if (typeof onProgress === 'function') {
                onProgress({
                  numPage: numPage,
                  numPages: numPages
                });
              }

              _context.next = 14;
              return pdf.getPage(numPage);

            case 14:
              page = _context.sent;
              _context.next = 17;
              return page.getTextContent();

            case 17:
              text = _context.sent;

              if (Array.isArray(text.items)) {
                items = text.items;
                min = _getY(items[0]);
                tmp = [];

                for (i = 0; i < items.length; i += 1) {
                  y = _getY(items[i]);

                  if (y <= min) {
                    result.push(tmp);
                    tmp = [];
                  }

                  tmp.push(items[i]);
                }

                if (tmp.length) result.push(tmp);
              }

              numPage += 1;
              _context.next = 10;
              break;

            case 22:
              return _context.abrupt("return", result);

            case 23:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));
    return _genTextContextMatrix.apply(this, arguments);
  }

  function genXlsx(_x2, _x3, _x4) {
    return _genXlsx.apply(this, arguments);
  }

  function _genXlsx() {
    _genXlsx = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(pdfPath, xlsxPath, options) {
      var data, _data, _data$, first, rest, header, ws, wb;

      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return genTextContextMatrix(pdfPath, options);

            case 2:
              data = _context2.sent;
              _data = _toArray(data), _data$ = _data[0], first = _data$ === void 0 ? [] : _data$, rest = _data.slice(1);
              header = first.map(function (e) {
                return e.str;
              });
              ws = _xlsx["default"].utils.aoa_to_sheet(rest.map(function (r) {
                return r.map(function (e) {
                  return e.str;
                });
              }), header);
              wb = _xlsx["default"].utils.book_new();

              _xlsx["default"].utils.book_append_sheet(wb, ws, 'Sheet1');

              _xlsx["default"].writeFile(wb, xlsxPath);

            case 9:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));
    return _genXlsx.apply(this, arguments);
  }
});