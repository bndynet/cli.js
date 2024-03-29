/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Answers, Question } from 'inquirer';
import { toObjectIIfJsonString } from './utils';

const inquirer = require('inquirer');
const prompt = inquirer.prompt;

inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

enum AnswerType {
  String = 'input',
  Number = 'number',
  Boolean = 'confirm',
  List = 'list',
  RawList = 'rawlist',
  Password = 'password',
  Suggest = 'autocomplete',
}

function getQuestionObject(question: string, answerType?: AnswerType, additional?: object): Question {
  const answerKey = question.replace(/[^\w]+/g, '-');
  return {
    name: answerKey,
    type: answerType || AnswerType.String,
    message: question,
    ...additional,
  };
}

function askQuestion(question: Question): Promise<any> {
  return prompt([question]).then((res: any) => {
    if (res && question && question.name) {
      return res[question.name];
    }
  });
}

function getInputQuestionObject(question: string): Question {
  return getQuestionObject(question);
}

function getConfirmationQuestionObject(question: string): Question {
  return getQuestionObject(question, AnswerType.Boolean);
}

function getChoicesQuestion(question: string, options: string[]): Question {
  return getQuestionObject(question, AnswerType.RawList, {
    choices: options.map(option => (option === '' ? new inquirer.Separator() : option)),
  });
}

function getAutoCompleteQuestion(question: string, options: any[], fnGetValue?: (optionItem: any) => any): Question {
  return getQuestionObject(question.replace('::', ':'), AnswerType.Suggest, {
    suggestOnly: true,
    emptyText: '...',
    searchText: 'Suggesting for you...',
    source: (answer: Answers, input: string) => {
      const results = options.filter(item => {
        if (typeof item === 'string') {
          return item.toLowerCase().includes((input || '').toLowerCase());
        }
        const matched = Object.keys(item).findIndex(key => (item[key] || '').toLowerCase().includes((input || '').toLowerCase())) >= 0;
        return matched;
      });

      if (fnGetValue) {
        return results.map(fnGetValue);
      }

      return results.map(item => (typeof item !== 'string' ? JSON.stringify(item) : item));
    },
  });
}

//====================== Exports ===================================
export function input(question: string): Promise<string | boolean> {
  const questionObject = getInputQuestionObject(question);
  return askQuestion(questionObject);
}

export function confirm(question: string): Promise<boolean> {
  const questionObject = getConfirmationQuestionObject(question);
  return askQuestion(questionObject);
}

export function select(question: string, options: string[]): Promise<number> {
  const questionObject = getChoicesQuestion(question, options);
  return askQuestion(questionObject);
}

export function questions(questions: any[]): Promise<any[]> {
  const questionObjects = questions.map((question: any) => {
    if (typeof question === 'string') {
      if (question.endsWith('?')) {
        return getConfirmationQuestionObject(question);
      }
      return getInputQuestionObject(question);
    }
    if (Array.isArray(question) && question.length === 2) {
      if (question[0].endsWith('::')) {
        return getAutoCompleteQuestion(question[0], question[1]);
      }
      if (question[0].endsWith(':')) {
        return getChoicesQuestion(question[0], question[1]);
      }
    }

    throw new Error(`This question has not be supported yet for ${JSON.stringify(question)}`);
  });
  return prompt(questionObjects).then((answers: any) => {
    const result: any[] = [];
    questionObjects.forEach((question: Question | undefined) => {
      if (question) {
        result.push(toObjectIIfJsonString(answers[question.name || '']));
      } else {
        result.push('Error');
      }
    });
    return result;
  });
}

export function ask(askQuestions: any[]): Promise<any[]> {
  return questions(askQuestions);
}

export function suggest(question: string, options: any[], fnOptionValue?: (optionItem: any) => any): Promise<any> {
  const questionObject = getAutoCompleteQuestion(question, options, fnOptionValue);
  return askQuestion(questionObject).then((answer: string) => {
    return toObjectIIfJsonString(answer);
  });
}
