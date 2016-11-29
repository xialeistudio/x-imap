import iconv from 'iconv-lite';
/**
 * 解析QQ邮箱正文
 */
export default class TencentParser {
  constructor(buffer) {
    this.buffer = buffer;
  }

  parse() {
    let body = this.buffer.toString('utf8');
    body = body.replace(/\r/g, '');
    const regex = /------=_NextPart\S+\sContent-Type:\s?([^;]*);\s+charset="(.*?)"\s+Content-Transfer-Encoding:\s?base64\s+([^-]*)/g;
    const parts = body.match(regex);
    const resp = {};
    parts.map((item) => {
      const regex = /------=_NextPart\S+\sContent-Type:\s?([^;]*);\s+charset="(.*?)"\s+Content-Transfer-Encoding:\s?base64\s+([^-]*)/;
      const matches = item.match(regex);
      const buffer = new Buffer(matches[3].replace(/\n/g, ''), 'base64');
      if (matches[1] === 'text/plain') {
        resp.text = iconv.decode(buffer, matches[2]);
      } else if (matches[1] === 'text/html') {
        resp.html = iconv.decode(buffer,matches[2]);
      }
    });
    return resp;
  }
}
