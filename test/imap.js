/**
 * Created by xialei on 16-11-29.
 */
import should from 'should';
import {describe, it} from 'mocha';
const config = require('../config.json');
import IMAP from '../lib/imap';
import _ from 'underscore';
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
  it('get all boxes', async() => {
    const resp = await imap.list();
    should(_.findWhere(resp, {name: 'INBOX'})).not.be.exactly(undefined);
  });
  it('select a box', async() => {
    const resp = await imap.select('INBOX');
    should(resp.flags.length > 0).be.exactly(true);
  });
  it('search all mails', async() => {
    const resp = await imap.searchAll();
    should(resp).be.a.Array();
  });
  it('search new mails', async() => {
    const resp = await imap.searchNew();
    should(resp).be.a.Array();
  });
});