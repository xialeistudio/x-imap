'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _iconvLite = require('iconv-lite');

var _iconvLite2 = _interopRequireDefault(_iconvLite);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 解析QQ邮箱正文
 */
var TencentParser = function () {
  function TencentParser(buffer) {
    (0, _classCallCheck3.default)(this, TencentParser);

    this.buffer = buffer;
  }

  (0, _createClass3.default)(TencentParser, [{
    key: 'parse',
    value: function parse() {
      var body = this.buffer.toString('utf8');
      body = body.replace(/\r/g, '');
      var regex = /------=_NextPart\S+\sContent-Type:\s?([^;]*);\s+charset="(.*?)"\s+Content-Transfer-Encoding:\s?base64\s+([^-]*)/g;
      var parts = body.match(regex);
      var resp = {};
      parts.map(function (item) {
        var regex = /------=_NextPart\S+\sContent-Type:\s?([^;]*);\s+charset="(.*?)"\s+Content-Transfer-Encoding:\s?base64\s+([^-]*)/;
        var matches = item.match(regex);
        var buffer = new Buffer(matches[3].replace(/\n/g, ''), 'base64');
        if (matches[1] === 'text/plain') {
          resp.text = _iconvLite2.default.decode(buffer, matches[2]);
        } else if (matches[1] === 'text/html') {
          resp.html = _iconvLite2.default.decode(buffer, matches[2]);
        }
      });
      return resp;
    }
  }]);
  return TencentParser;
}();

exports.default = TencentParser;