'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import styles from './forgot.module.css';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) { setError('Email is required'); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError('Enter a valid email'); return; }
    setError('');
    setLoading(true);
    setTimeout(() => { setLoading(false); setSent(true); }, 1800);
  };

  return (
    <div className={styles.page}>
      <Link href="/" className={styles.logo}>
        <span className={styles.logoMark}>m</span>
        <span className={styles.logoText}>AInu</span>
      </Link>

      <div className={styles.card}>
        {!sent ? (
          <>
            <div className={styles.icon}>
              <Mail size={28} color="var(--accent)" />
            </div>
            <h1 className={styles.title}>Reset your password</h1>
            <p className={styles.subtitle}>Enter your email and we&apos;ll send a reset link to your inbox.</p>
            <form className={styles.form} onSubmit={handleSubmit} noValidate>
              <div className={styles.inputWrap + (error ? ' ' + styles.inputError : '')}>
                <Mail size={16} className={styles.inputIcon} />
                <input
                  type="email"
                  className={styles.input}
                  placeholder="you@restaurant.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  autoComplete="email"
                  id="forgot-email"
                />
              </div>
              {error && <span className={styles.errorMsg}>{error}</span>}
              <button type="submit" className={`${styles.submitBtn} ${loading ? styles.submitLoading : ''}`} disabled={loading}>
                {loading ? <span className={styles.spinner} /> : <><span>Send reset link</span><ArrowRight size={16} /></>}
              </button>
            </form>
          </>
        ) : (
          <div className={styles.successState}>
            <div className={styles.successIcon}>
              <CheckCircle size={36} color="#10b981" />
            </div>
            <h2 className={styles.successTitle}>Check your inbox</h2>
            <p className={styles.successText}>
              We sent a password reset link to <strong>{email}</strong>. Check your inbox and follow the instructions.
            </p>
            <button className={styles.resendBtn} onClick={() => { setSent(false); setEmail(''); }}>
              Try a different email
            </button>
          </div>
        )}
        <Link href="/login" className={styles.backLink}>
          <ArrowLeft size={14} /> Back to sign in
        </Link>
      </div>
    </div>
  );
}
