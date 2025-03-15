// src/pages/RewardSettingsPage.tsx
import React, { FC, useEffect, useState, FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './RewardSettingsPage.module.css';

interface RewardSettings {
  primaryReferralPoints: number;
  secondaryReferralPoints: number;
  correctAnswerTokens: number;
  incorrectAnswerTokens: number;
  correctAnswerPoints: number;
  incorrectAnswerPoints: number;
  weeklyRewardTokens: number;
}

const RewardSettingsPage: FC = () => {
  const { t } = useTranslation();
  const [settings, setSettings] = useState<RewardSettings | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [formData, setFormData] = useState<RewardSettings>({
    primaryReferralPoints: 100,
    secondaryReferralPoints: 50,
    correctAnswerTokens: 5,
    incorrectAnswerTokens: 1,
    correctAnswerPoints: 10,
    incorrectAnswerPoints: 2,
    weeklyRewardTokens: 10,
  });

  // Fetch current reward settings from the backend on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/reward-settings`);
        if (!res.ok) {
          throw new Error(t("failedToFetchSettings", "Failed to fetch reward settings"));
        }
        const data = await res.json();
        setSettings(data);
        setFormData({
          primaryReferralPoints: data.primaryReferralPoints,
          secondaryReferralPoints: data.secondaryReferralPoints,
          correctAnswerTokens: data.correctAnswerTokens,
          incorrectAnswerTokens: data.incorrectAnswerTokens,
          correctAnswerPoints: data.correctAnswerPoints,
          incorrectAnswerPoints: data.incorrectAnswerPoints,
          weeklyRewardTokens: data.weeklyRewardTokens,
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []); // empty dependency array so it runs only once on mount

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  // Handle form submission to update settings
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/reward-settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`${t("failedToUpdate", "Failed to update settings")}: ${errorText}`);
      }
      const result = await res.json();
      setSettings(result.settings);
      setMessage(t("updateSuccess", "Reward settings updated successfully!"));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t("rewardSettings", "Reward Settings")}</h1>

      {loading && <p>{t("loading", "Loading...")}</p>}
      {error && <p className={styles.error}>{error}</p>}
      {message && <p className={styles.success}>{message}</p>}

      {settings && (
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="primaryReferralPoints">
              {t("primaryReferralPoints", "Primary Referral Points")}:
            </label>
            <input
              id="primaryReferralPoints"
              type="number"
              name="primaryReferralPoints"
              value={formData.primaryReferralPoints}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="secondaryReferralPoints">
              {t("secondaryReferralPoints", "Secondary Referral Points")}:
            </label>
            <input
              id="secondaryReferralPoints"
              type="number"
              name="secondaryReferralPoints"
              value={formData.secondaryReferralPoints}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="correctAnswerTokens">
              {t("correctAnswerTokens", "Correct Answer Tokens")}:
            </label>
            <input
              id="correctAnswerTokens"
              type="number"
              name="correctAnswerTokens"
              value={formData.correctAnswerTokens}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="incorrectAnswerTokens">
              {t("incorrectAnswerTokens", "Incorrect Answer Tokens")}:
            </label>
            <input
              id="incorrectAnswerTokens"
              type="number"
              name="incorrectAnswerTokens"
              value={formData.incorrectAnswerTokens}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="correctAnswerPoints">
              {t("correctAnswerPoints", "Correct Answer Points")}:
            </label>
            <input
              id="correctAnswerPoints"
              type="number"
              name="correctAnswerPoints"
              value={formData.correctAnswerPoints}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="incorrectAnswerPoints">
              {t("incorrectAnswerPoints", "Incorrect Answer Points")}:
            </label>
            <input
              id="incorrectAnswerPoints"
              type="number"
              name="incorrectAnswerPoints"
              value={formData.incorrectAnswerPoints}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="weeklyRewardTokens">
              {t("weeklyRewardTokens", "Weekly Reward Tokens")}:
            </label>
            <input
              id="weeklyRewardTokens"
              type="number"
              name="weeklyRewardTokens"
              value={formData.weeklyRewardTokens}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className={styles.submitButton} disabled={loading}>
            {t("update", "Update")}
          </button>
        </form>
      )}
    </div>
  );
};

export default RewardSettingsPage;
