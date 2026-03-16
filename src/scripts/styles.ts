/* eslint-disable @typescript-eslint/no-explicit-any */
import chalk from 'chalk';

function styleText(text: any, styleFunction?: (input: string) => string): string {
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
