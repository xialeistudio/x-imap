'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 标准解析
 */
var StandardParser = function () {
  function StandardParser(buffer, _ref) {
    var _ref$encoding = _ref.encoding,
        encoding = _ref$encoding === undefined ? 'utf8' : _ref$encoding;
    (0, _classCallCheck3.default)(this, StandardParser);

    this.buffer = buffer;
    this.encoding = encoding;
  }

  (0, _createClass3.default)(StandardParser, [{
    key: 'parse',
    value: function parse() {
      return this.buffer.toString(this.encoding);
    }
  }]);
  return StandardParser;
}();

exports.default = StandardParser;