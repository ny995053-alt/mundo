import type { Metadata } from "next";
import Image from "next/image";

import authBackground from "@/public/auth background.png";

import ArtworkReveal from "./artwork-reveal";
import SignInForm from "./sign-in-form";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to the Mundo Museum visitor intelligence workspace.",
};

export default function Home() {
  return (
    <main className={styles.page}>
      <section className={styles.scene} aria-labelledby="sign-in-title">
        <Image
          className={styles.background}
          src={authBackground}
          alt=""
          fill
          preload
          unoptimized
          sizes="max(100vw, 125svh)"
        />

        <ArtworkReveal />

        <div className={styles.signInPanel}>
          <h1 id="sign-in-title" className={styles.srOnly}>
            Sign in to Mundo Museum
          </h1>
          <SignInForm />
        </div>
      </section>
    </main>
  );
}
