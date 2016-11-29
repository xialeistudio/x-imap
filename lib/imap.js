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
   * login to server
   * @param username
   * @param password
   * @returns {Promise}
   */
  async login(username, password) {
    if (this._socket === null || this._socket.authorized === false) {
      throw new Error('server not connected');
    }
    return new Promise((resolve, reject) => {
      this._socket.on('data', (data) => {
        debug(data);
        /^A01\s?OK/.test(data) ? resolve(data) : reject(new Error(data));
      });
      //send login directive
      process.nextTick(() => {
        this._socket.write(`A01 LOGIN ${username} ${password}\n`);
      });
    });
  }
}