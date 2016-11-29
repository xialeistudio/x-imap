/**
 * 标准解析
 */
export default class StandardParser {
  constructor(buffer, {encoding = 'utf8'}) {
    this.buffer = buffer;
    this.encoding = encoding;
  }

  parse() {
    return this.buffer.toString(this.encoding);
  }
}
