# cli.js

[Examples](https://github.com/bndynet/cli.js/tree/master/test) | [API](https://bndynet.github.io/cli.js/api/)

Powerful command line helpers for interactive Node.js scripts.

## Install

```bash
npm i @bndynet/cli
```

## Usage

```js
const cli = require('@bndynet/cli');

cli.info('Starting...');
cli.success({ ok: true });
```

The package exports:

- logging helpers: `print`, `log`, `info`, `warn`, `success`, `error`
- prompt helpers: `input`, `confirm`, `select`, `questions`, `suggest`, `ask`
- terminal helpers: `beginRun`, `beginReadFile`, `readFile`, `writeFile`, `replaceFileContent`
- progress helpers: `progress`, `Progress`
- text styles: `styles`

## Prompt Example

```js
const cli = require('@bndynet/cli');

async function main() {
  const answers = await cli.questions([
    'Please input your name:',
    'Home page is online?',
    ['Your country:', ['China', '', 'US']],
    ['Choose or type user name::', ['Bendy', 'Joyce']],
  ]);

  cli.success(answers);
}

main();
```

## Development

Install dependencies and build once before running the demos:

```bash
npm install
npm run build
```

Available demo commands:

- `npm test`: build the project and run the default log demo
- `npm run test:log`: log output demo
- `npm run test:io`: shell command/spinner demo
- `npm run test:progress`: progress bar demo
- `npm run test:question`: interactive prompt demo
- `npm start`: watch build
- `npm run docs`: generate API docs

## Screenshots

![](https://raw.githubusercontent.com/bndynet/cli.js/master/screenshots/log.png)

![](https://raw.githubusercontent.com/bndynet/cli.js/master/screenshots/questions.png)
