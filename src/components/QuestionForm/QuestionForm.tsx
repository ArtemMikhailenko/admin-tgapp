// src/pages/QuestionForm.tsx
import { useState, useEffect } from 'react'
import styles from './QuestionForm.module.css'

export interface MultiLangQuestionData {
  question: {
    en: string;
    ar: string;
  };
  correctAnswer: {
    en: string;
    ar: string;
  };
  wrongAnswers: Array<{
    en: string;
    ar: string;
  }>;
}

interface QuestionFormProps {
  initialData?: MultiLangQuestionData;
  onSubmit: (data: MultiLangQuestionData) => void;
  submitButtonLabel?: string;
}

function QuestionForm({ initialData, onSubmit, submitButtonLabel = 'Save' }: QuestionFormProps) {
  const [questionEn, setQuestionEn] = useState('');
  const [questionAr, setQuestionAr] = useState('');
  const [correctAnswerEn, setCorrectAnswerEn] = useState('');
  const [correctAnswerAr, setCorrectAnswerAr] = useState('');
  const [wrongAnswersEn, setWrongAnswersEn] = useState<string[]>(['', '', '']);
  const [wrongAnswersAr, setWrongAnswersAr] = useState<string[]>(['', '', '']);

  useEffect(() => {
    if (initialData) {
      setQuestionEn(initialData.question.en);
      setQuestionAr(initialData.question.ar);
      setCorrectAnswerEn(initialData.correctAnswer.en);
      setCorrectAnswerAr(initialData.correctAnswer.ar);
      setWrongAnswersEn(initialData.wrongAnswers.map(ans => ans.en));
      setWrongAnswersAr(initialData.wrongAnswers.map(ans => ans.ar));
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data: MultiLangQuestionData = {
      question: { en: questionEn, ar: questionAr },
      correctAnswer: { en: correctAnswerEn, ar: correctAnswerAr },
      wrongAnswers: wrongAnswersEn.map((enAns, idx) => ({
        en: enAns,
        ar: wrongAnswersAr[idx] || '',
      })),
    };
    onSubmit(data);
  };

  const handleWrongAnswerEnChange = (index: number, value: string) => {
    const newAnswers = [...wrongAnswersEn];
    newAnswers[index] = value;
    setWrongAnswersEn(newAnswers);
  };

  const handleWrongAnswerArChange = (index: number, value: string) => {
    const newAnswers = [...wrongAnswersAr];
    newAnswers[index] = value;
    setWrongAnswersAr(newAnswers);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2>English</h2>
      <div className={styles.formGroup}>
        <label>Question:</label>
        <input
          type="text"
          value={questionEn}
          onChange={(e) => setQuestionEn(e.target.value)}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label>Correct Answer:</label>
        <input
          type="text"
          value={correctAnswerEn}
          onChange={(e) => setCorrectAnswerEn(e.target.value)}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label>Wrong Answers:</label>
        {wrongAnswersEn.map((answer, idx) => (
          <input
            key={`en-${idx}`}
            type="text"
            value={answer}
            onChange={(e) => handleWrongAnswerEnChange(idx, e.target.value)}
            required
          />
        ))}
      </div>

      <h2>العربية</h2>
      <div className={styles.formGroup}>
        <label>السؤال:</label>
        <input
          type="text"
          value={questionAr}
          onChange={(e) => setQuestionAr(e.target.value)}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label>الإجابة الصحيحة:</label>
        <input
          type="text"
          value={correctAnswerAr}
          onChange={(e) => setCorrectAnswerAr(e.target.value)}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label>الإجابات الخاطئة:</label>
        {wrongAnswersAr.map((answer, idx) => (
          <input
            key={`ar-${idx}`}
            type="text"
            value={answer}
            onChange={(e) => handleWrongAnswerArChange(idx, e.target.value)}
            required
          />
        ))}
      </div>

      <button type="submit" className={styles.submitButton}>
        {submitButtonLabel}
      </button>
    </form>
  );
}

export default QuestionForm;
