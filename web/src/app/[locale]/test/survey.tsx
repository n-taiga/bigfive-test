'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@nextui-org/button';
import { RadioGroup, Radio } from '@nextui-org/radio';
import { Progress } from '@nextui-org/progress';
import confetti from 'canvas-confetti';
import { useRouter } from '@/navigation';
import { Input } from '@nextui-org/input';

import { CloseIcon, InfoIcon } from '@/components/icons';
import { type Question } from '@bigfive-org/questions';
import { sleep, formatTimer, isDev } from '@/lib/helpers';
import useWindowDimensions from '@/hooks/useWindowDimensions';
import useTimer from '@/hooks/useTimer';
import { type Answer } from '@/types';
import { Card, CardHeader } from '@nextui-org/card';

interface SurveyProps {
  questions: Question[];
  nextText: string;
  prevText: string;
  resultsText: string;
  saveTest: Function;
  language: string;
}

export const Survey = ({
  questions,
  nextText,
  prevText,
  resultsText,
  saveTest,
  language
}: SurveyProps) => {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questionsPerPage, setQuestionsPerPage] = useState(1);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(false);
  const [restored, setRestored] = useState(false);
  const [inProgress, setInProgress] = useState(false);
  const [midGateUnlocked, setMidGateUnlocked] = useState(false);
  const [midGateInput, setMidGateInput] = useState('');
  const { width } = useWindowDimensions();
  const seconds = useTimer();

  const generateChallenge = (length = 3) => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ'; // letters only
    let out = '';
    for (let i = 0; i < length; i += 1) {
      out += chars[Math.floor(Math.random() * chars.length)];
    }
    return out;
  };
  const midGateChallenge = useMemo(() => generateChallenge(3), []);

  useEffect(() => {
    const handleResize = () => {
      const wideEnoughForSix = window.innerWidth >= 1024;
      const wideEnoughForThree = window.innerWidth > 768;
      setQuestionsPerPage(wideEnoughForSix ? 6 : wideEnoughForThree ? 3 : 1);
    };
    handleResize();
  }, [width]);

  useEffect(() => {
    const restoreData = () => {
      if (dataInLocalStorage()) {
        console.log('Restoring data from local storage');
        restoreDataFromLocalStorage();
      }
    };
    restoreData();
  }, []);

  const currentQuestions = useMemo(
    () =>
      questions.slice(
        currentQuestionIndex,
        currentQuestionIndex + questionsPerPage
      ),
    [currentQuestionIndex, questions, questionsPerPage]
  );

  const isWideLayout = questionsPerPage === 6;

  const currentQuestionColumns = useMemo(() => {
    if (!isWideLayout) return [currentQuestions];
    const splitIndex = Math.ceil(currentQuestions.length / 2);
    return [
      currentQuestions.slice(0, splitIndex),
      currentQuestions.slice(splitIndex)
    ];
  }, [currentQuestions, isWideLayout]);

  const isTestDone = questions.length === answers.length;

  const progress = Math.round((answers.length / questions.length) * 100);

  const showMidGate = progress > 50 && !midGateUnlocked;
  const midGateMatches = midGateInput.trim().toUpperCase() === midGateChallenge;

  const nextButtonDisabled =
    inProgress ||
    showMidGate ||
    currentQuestionIndex + questionsPerPage > answers.length ||
    (isTestDone &&
      currentQuestionIndex === questions.length - questionsPerPage) ||
    loading;

  const backButtonDisabled = currentQuestionIndex === 0 || loading || showMidGate;

  async function handleAnswer(id: string, value: string) {
    const question = questions.find((question) => question.id === id);
    if (!question) return;

    const newAnswer: Answer = {
      id,
      score: Number(value),
      domain: question.domain,
      facet: question.facet
    };

    setAnswers((prevAnswers) => [
      ...prevAnswers.filter((a) => a.id !== id),
      newAnswer
    ]);

    const latestAnswerId = answers.slice(-1)[0]?.id;

    if (
      questionsPerPage === 1 &&
      questions.length !== answers.length + 1 &&
      id !== latestAnswerId
    ) {
      setInProgress(true);
      await sleep(700);
      setCurrentQuestionIndex((prev) => prev + 1);
      window.scrollTo(0, 0);
      setInProgress(false);
    }
    populateDataInLocalStorage();
  }

  function handlePreviousQuestions() {
    setCurrentQuestionIndex((prev) => prev - questionsPerPage);
    window.scrollTo(0, 0);
  }

  function handleNextQuestions() {
    if (inProgress) return;
    setCurrentQuestionIndex((prev) => prev + questionsPerPage);
    window.scrollTo(0, 0);
    if (restored) setRestored(false);
  }

  function skipToEnd() {
    const randomAnswers = questions
      .map((question) => ({
        id: question.id,
        score: Math.floor(Math.random() * 5) + 1,
        domain: question.domain,
        facet: question.facet
      }))
      .slice(0, questions.length - 1);

    setAnswers([...randomAnswers]);
    setCurrentQuestionIndex(questions.length - 1);
  }

  async function submitTest() {
    setLoading(true);
    confetti({});
    const result = await saveTest({
      testId: 'b5-120',
      lang: language,
      invalid: false,
      timeElapsed: seconds,
      dateStamp: new Date(),
      answers
    });
    localStorage.removeItem('inProgress');
    localStorage.removeItem('b5data');
    console.log(result);
    localStorage.setItem('resultId', result.id);
    router.push(`/result/${result.id}`);
  }

  function dataInLocalStorage() {
    return !!localStorage.getItem('inProgress');
  }

  function populateDataInLocalStorage() {
    localStorage.setItem('inProgress', 'true');
    localStorage.setItem(
      'b5data',
      JSON.stringify({ answers, currentQuestionIndex })
    );
  }

  function restoreDataFromLocalStorage() {
    const data = localStorage.getItem('b5data');
    if (data) {
      const { answers, currentQuestionIndex } = JSON.parse(data);
      setAnswers(answers);
      setCurrentQuestionIndex(currentQuestionIndex);
      setRestored(true);
    }
  }

  function clearDataInLocalStorage() {
    console.log('Clearing data from local storage');
    localStorage.removeItem('inProgress');
    localStorage.removeItem('b5data');
    location.reload();
  }

  return (
    <div className='mt-2'>
      <Progress
        aria-label='Progress bar'
        value={progress}
        className='max-w'
        showValueLabel={true}
        label={formatTimer(seconds)}
        minValue={0}
        maxValue={100}
        size='lg'
        color='secondary'
      />
      {restored && (
        <Card className='mt-4 bg-warning/20 text-warning-600 dark:text-warning'>
          <CardHeader className='justify-between'>
            <Button isIconOnly variant='light' color='warning'>
              <InfoIcon />
            </Button>
            <p>
              Your answers has been restored. Click here to&nbsp;
              <a
                className='underline cursor-pointer'
                onClick={clearDataInLocalStorage}
                aria-label='Clear data'
              >
                start a new test
              </a>
              .
            </p>
            <Button
              isIconOnly
              variant='light'
              color='warning'
              onClick={() => setRestored(false)}
            >
              <CloseIcon />
            </Button>
          </CardHeader>
        </Card>
      )}
      <div
        className={
          isWideLayout
            ? 'grid grid-cols-1 gap-10 lg:grid-cols-2'
            : 'space-y-8'
        }
      >
        {currentQuestionColumns.map((column, columnIndex) => (
          <div key={`col-${columnIndex}`} className='space-y-8'>
            {column.map((question) => (
              <div key={'q' + question.num}>
                <h2 className='text-2xl my-4'>{question.text}</h2>
                <div>
                  <RadioGroup
                    onValueChange={(value) => handleAnswer(question.id, value)}
                    value={answers
                      .find((answer) => answer.id === question.id)
                      ?.score.toString()}
                    color='secondary'
                    isDisabled={inProgress || showMidGate}
                  >
                    {question.choices.map((choice, index) => (
                      <Radio
                        key={index + question.id}
                        value={choice.score.toString()}
                      >
                        {choice.text}
                      </Radio>
                    ))}
                  </RadioGroup>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      {showMidGate && (
        <div className='fixed inset-0 z-40 flex items-center justify-center px-4'>
          <div className='absolute inset-0 bg-black/50 backdrop-blur-sm' aria-hidden='true' />
          <div className='relative z-50 max-w-xl w-full p-6 rounded-2xl bg-white shadow-2xl border border-default-200 space-y-4'>
            <p className='font-semibold text-lg'>続行するには表示された文字列を入力してください</p>
            <div className='flex items-center gap-3 flex-wrap'>
              <span className='font-mono text-xl px-3 py-2 bg-default-100 rounded-md border border-default-200'>
                {midGateChallenge}
              </span>
              <span className='text-sm text-default-500'>Enterキーでも確定できます</span>
            </div>
            <Input
              label='テキストを入力'
              placeholder={midGateChallenge}
              value={midGateInput}
              onValueChange={setMidGateInput}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  if (midGateMatches) setMidGateUnlocked(true);
                }
              }}
            />
            <div className='text-sm text-default-500'>入力後に Enter か下のボタンで続行できます。</div>
            <div className='flex gap-3 justify-end'>
              <Button
                color='primary'
                onPress={() => {
                  if (midGateMatches) setMidGateUnlocked(true);
                }}
                isDisabled={!midGateMatches}
              >
                テストを続行する
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className='my-12 space-x-4 inline-flex'>
        <Button
          color='primary'
          isDisabled={backButtonDisabled}
          onClick={handlePreviousQuestions}
        >
          {prevText.toUpperCase()}
        </Button>

        <Button
          color='primary'
          isDisabled={nextButtonDisabled}
          onClick={handleNextQuestions}
        >
          {nextText.toUpperCase()}
        </Button>

        {isTestDone && (
          <Button
            color='secondary'
            onClick={submitTest}
            disabled={loading}
            isLoading={loading}
          >
            {resultsText.toUpperCase()}
          </Button>
        )}

        {isDev && !isTestDone && (
          <Button color='primary' onClick={skipToEnd}>
            Skip to end (dev)
          </Button>
        )}
      </div>
    </div>
  );
};
