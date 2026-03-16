/* eslint-disable @typescript-eslint/no-explicit-any */
import { Separator, confirm as confirmPrompt, input as inputPrompt, rawlist, search } from '@inquirer/prompts';

import { toObjectIIfJsonString } from './utils';

enum AnswerType {
  String = 'input',
  Boolean = 'confirm',
  RawList = 'rawlist',
  Suggest = 'search',
}

export type SupportedQuestion = string | [string, any[]];

type QuestionConfig = {
  message: string;
  name: string;
  options?: any[];
  type: AnswerType;
};

type SuggestionChoice = {
  name: string;
  short: string;
  value: string;
};

function getQuestionObject(question: string, answerType?: AnswerType, additional?: Partial<QuestionConfig>): QuestionConfig {
  const answerKey = question.replace(/[^\w]+/g, '-');
  return {
    name: answerKey,
    type: answerType || AnswerType.String,
    message: question,
    ...additional,
  };
}

async function askQuestion(question: QuestionConfig): Promise<any> {
  switch (question.type) {
    case AnswerType.Boolean:
      return confirmPrompt({ message: question.message });
    case AnswerType.RawList:
      return rawlist({
        message: question.message,
        choices: (question.options || []).map((option) => {
          if (option === '') {
            return new Separator();
          }
          return option;
        }),
      });
    case AnswerType.Suggest:
      return search({
        message: question.message,
        source: async (input) => {
          const searchTerm = (input || '').toLowerCase();
          return (question.options || []).filter((item) => {
            if (!searchTerm) {
              return true;
            }
            return item.name.toLowerCase().includes(searchTerm);
          });
        },
      });
    case AnswerType.String:
    default:
      return inputPrompt({ message: question.message });
  }
}

function getInputQuestionObject(question: string): QuestionConfig {
  return getQuestionObject(question);
}

function getConfirmationQuestionObject(question: string): QuestionConfig {
  return getQuestionObject(question, AnswerType.Boolean);
}

function getChoicesQuestion(question: string, options: string[]): QuestionConfig {
  return getQuestionObject(question, AnswerType.RawList, { options });
}

function serializeSuggestionOption(optionItem: any, fnGetValue?: (optionItem: any) => any): SuggestionChoice {
  const displayValue = fnGetValue ? String(fnGetValue(optionItem)) : typeof optionItem === 'string' ? optionItem : JSON.stringify(optionItem);

  return {
    name: displayValue,
    short: displayValue,
    value: displayValue,
  };
}

function getAutoCompleteQuestion(question: string, options: any[], fnGetValue?: (optionItem: any) => any): QuestionConfig {
  return getQuestionObject(question.replace('::', ':'), AnswerType.Suggest, {
    options: options.map((optionItem) => serializeSuggestionOption(optionItem, fnGetValue)),
  });
}

export function input(question: string): Promise<string | boolean> {
  const questionObject = getInputQuestionObject(question);
  return askQuestion(questionObject);
}

export function confirm(question: string): Promise<boolean> {
  const questionObject = getConfirmationQuestionObject(question);
  return askQuestion(questionObject);
}

export function select(question: string, options: string[]): Promise<string> {
  const questionObject = getChoicesQuestion(question, options);
  return askQuestion(questionObject);
}

export async function questions(questionsList: SupportedQuestion[]): Promise<any[]> {
  const questionObjects = questionsList.map((question) => {
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

  const result: any[] = [];
  for (const questionObject of questionObjects) {
    result.push(toObjectIIfJsonString(await askQuestion(questionObject)));
  }
  return result;
}

export function ask(askQuestions: SupportedQuestion[]): Promise<any[]> {
  return questions(askQuestions);
}

export async function suggest(question: string, options: any[], fnOptionValue?: (optionItem: any) => any): Promise<any> {
  const questionObject = getAutoCompleteQuestion(question, options, fnOptionValue);
  return toObjectIIfJsonString(await askQuestion(questionObject));
}
