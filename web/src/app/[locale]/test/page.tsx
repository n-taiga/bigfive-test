import { getItems, getInfo } from '@bigfive-org/questions';
import type { LanguageCode } from '@bigfive-org/questions/build/data/languages';
import { Survey } from './survey';
import { saveTest } from '@/actions';
import { unstable_setRequestLocale, getTranslations } from 'next-intl/server';
import { TestLanguageSwitch } from './test-language-switch';

const questionLanguages = getInfo().languages;

interface Props {
  params: { locale: string };
  searchParams: { lang?: string };
}

export default async function TestPage({
  params: { locale },
  searchParams: { lang }
}: Props) {
  unstable_setRequestLocale(locale);
  const fallbackLanguage: LanguageCode =
    questionLanguages.some((l) => l.code === locale) ? (locale as LanguageCode) : 'en';
  const language: LanguageCode =
    lang && questionLanguages.some((l) => l.code === lang)
      ? (lang as LanguageCode)
      : fallbackLanguage;
  const questions = await getItems(language);
  const shuffledQuestions = shuffle(questions);
  const t = await getTranslations({ locale, namespace: 'test' });
  return (
    <>
      <div className='flex'>
        <TestLanguageSwitch
          availableLanguages={questionLanguages}
          language={language}
        />
      </div>
      <Survey
        questions={shuffledQuestions}
        nextText={t('next')}
        prevText={t('back')}
        resultsText={t('seeResults')}
        saveTest={saveTest}
        language={language}
      />
    </>
  );
}

function shuffle<T>(items: T[]) {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
