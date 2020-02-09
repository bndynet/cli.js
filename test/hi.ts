const clr = require('../dist/clr.umd.js');
const styles = clr.styles;

clr.startSection('Log Print');
clr.info('Hello World!', true);
clr.warn('Hello World!', true);
clr.error('Hello World!', true);
clr.success('Hello World!', true);
clr.endSection();

clr.startSection('IO');
clr.log('Begin to write README.md...');
clr.replaceFileContent('../README.md', 'clr', 'clr');
clr.endSection();

clr.startSection('Package File');
clr.log(clr.getPackage('../package.json'));
clr.endSection();

clr.startSection('Questions');
clr
  .questions(['Please input your name:', 'Please input your age:', 'Please your home page:', 'Home page is online?', ['Your country:', ['China', 'US']]])
  .then((res: any) => {
    clr.success('Your answers as JSON:', true);
    clr.success(res);
    clr.log(`
    My name is ${styles.info(styles.bold(res[0]))}, and I am ${styles.bold(res[1])}.
    My home page is at ${clr.styles.link(res[2])} and it's ${res[3] ? 'online' : 'offline'}. I come from ${styles.bold(res[4])}.
  `);
  })
  .finally(() => {
    clr.endSection();
  });
