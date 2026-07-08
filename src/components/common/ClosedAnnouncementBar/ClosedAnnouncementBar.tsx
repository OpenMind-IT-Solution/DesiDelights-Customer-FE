"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import styles from "./ClosedAnnouncementBar.module.css";

const WEEKDAY_NAMES = [
  "Sunday", "Monday", "Tuesday", "Wednesday",
  "Thursday", "Friday", "Saturday",
];

const STYLE_ID = "closed-announcement-keyframes";

const ClosedAnnouncementBar = () => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [ready, setReady] = useState(false);
  const textRef = useRef<HTMLSpanElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const getBelgiumDate = (daysFromNow = 0) => {
    const now = new Date();
    const target = new Date(now);
    target.setDate(target.getDate() + daysFromNow);
    const formatter = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Etc/GMT-2",
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      hourCycle: "h23",
      weekday: "long",
    });
    const parts = formatter.formatToParts(target);
    const year = parseInt(parts.find(p => p.type === "year")?.value ?? "0", 10);
    const month = parseInt(parts.find(p => p.type === "month")?.value ?? "0", 10) - 1;
    const dayNum = parseInt(parts.find(p => p.type === "day")?.value ?? "0", 10);
    const hour = parseInt(parts.find(p => p.type === "hour")?.value ?? "0", 10);
    const dayName = parts.find(p => p.type === "weekday")?.value ?? "";
    const dayOfWeek = WEEKDAY_NAMES.indexOf(dayName);
    return { year, month, dayNum, hour, dayOfWeek, dayName };
  };

  useEffect(() => {
    const check = () => {
      const { hour, dayOfWeek: day } = getBelgiumDate();

      const isWeekend = day === 0 || day === 6;
      const openHour = isWeekend ? 16 : 11;
      const closeHour = isWeekend ? 22 : 21;
      const isClosed = hour < openHour || hour >= closeHour;

      if (!isClosed) {
        setVisible(false);
        return;
      }

      setVisible(true);

      const openToday = isWeekend ? hour < 16 : hour < 11;
      const offset = openToday ? 0 : 1;
      const next = getBelgiumDate(offset);

      const nextOpenHour = next.dayOfWeek === 0 || next.dayOfWeek === 6 ? 16 : 11;
      const fmtHour = (h: number) => {
        if (h === 11) return "11:00 AM";
        if (h === 16) return "4:00 PM";
        return `${h}:00`;
      };

      setMessage(
        `We are closed now! We'll be back ${next.dayName} at ${fmtHour(nextOpenHour)}. Thank you for your patience.`
      );
    };

    check();
    const t = setInterval(check, 60_000);
    return () => clearInterval(t);
  }, []);

  const computePositions = useCallback(() => {
    if (!trackRef.current || !textRef.current || !message) return;

    const containerWidth = trackRef.current.offsetWidth;
    const textWidth = textRef.current.offsetWidth;

    const start = containerWidth;
    const end = -(textWidth + 20);

    let styleEl = document.getElementById(STYLE_ID);
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = STYLE_ID;
      document.head.appendChild(styleEl);
    }

    styleEl.textContent = `
      @keyframes announcementScroll {
        0% { transform: translateX(${start}px); }
        100% { transform: translateX(${end}px); }
      }
    `;

    if (!ready) setReady(true);
  }, [message, ready]);

  useEffect(() => {
    if (!visible || !message) return;

    computePositions();

    const handleResize = () => computePositions();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [visible, message, computePositions]);

  useEffect(() => {
    return () => {
      const styleEl = document.getElementById(STYLE_ID);
      if (styleEl) styleEl.remove();
    };
  }, []);

  return (
    <div
      className={`${styles.wrapper} ${visible ? styles.visible : ""}`}
      aria-hidden={!visible}
    >
      <div className={styles.bar}>
        <div className={styles.tickerTrack} ref={trackRef}>
          <span
            ref={textRef}
            className={styles.tickerContent}
            style={
              ready
                ? { animation: "announcementScroll 14s linear infinite" }
                : { visibility: "hidden" }
            }
          >
            {message}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ClosedAnnouncementBar;
