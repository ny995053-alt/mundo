"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";

import styles from "./forgot-password.module.css";

export default function ResetPasswordForm() {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [email, setEmail] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSending) return;

    setIsSending(true);
    setSubmittedEmail(email.trim());

    timerRef.current = setTimeout(() => {
      setIsSending(false);
      setIsSent(true);
    }, 700);
  };

  if (isSent) {
    return (
      <div className={styles.resetCard} aria-live="polite">
        <div className={styles.successMark} aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="m7 12.5 3.2 3.2L17.5 8.5" />
          </svg>
        </div>

        <p className={styles.eyebrow}>RECOVERY LINK SENT</p>
        <h1 id="forgot-password-title" className={styles.title}>
          Check your inbox
        </h1>
        <p className={styles.description}>
          If a Mundo account exists for <strong>{submittedEmail}</strong>, a
          secure reset link is on its way.
        </p>

        <button
          className={styles.secondaryButton}
          type="button"
          onClick={() => {
            setIsSent(false);
            setSubmittedEmail("");
          }}
        >
          Try another email
        </button>

        <Link className={styles.backLink} href="/">
          <span aria-hidden="true">←</span>
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.resetCard}>
      <h1 id="forgot-password-title" className={styles.title}>
        Forgot your password?
      </h1>
      <p className={styles.description}>
        Enter your account email and we&apos;ll send you a secure link to create
        a new password.
      </p>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label htmlFor="recovery-email">Email Address</label>
          <input
            id="recovery-email"
            name="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            inputMode="email"
            placeholder="name@example.com"
            required
            autoFocus
          />
        </div>

        <button
          className={styles.submitButton}
          type="submit"
          disabled={isSending}
        >
          {isSending ? (
            <>
              <span className={styles.spinner} aria-hidden="true" />
              Sending link…
            </>
          ) : (
            "Send reset link"
          )}
        </button>
      </form>

      <Link className={styles.backLink} href="/">
        <span aria-hidden="true">←</span>
        Back to sign in
      </Link>
    </div>
  );
}
