/* eslint-disable @typescript-eslint/no-explicit-any */
import { icons } from './icons';
import { styles } from './styles';

const out = console.log;
const lineLength = 80;

export function print(text: any): void {
  out(text);
}

export function log(text: any): void {
  if (!text) {
    return;
  }
  out(styles.default(icons.arrowRight + ' ' + text));
}

export function info(text: any): void {
  if (!text) {
    return;
  }
  out(styles.info(icons.info + ' ' + text));
}

export function warn(text: any): void {
  if (!text) {
    return;
  }
  out(styles.warn(icons.warn + ' ' + text));
}

export function success(text: any): void {
  if (!text) {
    return;
  }
  out(styles.success(icons.ok + ' ' + text));
}

export function error(text: any): void {
  if (!text) {
    return;
  }
  out(styles.error(icons.error + ' ' + text));
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
