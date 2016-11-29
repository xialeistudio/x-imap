'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _StandardParser = require('./StandardParser');

var _StandardParser2 = _interopRequireDefault(_StandardParser);

var _TencentParser = require('./TencentParser');

var _TencentParser2 = _interopRequireDefault(_TencentParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = { StandardParser: _StandardParser2.default, TencentParser: _TencentParser2.default };