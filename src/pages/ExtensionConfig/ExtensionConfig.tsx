"use client";
import { FC, useEffect, useState, FormEvent, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ExtensionConfig.module.css';

interface ConfigSettings {
  extensionDuration: number;  // stored in ms
  freeTrialDuration: number;  // stored in ms
  paymentReceiver: string;            // payment wallet address
  paymentAmount: number;      // stored in minimal units (e.g. nanotons)
}

const ExtensionConfig: FC = () => {
  const { t } = useTranslation();
  //@ts-ignore
  const [settings, setSettings] = useState<ConfigSettings | null>(null);
  // We'll display extension duration in hours, free trial in minutes,
  // and payment amount in TON (assuming 1 TON = 1e9 nanotons).
  const [extensionHours, setExtensionHours] = useState<string>('');
  const [freeTrialMinutes, setFreeTrialMinutes] = useState<string>('');
  const [configAddress, setConfigAddress] = useState<string>('');
  const [paymentAmountTon, setPaymentAmountTon] = useState<string>('');
  
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const hasFetchedRef = useRef(false);

  // Conversion factors
  const msPerHour = 3600000;
  const msPerMinute = 60000;
  const nanoPerTon = 1e9;

  // Fetch current configuration on mount (only once)
  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;
    
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/config/settings`);
        if (!res.ok) {
          throw new Error(t("failedToFetchSettings", "Failed to fetch configuration settings"));
        }
        const data: ConfigSettings = await res.json();
        setSettings(data);
        // Convert milliseconds to hours and minutes for display
        setExtensionHours(String(data.extensionDuration / msPerHour));
        setFreeTrialMinutes(String(data.freeTrialDuration / msPerMinute));
        setConfigAddress(data.paymentReceiver);
        // Конвертируем paymentAmount из нанотонов в TON для отображения
        setPaymentAmountTon(String(data.paymentAmount / nanoPerTon));
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Handler for form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const extHours = Number(extensionHours);
      const trialMinutes = Number(freeTrialMinutes);
      const paymentTon = Number(paymentAmountTon);
      if (
        isNaN(extHours) || extHours <= 0 ||
        isNaN(trialMinutes) || trialMinutes <= 0 ||
        !configAddress ||
        isNaN(paymentTon) || paymentTon <= 0
      ) {
        throw new Error(t("invalidInput", "Please enter valid positive numbers for all fields."));
      }
      // Convert to milliseconds and minimal units respectively
      const updatedExtension = extHours * msPerHour;
      const updatedTrial = trialMinutes * msPerMinute;
      const updatedPaymentAmount = paymentTon * nanoPerTon;
      
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/config/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          extensionDuration: updatedExtension,
          freeTrialDuration: updatedTrial,
          paymentReceiver: configAddress,
          paymentAmount: updatedPaymentAmount
        })
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`${t("failedToUpdate", "Failed to update settings")}: ${errorText}`);
      }
      const result: ConfigSettings = await res.json();
      setSettings(result);
      // Update display values
      setExtensionHours(String(result.extensionDuration / msPerHour));
      setFreeTrialMinutes(String(result.freeTrialDuration / msPerMinute));
      setConfigAddress(result.paymentReceiver);
      setPaymentAmountTon(String(result.paymentAmount / nanoPerTon));
      setMessage(t("updateSuccess", "Configuration updated successfully!"));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t("configSettings", "Configuration Settings")}</h1>

      {loading && <p>{t("loading", "Loading...")}</p>}
      {error && <p className={styles.error}>{error}</p>}
      {message && <p className={styles.success}>{message}</p>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="extension">{t("newExtension", "New Extension Duration (hours):")}</label>
          <input
            id="extension"
            type="number"
            value={extensionHours}
            onChange={(e) => setExtensionHours(e.target.value)}
            required
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="trial">{t("newTrial", "New Free Trial Duration (minutes):")}</label>
          <input
            id="trial"
            type="number"
            value={freeTrialMinutes}
            onChange={(e) => setFreeTrialMinutes(e.target.value)}
            required
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="address">{t("newAddress", "New Payment Address:")}</label>
          <input
            id="address"
            type="text"
            value={configAddress}
            onChange={(e) => setConfigAddress(e.target.value)}
            required
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="payment">{t("newPayment", "New Payment Amount (TON):")}</label>
          <input
            id="payment"
            type="number"
            value={paymentAmountTon}
            onChange={(e) => setPaymentAmountTon(e.target.value)}
            required
            className={styles.input}
          />
        </div>
        <button type="submit" className={styles.submitButton} disabled={loading}>
          {t("update", "Update")}
        </button>
      </form>
    </div>
  );
};

export default ExtensionConfig;
