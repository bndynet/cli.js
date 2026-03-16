/* eslint-disable @typescript-eslint/no-explicit-any */
import { icons } from './icons';
import { styles } from './styles';

const out = console.log;
const lineLength = 80;

function stringifyText(text: any): string {
  return typeof text === 'string' ? text : styles.default(text);
}

function printWithPrefix(text: any, prefix: string, formatter: (value: string | object) => string): void {
  out(formatter(`${prefix} ${stringifyText(text)}`));
}

export function print(text: any): void {
  out(text);
}

export function log(text: any): void {
  if (!text) {
    return;
  }
  printWithPrefix(text, icons.arrowRight, styles.default);
}

export function info(text: any): void {
  if (!text) {
    return;
  }
  printWithPrefix(text, icons.info, styles.info);
}

export function warn(text: any): void {
  if (!text) {
    return;
  }
  printWithPrefix(text, icons.warn, styles.warn);
}

export function success(text: any): void {
  if (!text) {
    return;
  }
  printWithPrefix(text, icons.ok, styles.success);
}

export function error(text: any): void {
  if (!text) {
    return;
  }
  printWithPrefix(text, icons.error, styles.error);
}

export function startSection(title: any): void {
  const fills = (lineLength - title.length) / 2;
  const titleLine = ` ${title} `
    .toUpperCase()
    .padStart(fills + title.length, '=')
    .padEnd(fills * 2 + title.length, '=');
  out('');
  out('');
  out(styles.bold(titleLine));
}

export function endSection(): void {
  const text = 'END';
  const fills = (lineLength - text.length) / 2;
  const titleLine = ` END `
    .toUpperCase()
    .padStart(fills + text.length, '=')
    .padEnd(fills * 2 + text.length, '=');
  out(titleLine);
  out('');
  out('');
}
