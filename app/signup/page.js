'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Check } from 'lucide-react';
import styles from './signup.module.css';

function getPasswordStrength(pw) {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
}

const STRENGTH_LABELS = ['', 'Weak', 'Fair', 'Good', 'Strong'];
const STRENGTH_COLORS = ['', '#dc2626', '#f59e0b', '#10b981', '#10b981'];

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const strength = getPasswordStrength(password);

  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = 'Full name is required';
    if (!email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Enter a valid email';
    if (!password) errs.password = 'Password is required';
    else if (password.length < 8) errs.password = 'At least 8 characters required';
    if (!agreed) errs.agreed = 'Please accept the terms to continue';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push('/dashboard');
    }, 600);
  };

  const handleSocial = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push('/dashboard');
    }, 600);
  };

  return (
    <div className={styles.page}>
      <aside className={styles.panel}>
        <div className={styles.panelInner}>
          <Link href="/" className={styles.logo}>
            <span className={styles.logoMark}>m</span>
            <span className={styles.logoText}>AInu</span>
          </Link>
          <div className={styles.panelContent}>
            <span className={styles.panelTag}>✦ Free forever — no card needed</span>
            <h2 className={styles.panelHeadline}>Go live in under 2 minutes</h2>
            <p className={styles.panelSub}>Join 2,400+ restaurants already running smarter with mAInu&apos;s AI-powered OS.</p>
            <ul className={styles.stepList}>
              {[
                { num: '01', title: 'Snap your menu', desc: 'AI extracts every item in seconds' },
                { num: '02', title: 'Your QR goes live', desc: 'Customers scan & order instantly' },
                { num: '03', title: 'Watch revenue climb', desc: 'AI upsells, analytics, KDS — all in one' },
              ].map((s) => (
                <li key={s.num} className={styles.stepItem}>
                  <span className={styles.stepNum}>{s.num}</span>
                  <div>
                    <div className={styles.stepTitle}>{s.title}</div>
                    <div className={styles.stepDesc}>{s.desc}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.statsRow}>
            {[
              { value: '2,400+', label: 'Restaurants' },
              { value: '38%', label: 'Avg order lift' },
              { value: '45s', label: 'Setup time' },
            ].map((s) => (
              <div key={s.label} className={styles.statCard}>
                <div className={styles.statValue}>{s.value}</div>
                <div className={styles.statLabel}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.orb1} />
        <div className={styles.orb2} />
      </aside>

      <main className={styles.formSide}>
        <div className={styles.formWrapper}>
          <Link href="/" className={styles.logoMobile}>
            <span className={styles.logoMarkSm}>m</span>
            <span className={styles.logoTextSm}>AInu</span>
          </Link>
          <div className={styles.formHeader}>
            <h1 className={styles.formTitle}>Create your account</h1>
            <p className={styles.formSubtitle}>Start free — no credit card required</p>
          </div>
          <div className={styles.socialRow}>
            <button className={styles.socialBtn} onClick={handleSocial} disabled={loading} type="button">
              <svg width="18" height="18" viewBox="0 0 48 48" fill="none">
                <path d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" fill="#FFC107"/>
                <path d="M6.306,14.691l6.571,4.819C14.655,15.108,19.001,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" fill="#FF3D00"/>
                <path d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" fill="#4CAF50"/>
                <path d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" fill="#1976D2"/>
              </svg>
              Google
            </button>
            <button className={styles.socialBtn} onClick={handleSocial} disabled={loading} type="button">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </button>
          </div>
          <div className={styles.divider}>
            <span className={styles.dividerLine} />
            <span className={styles.dividerText}>or sign up with email</span>
            <span className={styles.dividerLine} />
          </div>
          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="signup-name">Full name</label>
              <div className={`${styles.inputWrap} ${errors.name ? styles.inputError : ''}`}>
                <User size={16} className={styles.inputIcon} />
                <input id="signup-name" type="text" className={styles.input} placeholder="Priya Sharma" value={name} onChange={(e) => { setName(e.target.value); setErrors(p => ({ ...p, name: '' })); }} autoComplete="name" />
              </div>
              {errors.name && <span className={styles.errorMsg}>{errors.name}</span>}
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="signup-email">Work email</label>
              <div className={`${styles.inputWrap} ${errors.email ? styles.inputError : ''}`}>
                <Mail size={16} className={styles.inputIcon} />
                <input id="signup-email" type="email" className={styles.input} placeholder="you@restaurant.com" value={email} onChange={(e) => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })); }} autoComplete="email" />
              </div>
              {errors.email && <span className={styles.errorMsg}>{errors.email}</span>}
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="signup-password">Password</label>
              <div className={`${styles.inputWrap} ${errors.password ? styles.inputError : ''}`}>
                <Lock size={16} className={styles.inputIcon} />
                <input id="signup-password" type={showPassword ? 'text' : 'password'} className={styles.input} placeholder="Min. 8 characters" value={password} onChange={(e) => { setPassword(e.target.value); setErrors(p => ({ ...p, password: '' })); }} autoComplete="new-password" />
                <button type="button" className={styles.eyeBtn} onClick={() => setShowPassword(!showPassword)} aria-label="Toggle password">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {password && (
                <div className={styles.strengthWrap}>
                  <div className={styles.strengthBars}>
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className={styles.strengthBar} style={{ background: i <= strength ? STRENGTH_COLORS[strength] : 'var(--border)' }} />
                    ))}
                  </div>
                  <span className={styles.strengthLabel} style={{ color: STRENGTH_COLORS[strength] }}>
                    {STRENGTH_LABELS[strength]}
                  </span>
                </div>
              )}
              {errors.password && <span className={styles.errorMsg}>{errors.password}</span>}
            </div>
            <label className={`${styles.checkLabel} ${errors.agreed ? styles.checkLabelError : ''}`}>
              <input type="checkbox" className={styles.checkboxInput} checked={agreed} onChange={(e) => { setAgreed(e.target.checked); setErrors(p => ({ ...p, agreed: '' })); }} />
              <span className={styles.checkCustom}>{agreed && <Check size={11} strokeWidth={3} color="white" />}</span>
              <span className={styles.checkText}>
                I agree to the{' '}
                <a href="/terms" className={styles.termLink}>Terms of Service</a>
                {' '}and{' '}
                <a href="/privacy" className={styles.termLink}>Privacy Policy</a>
              </span>
            </label>
            {errors.agreed && <span className={styles.errorMsg} style={{ marginTop: '-8px' }}>{errors.agreed}</span>}
            <button type="submit" className={`${styles.submitBtn} ${loading ? styles.submitLoading : ''}`} disabled={loading}>
              {loading ? <span className={styles.spinner} /> : <><span>Create free account</span><ArrowRight size={16} /></>}
            </button>
          </form>
          <p className={styles.switchLink}>
            Already have an account?{' '}
            <Link href="/login" className={styles.switchAnchor}>Sign in →</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
