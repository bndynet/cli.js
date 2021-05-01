module.exports = {
  hi: showQuestions,
};

const cli = require('../dist/cli.umd.js');

const arra = ['Bendy', 'Joyce'];
const objectArra = [
  {
    id: 'b',
    name: 'Bendy Zhang',
    email: 'zb@bndy.net',
  },
  {
    id: 't',
    name: 'Joyce Tu',
    email: 'tu@ran.com',
  },
];

function suggest() {
  cli
    .suggest('Your email', objectArra, item => item.email)
    .then(a => {
      cli.log(a);
    });
}

function showQuestions() {
  cli.startSection('Questions');
  cli
    .questions([
      'Please input your name:', // input
      'Please input your age:', // input number
      'Please your home page:', // input
      'Home page is online?', // confirm
      ['Your country:', ['China', '', 'US']], // select
      ['Choose or type user name::', arra], // suggest
      ['Choose or type a user::', objectArra], // suggest
    ])
    .then(res => {
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
