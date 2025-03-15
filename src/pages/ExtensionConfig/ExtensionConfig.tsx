"use client";
import { FC, useEffect, useState, FormEvent, useRef } from 'react';
import styles from './ExtensionConfig.module.css';
import { useTranslation } from 'react-i18next';

const ExtensionConfig: FC = () => {
  const { t } = useTranslation();
  // Stored config value from backend is in milliseconds
  const [extensionDurationMs, setExtensionDurationMs] = useState<number | null>(null);
  // We'll display and input duration in hours (as a string)
  const [newDurationHours, setNewDurationHours] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

  // Conversion factor: 1 hour = 3600000 ms
  const msPerHour = 3600000;

  // We can track if we've already fetched once
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    // Only fetch if we haven't fetched before
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true; // Mark as fetched so we don't fetch again

    const fetchConfig = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/config/extension-duration`);
        if (!res.ok) {
          throw new Error(t("failedToFetchConfig", "Failed to fetch extension duration"));
        }
        const data = await res.json();
        // Assume backend returns something like { extensionDuration: number } in ms
        const durationMs = data.extensionDuration;
        setExtensionDurationMs(durationMs);
        // Convert ms to hours for display
        setNewDurationHours(String(durationMs / msPerHour));
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, [t]);

  // Handler for form submission to update extension duration
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const hours = Number(newDurationHours);
      if (isNaN(hours) || hours <= 0) {
        throw new Error(t("invalidDuration", "Please enter a valid positive number for duration."));
      }
      // Convert hours to milliseconds
      const durationMs = hours * msPerHour;

      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/config/extension-duration`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ extensionDuration: durationMs })
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`${t("failedToUpdate", "Failed to update")}: ${errorText}`);
      }

      const result = await res.json();
      // Update state with the new value from backend (in ms)
      const updatedMs = result.config.value;
      setExtensionDurationMs(updatedMs);
      // Convert ms back to hours
      setNewDurationHours(String(updatedMs / msPerHour));
      setMessage(t("updateSuccess", "Extension duration updated successfully!"));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t("extensionConfig", "Extension Configuration")}</h1>

      {loading && <p>{t("loading", "Loading...")}</p>}
      {error && <p className={styles.error}>{error}</p>}
      {message && <p className={styles.success}>{message}</p>}

      {extensionDurationMs !== null && (
        <div className={styles.currentConfig}>
          <p>
            {t("currentDuration", "Current Extension Duration (hours):")}{" "}
            {extensionDurationMs / msPerHour}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <label htmlFor="duration">{t("newDuration", "New Duration (hours):")}</label>
        <input
          id="duration"
          type="number"
          value={newDurationHours}
          onChange={(e) => setNewDurationHours(e.target.value)}
          required
          className={styles.input}
        />
        <button type="submit" className={styles.submitButton} disabled={loading}>
          {t("update", "Update")}
        </button>
      </form>
    </div>
  );
};

export default ExtensionConfig;
