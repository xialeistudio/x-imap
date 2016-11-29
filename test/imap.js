/**
 * Created by xialei on 16-11-29.
 */
import should from 'should';
import {describe, it} from 'mocha';
const config = require('../config.json');
var IMAP = require('../index').IMAP;
var BodyParser = require('../index').BodyParser;
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
  it('status', async() => {
    const d = await imap.status('INBOX');
    should(d.name).be.exactly('INBOX');
  });

  it('open INBOX', async() => {
    const d = await imap.openBox('INBOX');
    should(d.name).be.exactly('INBOX');
  });
  it('search INBOX', async() => {
    const d = await imap.search(['ALL']);
    mailId = d[0];
    should(d).be.a.Array();
  });
  it('fetch MAIL', async() => {
    const f = await imap.fetch(mailId, {
      bodies: ['HEADER.FIELDS (SUBJECT TO DATE)', 'TEXT']
    }, {name: BodyParser.TencentParser});
    should(f.body.html ? f.body.html : f.body).be.a.String();
  });
  it('close INBOX', async function () {
    await imap.closeBox();
  });
  it('disconnect', () => {
    const d = imap.disconnect();
    should(d).be.exactly(undefined);
  });
});