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
    debug(`connect to ${options.host}:${options.port} tls ${options.tls ? 'true' : 'false'}`);
    const s = options.tls ? tls : net;
    this._socket = s.connect(options);
    this._socket.setEncoding(options.encoding);
    debug(`set encoding to ${options.encoding}`);

    return new Promise((resolve) => {
      this._socket.on('data', resolve);
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
      this._socket.on('data', (data) => {
        debug(command);
        debug(data);
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
      return {
        name: matches[3],
        path: matches[2],
        flags: matches[1].split(' ')
      };
    });
    list = list.filter((item) => item !== null);
    return list;
  }

  async select(name) {

  }
}