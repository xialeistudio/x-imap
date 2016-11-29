'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _imap = require('imap');

var _imap2 = _interopRequireDefault(_imap);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _util = require('util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var IMAP = function () {
  function IMAP(options) {
    (0, _classCallCheck3.default)(this, IMAP);

    this.imap = new _imap2.default(options);
  }

  /**
   * 连接服务器
   */


  (0, _createClass3.default)(IMAP, [{
    key: 'connect',
    value: function connect() {
      var _this = this;

      return new _bluebird2.default(function (resolve) {
        _this.imap.once('ready', resolve);
        _this.imap.connect();
      });
    }

    /**
     * 断开连接
     */

  }, {
    key: 'disconnect',
    value: function disconnect() {
      var _this2 = this;

      return new _bluebird2.default(function (resolve, reject) {
        _this2.imap.once('close', function (hasError) {
          return hasError ? reject(new Error('error')) : resolve();
        });
        _this2.imap.destroy();
      });
    }

    /**
     * 读取所有目录
     * @param namespace
     */

  }, {
    key: 'getBoxes',
    value: function getBoxes() {
      var _this3 = this;

      var namespace = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

      return new _bluebird2.default(function (resolve, reject) {
        _this3.imap.getBoxes(namespace, function (e, boxes) {
          e ? reject(e) : resolve(boxes);
        });
      });
    }

    /**
     * 打开邮箱
     * @param name
     * @param readOnly
     */

  }, {
    key: 'openBox',
    value: function openBox(name) {
      var _this4 = this;

      var readOnly = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      return new _bluebird2.default(function (resolve, reject) {
        _this4.imap.openBox(name, readOnly, function (e, mailbox) {
          e ? reject(e) : resolve(mailbox);
        });
      });
    }

    /**
     * 关闭邮箱
     * @param autoExpunge
     */

  }, {
    key: 'closeBox',
    value: function closeBox() {
      var _this5 = this;

      var autoExpunge = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      return new _bluebird2.default(function (resolve, reject) {
        _this5.imap.closeBox(autoExpunge, function (e) {
          e ? reject(e) : resolve();
        });
      });
    }

    /**
     * 添加邮箱
     * @param name
     */

  }, {
    key: 'addBox',
    value: function addBox(name) {
      var _this6 = this;

      return new _bluebird2.default(function (resolve, reject) {
        _this6.imap.addBox(name, function (e) {
          e ? reject(e) : resolve();
        });
      });
    }

    /**
     * 删除邮箱
     * @param name
     */

  }, {
    key: 'delBox',
    value: function delBox(name) {
      var _this7 = this;

      return new _bluebird2.default(function (resolve, reject) {
        _this7.imap.delBox(name, function (e) {
          e ? reject(e) : resolve();
        });
      });
    }

    /**
     * 重命名邮箱
     * @param oldName
     * @param newName
     */

  }, {
    key: 'renameBox',
    value: function renameBox(oldName, newName) {
      var _this8 = this;

      return new _bluebird2.default(function (resolve, reject) {
        _this8.imap.renameBox(oldName, newName, function (e) {
          e ? reject(e) : resolve();
        });
      });
    }

    /**
     * 邮箱状态
     * @param name
     */

  }, {
    key: 'status',
    value: function status(name) {
      var _this9 = this;

      return new _bluebird2.default(function (resolve, reject) {
        _this9.imap.status(name, function (e, box) {
          e ? reject(e) : resolve(box);
        });
      });
    }

    /**
     * 搜索邮箱
     * @param criteria
     */

  }, {
    key: 'search',
    value: function search(criteria) {
      var _this10 = this;

      return new _bluebird2.default(function (resolve, reject) {
        _this10.imap.search(criteria, function (e, ids) {
          e ? reject(e) : resolve(ids);
        });
      });
    }

    /**
     * 获取邮件
     * @param source
     * @param options
     */

  }, {
    key: 'fetch',
    value: function fetch(source, options) {
      var _this11 = this;

      return new _bluebird2.default(function (resolve, reject) {
        var data = {};
        _this11.imap.seq.fetch(source, options).once('message', function (msg) {
          msg.on('body', function (stream, info) {
            var header = '',
                body = '';
            stream.on('data', function (chunk) {
              if (info.which.indexOf('HEADER') !== -1) {
                header += chunk.toString('utf8');
              } else {
                body += chunk.toString('utf8');
              }
            });
            stream.on('end', function () {
              if (info.which.indexOf('HEADER') !== -1) {
                data.header = _imap2.default.parseHeader(header);
              } else {
                data.body = body;
              }
            });
          });
          msg.once('attributes', function (attrs) {
            data.attrs = attrs;
          });
          msg.once('end', function () {
            return resolve(data);
          });
        }).once('error', reject);
      });
    }
  }]);
  return IMAP;
}(); /**
      * Created by xialei on 16-11-29.
      */


exports.default = IMAP;