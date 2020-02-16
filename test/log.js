const cli = require('../dist/cli.umd.js');

module.exports = {
  hi: () => {
    cli.info('Hello World!');
    cli.warn('Hello World!');
    cli.error('Hello World!');
    cli.success('Hello World!');
  }
};
