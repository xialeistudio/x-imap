/**
 * Created by xialei on 16-11-29.
 */
import Imap from 'imap';
import Promise from 'bluebird';
import BufferHelper from 'bufferhelper';
import iconv from 'iconv-lite';
import BodyParser from './BodyParser';
export default class IMAP {

  constructor(options) {
    this.imap = new Imap(options);
  }

  /**
   * 连接服务器
   */
  connect() {
    return new Promise(resolve => {
      this.imap.once('ready', resolve);
      this.imap.connect();
    });
  }

  /**
   * 断开连接
   */
  disconnect() {
    this.imap.destroy();
  }

  /**
   * 读取所有目录
   * @param namespace
   */
  getBoxes(namespace = '') {
    return new Promise((resolve, reject) => {
      this.imap.getBoxes(namespace, (e, boxes) => {
        e ? reject(e) : resolve(boxes);
      });
    });
  }

  /**
   * 打开邮箱
   * @param name
   * @param readOnly
   */
  openBox(name, readOnly = false) {
    return new Promise((resolve, reject) => {
      this.imap.openBox(name, readOnly, function (e, mailbox) {
        e ? reject(e) : resolve(mailbox);
      });
    });
  }

  /**
   * 关闭邮箱
   * @param autoExpunge
   */
  closeBox(autoExpunge = true) {
    return new Promise((resolve, reject) => {
      this.imap.closeBox(autoExpunge, function (e) {
        e ? reject(e) : resolve();
      });
    });
  }

  /**
   * 添加邮箱
   * @param name
   */
  addBox(name) {
    return new Promise((resolve, reject) => {
      this.imap.addBox(name, function (e) {
        e ? reject(e) : resolve();
      });
    });
  }

  /**
   * 删除邮箱
   * @param name
   */
  delBox(name) {
    return new Promise((resolve, reject) => {
      this.imap.delBox(name, function (e) {
        e ? reject(e) : resolve();
      });
    });
  }

  /**
   * 重命名邮箱
   * @param oldName
   * @param newName
   */
  renameBox(oldName, newName) {
    return new Promise((resolve, reject) => {
      this.imap.renameBox(oldName, newName, function (e) {
        e ? reject(e) : resolve();
      });
    });
  }

  /**
   * 邮箱状态
   * @param name
   */
  status(name) {
    return new Promise((resolve, reject) => {
      this.imap.status(name, function (e, box) {
        e ? reject(e) : resolve(box);
      });
    });
  }

  /**
   * 搜索邮箱
   * @param criteria
   */
  search(criteria) {
    return new Promise((resolve, reject) => {
      this.imap.search(criteria, function (e, ids) {
        e ? reject(e) : resolve(ids);
      });
    });
  }

  /**
   * 获取邮件
   * @param source
   * @param options
   * @param bodyParser
   */
  fetch(source, options, bodyParser = {name: BodyParser.StandardParser, options: {encoding: 'utf8'}}) {
    return new Promise((resolve, reject) => {
      const data = {};
      this.imap.fetch(source, options)
        .once('message', (msg) => {
          msg.on('body', (stream, info) => {
            let headers = '', body = new BufferHelper;
            stream.on('data', (chunk) => {
              if (info.which.indexOf('HEADER') === -1) {
                body.concat(chunk);
              } else {
                headers += chunk.toString('utf8');
              }
            });
            stream.on('end', () => {
              if (info.which.indexOf('HEADER') === -1) {
                const parser = new bodyParser.name(body.toBuffer(), bodyParser.options);
                data.body = parser.parse();
              } else {
                data.headers = Imap.parseHeader(headers);
              }
            });
          });
          msg.once('attributes', (attrs) => {
            data.attrs = attrs;
          });
          msg.once('end', () => resolve(data));
        })
        .once('error', reject);
    });
  }
}