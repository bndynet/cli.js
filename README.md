# cli.js

Powerful Command Line Interface

## Getting Started

`$ npm i @bndynet/cli -D` to install the package.

```javascript
const cli = require('@bndynet/cli');
const styles = cli.styles;

cli.startSection('Log Print');
cli.info('Hello World!', true);
cli.warn('Hello World!', true);
cli.error('Hello World!', true);
cli.success('Hello World!', true);
cli.endSection();

cli.startSection('IO');
cli.log('Begin to write README.md...');
cli.replaceFileContent('../README.md', 'cli', 'cli');
cli.endSection();

cli.startSection('Package File');
cli.log(cli.getPackage('../package.json'));
cli.endSection();

cli.startSection('Questions');
cli
  .questions([
    'Please input your name:',
    'Please input your age:',
    'Please your home page:',
    'Is home page online?',
    ['Your country:', ['China', 'US']]])
  .then(function(res) {
    cli.log(`
    My name is ${styles.info(styles.bold(res[0]))}, and I am ${styles.bold(res[1])}.
    My home page is at ${cli.styles.link(res[2])} and it's ${res[3] ? 'online' : 'offline'}. I come from ${styles.bold(res[4])}.
  `);
  })
  .finally(function() {
    cli.endSection();
  });
```


## Screenshots

![](https://raw.githubusercontent.com/bndynet/cli.js/master/screenshots/log.png)

![](https://raw.githubusercontent.com/bndynet/cli.js/master/screenshots/questions.png)


## Development
```
$ npm start
& npm test
```