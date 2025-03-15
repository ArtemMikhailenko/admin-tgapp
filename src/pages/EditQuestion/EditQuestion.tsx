"use client";
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import QuestionForm from '../../components/QuestionForm/QuestionForm';
import styles from './EditQuestion.module.css';

interface MultiLangQuestionData {
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

function EditQuestion() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [initialData, setInitialData] = useState<MultiLangQuestionData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchQuestionById(id);
    }
  }, [id]);

  const fetchQuestionById = async (questionId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/quiz/questions/${questionId}`);
      if (!response.ok) {
        throw new Error(t("failedToFetchQuestion", "Failed to fetch question"));
      }
      const data = await response.json();
      // Assuming your API returns a question in the following multi-language structure:
      // { question: { en: string, ar: string }, correctAnswer: { en: string, ar: string }, wrongAnswers: [{ en: string, ar: string }, ...] }
      setInitialData({
        question: data.question,
        correctAnswer: data.correctAnswer,
        wrongAnswers: data.wrongAnswers,
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData: MultiLangQuestionData) => {
    try {
      setLoading(true);
      setError(null);

      if (id) {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/quiz/questions/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (!response.ok) {
          throw new Error(t("failedToUpdateQuestion", "Failed to update question"));
        }
      } else {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/quiz/questions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (!response.ok) {
          throw new Error(t("failedToCreateQuestion", "Failed to create question"));
        }
      }

      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !initialData && id) {
    return <div className={styles.loader}>{t("loading", "Loading...")}</div>;
  }

  return (
    <div className={styles.fullPageContainer}>
      <div className={styles.container}>
        <h1 className={styles.title}>
          {id ? t("editQuestion", "Edit Question") : t("newQuestion", "New Question")}
        </h1>
        {error && <div className={styles.error}>{error}</div>}

        <QuestionForm
          initialData={initialData || undefined}
          onSubmit={handleSubmit}
          submitButtonLabel={id ? t("update", "Update") : t("create", "Create")}
        />
      </div>
    </div>
  );
}

export default EditQuestion;
