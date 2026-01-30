'use server';

import { connectToDatabase } from '@/db';
import { ObjectId } from 'mongodb';
import { B5Error, DbResult, Feedback } from '@/types';
import { processAnswers } from '@bigfive-org/score';
import {
  generateResult,
  getInfo,
  getTemplate
} from '@bigfive-org/results';
import type { Scores } from '@bigfive-org/results/build/types';
import fs from 'fs/promises';
import path from 'path';

const collectionName = process.env.DB_COLLECTION || 'results';
const resultLanguages = getInfo().languages;

export type Report = {
  id: string;
  timestamp: number;
  availableLanguages: ReturnType<typeof getInfo>['languages'];
  language: string;
  results: Awaited<ReturnType<typeof generateResult>>;
};

export async function getTestResult(
  id: string,
  language?: string
): Promise<Report | undefined> {
  'use server';
  try {
    const query = { _id: new ObjectId(id) };
    const db = await connectToDatabase();
    const collection = db.collection(collectionName);
    const report = await collection.findOne(query);
    if (!report) {
      console.error(`The test results with id ${id} are not found!`);
      throw new B5Error({
        name: 'NotFoundError',
        message: `The test results with id ${id} is not found in the database!`
      });
    }
    const selectedLanguage =
      language ||
      (!!resultLanguages.find((l) => l.code === report.lang)
        ? report.lang
        : 'en');
    const scores = processAnswers(report.answers) as Scores;
    const template = await getTemplate(selectedLanguage);
    const results = generateResult(scores, template);
    return {
      id: report._id.toString(),
      timestamp: report.dateStamp,
      availableLanguages: resultLanguages,
      language: selectedLanguage,
      results
    };
  } catch (error) {
    if (error instanceof B5Error) {
      throw error;
    }
    throw new Error('Something wrong happend. Failed to get test result!');
  }
}

export async function saveTest(testResult: DbResult) {
  'use server';
  try {
    const db = await connectToDatabase();
    const collection = db.collection(collectionName);
    const result = await collection.insertOne(testResult);

    // Also persist computed scores to a local JSON file for inspection.
    const selectedLanguage =
      !!resultLanguages.find((l) => l.code === testResult.lang)
        ? testResult.lang
        : 'en';
    const scores = processAnswers(testResult.answers) as Scores;
    const template = await getTemplate(selectedLanguage);
    const computedResults = generateResult(scores, template);
    const resultsDir = path.join(process.cwd(), '..', 'results');
    const filePath = path.join(resultsDir, `${result.insertedId.toString()}.json`);
    const payload = {
      results: computedResults,
      scores,
      id: result.insertedId.toString(),
      testId: testResult.testId,
      lang: testResult.lang,
      dateStamp: new Date(testResult.dateStamp).toISOString(),
      timeElapsed: testResult.timeElapsed
    };

    try {
      await fs.mkdir(resultsDir, { recursive: true });
      await fs.writeFile(filePath, JSON.stringify(payload, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write score file', err);
    }

    return { id: result.insertedId.toString() };
  } catch (error) {
    console.error(error);
    throw new B5Error({
      name: 'SavingError',
      message: 'Failed to save test result!'
    });
  }
}

export type FeebackState = {
  message: string;
  type: 'error' | 'success';
};

export async function saveFeedback(
  prevState: FeebackState,
  formData: FormData
): Promise<FeebackState> {
  'use server';
  const feedback: Feedback = {
    name: String(formData.get('name')),
    email: String(formData.get('email')),
    message: String(formData.get('message'))
  };
  try {
    const db = await connectToDatabase();
    const collection = db.collection('feedback');
    await collection.insertOne({ feedback });
    return {
      message: 'Sent successfully!',
      type: 'success'
    };
  } catch (error) {
    return {
      message: 'Error sending feedback!',
      type: 'error'
    };
  }
}
