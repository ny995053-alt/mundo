import type { Metadata } from "next";
import Image from "next/image";

import authBackground from "@/public/auth background.png";

import ArtworkReveal from "../artwork-reveal";
import authStyles from "../page.module.css";
import ResetPasswordForm from "./reset-password-form";
import styles from "./forgot-password.module.css";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Recover access to your Mundo Museum workspace.",
};

export default function ForgotPasswordPage() {
  return (
    <main className={authStyles.page}>
      <section
        className={authStyles.scene}
        aria-labelledby="forgot-password-title"
      >
        <Image
          className={authStyles.background}
          src={authBackground}
          alt=""
          fill
          preload
          unoptimized
          sizes="max(100vw, 125svh)"
        />

        <ArtworkReveal />

        <div className={styles.resetPanel}>
          <ResetPasswordForm />
        </div>
      </section>
    </main>
  );
}
