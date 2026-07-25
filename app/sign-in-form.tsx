"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";

import styles from "./page.module.css";

export default function SignInForm() {
  const router = useRouter();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.push("/dashboard");
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label htmlFor="email">Email Address</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          aria-label="Email Address"
          required
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          aria-label="Password"
          required
        />
      </div>

      <Link className={styles.forgotPassword} href="/forgot-password">
        Forgot Password?
      </Link>

      <button className={styles.submitButton} type="submit">
        <span>Sign In</span>
      </button>
    </form>
  );
}
