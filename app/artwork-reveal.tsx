"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import hoverArtwork from "@/public/hover.png";
import mainArtwork from "@/public/main.png";

import styles from "./page.module.css";

type Point = {
  x: number;
  y: number;
};

export default function ArtworkReveal() {
  const rootRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const currentPointRef = useRef<Point>({ x: 0, y: 0 });
  const targetPointRef = useRef<Point>({ x: 0, y: 0 });
  const hasPositionRef = useRef(false);
  const [isRevealing, setIsRevealing] = useState(false);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const paintReveal = () => {
    const root = rootRef.current;
    if (!root) {
      animationFrameRef.current = null;
      return;
    }

    const current = currentPointRef.current;
    const target = targetPointRef.current;
    current.x += (target.x - current.x) * 0.55;
    current.y += (target.y - current.y) * 0.55;

    root.style.setProperty("--reveal-x", `${current.x}px`);
    root.style.setProperty("--reveal-y", `${current.y}px`);

    const distance = Math.abs(target.x - current.x) + Math.abs(target.y - current.y);
    if (distance > 0.1) {
      animationFrameRef.current = requestAnimationFrame(paintReveal);
    } else {
      currentPointRef.current = { ...target };
      animationFrameRef.current = null;
    }
  };

  const moveReveal = (clientX: number, clientY: number) => {
    const root = rootRef.current;
    if (!root) return;

    const bounds = root.getBoundingClientRect();
    const nextPoint = {
      x: clientX - bounds.left,
      y: clientY - bounds.top,
    };

    targetPointRef.current = nextPoint;
    if (!hasPositionRef.current) {
      currentPointRef.current = nextPoint;
      hasPositionRef.current = true;
      root.style.setProperty("--reveal-x", `${nextPoint.x}px`);
      root.style.setProperty("--reveal-y", `${nextPoint.y}px`);
    }

    if (animationFrameRef.current === null) {
      animationFrameRef.current = requestAnimationFrame(paintReveal);
    }
  };

  const revealFromKeyboard = () => {
    const root = rootRef.current;
    if (!root) return;

    const bounds = root.getBoundingClientRect();
    moveReveal(bounds.left + bounds.width * 0.29, bounds.top + bounds.height * 0.4);
    setIsRevealing(true);
  };

  return (
    <div
      ref={rootRef}
      className={`${styles.artworkExperience} ${isRevealing ? styles.isRevealing : ""}`}
    >
      <div className={`${styles.artLayer} ${styles.mainLayer}`}>
        <Image
          className={`${styles.artImage} ${styles.mainArtwork}`}
          src={mainArtwork}
          alt="An ancient Egyptian warrior holding a shield and ceremonial weapon"
          loading="eager"
          unoptimized
          draggable={false}
          sizes="54vw"
        />
      </div>

      <div className={`${styles.artLayer} ${styles.hoverLayer}`} aria-hidden="true">
        <Image
          className={`${styles.artImage} ${styles.hoverArtwork}`}
          src={hoverArtwork}
          alt=""
          loading="eager"
          unoptimized
          draggable={false}
          sizes="51vw"
        />
      </div>

      <div className={styles.revealGlow} aria-hidden="true" />

      <div
        className={styles.artHotspot}
        role="button"
        tabIndex={0}
        aria-label="Explore the artwork. Move your pointer to reveal its modern form."
        onPointerEnter={(event) => {
          moveReveal(event.clientX, event.clientY);
          setIsRevealing(true);
        }}
        onPointerMove={(event) => moveReveal(event.clientX, event.clientY)}
        onPointerLeave={() => {
          hasPositionRef.current = false;
          setIsRevealing(false);
        }}
        onPointerDown={(event) => {
          moveReveal(event.clientX, event.clientY);
          setIsRevealing(true);
        }}
        onPointerUp={(event) => {
          if (event.pointerType !== "mouse") {
            setIsRevealing(false);
          }
        }}
        onPointerCancel={() => setIsRevealing(false)}
        onFocus={revealFromKeyboard}
        onBlur={() => setIsRevealing(false)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setIsRevealing((visible) => !visible);
          }
        }}
      />
    </div>
  );
}
