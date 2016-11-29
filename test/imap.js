/**
 * Created by xialei on 16-11-29.
 */
import should from 'should';
import {describe, it} from 'mocha';
const config = require('../config.json');
import IMAP from '../lib/imap';
describe('imap', function () {
  this.timeout(30000);
  const imap = new IMAP();
  it('connect to imap server', async() => {
    const resp = await imap.connect(config.imap);
    should(resp.indexOf('OK') !== -1).be.exactly(true);
  });
  it('login to imap server', async() => {
    const resp = await imap.login(config.username, config.password);
    should(resp.indexOf('OK') !== -1).be.exactly(true);
  });
});