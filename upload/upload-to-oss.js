const fs = require('fs');
const co = require('co');
const path = require('path');
const oss = require('ali-oss');
 
const store = oss({
  accessKeyId: process.env.AccessKey_ID,
  accessKeySecret: process.env.Access_Key_Secret,
  bucket: 'dev-caizhanfuwu-com-live',
  region: 'oss-cn-hangzhou',
});
 
(() => {
  const root = path.resolve(__dirname, '../dist');
  const files = [];
  function readDirSync(p) {
    const pa = fs.readdirSync(p);
    pa.forEach((e) => {
      const cur_path = `${p}/${e}`;
      const info = fs.statSync(cur_path);
      if (info.isDirectory()) {
        readDirSync(cur_path);
      } else {
        files.push(cur_path);
      }
    });
  }
  readDirSync(root);
  co(function* () {
    for (let index = 0; index < files.length; index += 1) {
      const e = files[index];
      const result = yield store.put(e.replace(root, '/m-live'), e);
      console.log(result);
    }
  });
})();
