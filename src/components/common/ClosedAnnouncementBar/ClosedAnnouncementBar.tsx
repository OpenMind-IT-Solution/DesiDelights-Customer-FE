"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./ClosedAnnouncementBar.module.css";

const WEEKDAY_NAMES = [
  "Sunday", "Monday", "Tuesday", "Wednesday",
  "Thursday", "Friday", "Saturday",
];

const ClosedAnnouncementBar = () => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const textRef = useRef<HTMLSpanElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const check = () => {
      const now = new Date();
      const belgiumTime = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Europe/Brussels",
        hour: "numeric",
        minute: "2-digit",
        hour12: false,
      }).formatToParts(now);

      const hour = Number(
        belgiumTime.find((part) => part.type === "hour")?.value ?? "0"
      );
      const shouldShow = hour === 8;

      setVisible(shouldShow);

      if (!shouldShow) {
        setMessage("");
        return;
      }

      const next = new Date(now);
      next.setDate(next.getDate() + 1);
      next.setHours(11, 0, 0, 0);
      const skippedWednesday = next.getDay() === 3;
      if (skippedWednesday) next.setDate(next.getDate() + 1);
      const dayText = skippedWednesday ? WEEKDAY_NAMES[next.getDay()] : "tomorrow";
      setMessage(
        `We are closed now! We'll be back ${dayText} at 11:00 AM. Thank you for your patience.`
      );
    };
    check();
    const t = setInterval(check, 60_000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!visible || !trackRef.current || !textRef.current || !message) return;

    const cw = trackRef.current.offsetWidth;
    const tw = textRef.current.offsetWidth;

    trackRef.current.style.setProperty("--start", `${cw}px`);
    trackRef.current.style.setProperty("--end", `${-tw}px`);
    setReady(true);
  }, [visible, message]);

  return (
    <>
      <style>{`
        @keyframes announcementScroll {
          0% { transform: translateX(var(--start)); }
          100% { transform: translateX(var(--end)); }
        }
      `}</style>
      <div className={`${styles.wrapper} ${visible ? styles.visible : ""}`}>
        <div className={styles.bar}>
          <div className={styles.tickerTrack} ref={trackRef}>
            <span
              className={styles.tickerContent}
              ref={textRef}
              style={
                ready
                  ? { animation: "announcementScroll 10s linear infinite" }
                  : { visibility: "hidden" }
              }
            >
              {message}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClosedAnnouncementBar;
