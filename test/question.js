module.exports = {
  hi: showQuestions,
};

const cli = require('../dist/cli.umd.js');

function showQuestions() {
  cli.startSection('Questions');
  cli
    .questions(['Please input your name:', 'Please input your age:', 'Please your home page:', 'Home page is online?', ['Your country:', ['China', '', 'US']]])
    .then((res) => {
      cli.success('Your answers as JSON:', true);
      cli.success(res);
      cli.log(`
      My name is ${cli.styles.info(cli.styles.bold(res[0]))}, and I am ${cli.styles.bold(res[1])}.
      My home page is at ${cli.styles.link(res[2])} and it's ${res[3] ? 'online' : 'offline'}. I come from ${cli.styles.bold(res[4])}.
    `);
    })
    .finally(() => {
      cli.endSection();
    });
}
