module.exports = {
  hi: showLoading,
};

const cli = require('../dist/cli.umd.js');

function showLoading() {
  cli.beginRun('npm i', (code) => {
    cli.log(`I am ${code}`);
  });
}
