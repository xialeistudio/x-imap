/**
 * Created by xialei on 16-11-29.
 */
import tls from 'tls';
import net from 'net';
const debug = require('debug')('imap:session');
export default class IMAP {
  constructor() {
    this._socket = null;
  }

  /**
   * connect server
   * @param options
   */
  connect(options = {}) {
    options.tls = options.tls || false;
    options.port = options.port || 143;
    options.encoding = options.encoding || 'utf-8';
    const s = options.tls ? tls : net;
    this._socket = s.connect(options);
    this._socket.setEncoding(options.encoding);

    return new Promise((resolve) => {
      this._socket.once('data', resolve);
    });
  }

  /**
   * execute Command
   * @param command
   * @returns {Promise}
   * @private
   */
  _executeCommand(command) {
    if (this._socket === null || this._socket.authorized === false) {
      throw new Error('server not connected');
    }
    return new Promise((resolve) => {
      this._socket.once('data', (data) => {
        debug(command, '=> ', data.split('\r\n').join(' '));
        resolve(data);
      });
      process.nextTick(() => {
        this._socket.write(`${command}\r\n`);
      });
    });
  }

  /**
   * login to server
   * @param username
   * @param password
   * @returns {Promise}
   */
  async login(username, password) {
    const command = `A01 LOGIN ${username} ${password}`;
    const data = await this._executeCommand(command);
    if (!/^A01\s?OK/.test(data)) {
      throw new Error(data);
    }
    return data;
  }

  /**
   * get all boxes
   * @returns {Promise}
   */
  async list() {
    const command = 'A01 LIST "" *';
    const data = await this._executeCommand(command);
    if (data.indexOf('A01 OK') === -1) {
      throw new Error(data);
    }
    //parse box list
    let list = data.split('\r\n');
    list = list.map((item) => {
      if (item.indexOf('*') === -1) {
        return null;
      }
      const matches = item.match(/^\*\sLIST\s\((.*?)\)\s"(.*?)"\s"(.*?)"/);
      if (matches === null) {
        return null;
      }
      return {
        name: matches[3],
        path: matches[2],
        flags: matches[1].split(' ')
      };
    });
    list = list.filter((item) => item !== null);
    return list;
  }

  /**
   * select a box
   * @param name
   * @returns {Promise}
   */
  async select(name) {
    const command = `A01 SELECT ${name}`;
    const data = await this._executeCommand(command);
    if (data.indexOf('A01 NO') !== -1) {
      throw new Error(data);
    }

    const resp = {
      count: {},
      flags: []
    };
    const count = data.match(/\*\s(\d+)\s([A-Z]+)/g);
    if (count !== null) {
      count.forEach((item) => {
        item = item.split(' ');
        resp.count[item[2]] = parseInt(item[1]);
      });
      const flags = data.match(/\*\sFLAGS\s\((.*?)\)/);
      if (flags !== null) {
        resp.flags = flags[1].split(' ');
      }
    }
    return resp;
  }

  /**
   * Search all Mails
   */
  async searchAll() {
    const command = 'A01 SEARCH ALL';
    let data = await this._executeCommand(command);
    data = data.match(/\*\sSEARCH(\s\d+)+/g);
    if (data === null) {
      return [];
    }
    data = data[0].match(/(\d+)/g);
    return data.map(a => parseInt(a));
  }

  /**
   * Search new Mails
   */
  async searchNew() {
    const command = 'A01 SEARCH NEW';
    let data = await this._executeCommand(command);
    data = data.match(/\*\sSEARCH(\s\d+)+/g);
    if (data === null) {
      return [];
    }
    data = data[0].match(/(\d+)/g);
    return data.map(a => parseInt(a));
  }
}