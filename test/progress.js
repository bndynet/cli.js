module.exports = {
  hi: showProgress,
};

var path = require('path');
var cli = require('../dist/cli.umd.js');

function showProgress() {
  const p = cli.progress().show();
  const interval = setInterval(() => {
    p.increase();
  }, 100);
  setTimeout(() => {
    clearInterval(interval);
  }, 15000);
}

function showProgresForReadFile() {
  let p;
  cli.beginReadFile(path.resolve(__dirname, '../package.json'), function(buffer, readSize, size) {
    if (!p) {
      p = cli.progress(size, '{file} {cur}/{total}', { file: 'package.json', cur: 0, total: size }).show();
    } else {
      p.update(readSize, { cur: readSize });
      if (readSize >= size) {
        p.done();
        cli.print(buffer.toString('utf8'));
      }
    }
  });
}

