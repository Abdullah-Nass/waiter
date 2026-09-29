"use client";

import { useEffect, useRef } from "react";

export function useUnlockAudio(src: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(src);
    audio.preload = "auto";
    audioRef.current = audio;

    let unlocking = false;

    const cleanup = () => {
      window.removeEventListener("click", unlock);
      window.removeEventListener("keydown", unlock);
      window.removeEventListener("touchstart", unlock);
    };

    const unlock = () => {
      cleanup();
      unlocking = true;
      audio.muted = true;

      audio
        .play()
        .then(() => {
          if (unlocking) {
            audio.pause();
            audio.currentTime = 0;
          }
        })
        .catch(() => {})
        .finally(() => {
          unlocking = false;
          audio.muted = false;
        });
    };

    window.addEventListener("click", unlock);
    window.addEventListener("keydown", unlock);
    window.addEventListener("touchstart", unlock);

    return () => {
      cleanup();
      audio.pause();
    };
  }, [src]);

  return audioRef;
}
