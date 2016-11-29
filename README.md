# NodeJs IMAP Library
NodeJs IMAP 操作类库
## 测试通过邮箱
+ 新浪邮箱 imap.sina.cn
+ QQ邮箱 imap.qq.com
## 使用方法
```javascript
var IMAP = require('x-imap').IMAP;
var BodyParser = require('x-imap').BodyParser;
```
## 单元测试
1. 在x-imap模块根目录下新建config.json文件，内容如下:
```json
{
  "user": "邮箱账号",
  "password": "密码",
  "host": "imap.qq.com",
  "port": 993,
  "tls": true
}
```
2. 打开终端，执行：
```bash
npm run test
```