/**
 * Created by xialei on 16-11-29.
 */
import should from 'should';
import {describe, it} from 'mocha';
const config = require('../config.json');
import IMAP from '../src/imap';

describe('test imap', function () {
  this.timeout(30000);
  const imap = new IMAP(config);
  let mailId = 0;
  it('connect', async() => {
    const d = await imap.connect();
    should(d).be.exactly(undefined);
  });
  it('getBoxes', async() => {
    const d = await imap.getBoxes();
    should(d.INBOX).be.a.Object();
  });
  it.skip('status', async() => {
    const d = await imap.status('INBOX');
    should(d.name).be.exactly('INBOX');
  });

  it('open INBOX', async() => {
    const d = await imap.openBox('INBOX');
    should(d.name).be.exactly('INBOX');
  });
  it('search INBOX', async() => {
    const d = await imap.search(['UNSEEN']);
    mailId = d[0];
    should(d).be.a.Array();
  });
  it('fetch MAIL', async() => {
    const f = await imap.fetch(mailId, {
      bodies: 'TEXT'
    });
    // should(f.header.date).be.a.Object();
    console.log(f);
  });
  it('close INBOX', async function () {
    await imap.closeBox();
  });
  it('disconnect', async() => {
    const d = await imap.disconnect();
    should(d).be.exactly(undefined);
  });
});