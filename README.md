# NodeJs IMAP Library
NodeJs IMAP 操作类库
## 初始化
```bash
npm install x-imap --save
```
## 单元测试
1. 在x-imap模块根目录下新建config.json文件，内容如下:
```json
{
  "username": "邮箱帐号",
  "password": "邮箱密码",
  "imap": {
    "host": "imap.qq.com",
    "port": 993,
    "tls": true
  }
}
```
2. 打开终端，执行：
```bash
npm run test
```