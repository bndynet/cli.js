/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
const chalk = require('chalk');

function styleText(text: any, styleFunction?: Function): string {
  if (typeof text !== 'string') {
    text = JSON.stringify(text, null, 2);
  }
  return styleFunction ? styleFunction(text) : text;
}

export const styles = {
  default: (text: string | object): string => styleText(text),
  info: (text: string | object): string => styleText(text, chalk.blue),
  warn: (text: string | object): string => styleText(text, chalk.yellowBright),
  success: (text: string | object): string => styleText(text, chalk.green),
  error: (text: string | object): string => styleText(text, chalk.red),

  bold: (text: string | object): string => styleText(text, chalk.bold),
  link: (text: string | object): string => styleText(text, chalk.underline),
  highlight: (text: string | object): string => styleText(text, chalk.inverse),
};
