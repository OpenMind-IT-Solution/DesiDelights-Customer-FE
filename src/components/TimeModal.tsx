"use client";
import {useState, useEffect} from "react";

type Props = {
  onClose: () => void;
  onSelect: (time: string) => void;
  selectedTime: string | null;
};

export default function TimeModal({onClose, onSelect, selectedTime}: Props) {
  const [day, setDay] = useState<"today" | "tomorrow">("today");
  const [localSelected, setLocalSelected] = useState<string | null>(null);

  // ✅ sync parent value when modal opens
  useEffect(() => {
    setLocalSelected(selectedTime);
  }, [selectedTime]);

  function generateSlots() {
    const slots = [];
    let now = new Date();

    if (day === "tomorrow") {
      now.setDate(now.getDate() + 1);
      now.setHours(0, 0, 0, 0);
    } else {
      const minutes = now.getMinutes();
      const next = minutes < 30 ? 30 : 60;

      now.setMinutes(next);
      now.setSeconds(0);

      if (next === 60) {
        now.setHours(now.getHours() + 1);
        now.setMinutes(0);
      }
    }

    for (let i = 0; i < 20; i++) {
      const start = new Date(now);
      const end = new Date(now);
      end.setMinutes(end.getMinutes() + 30);

      slots.push({
        label: `${formatTime(start)} - ${formatTime(end)}`,
      });

      now.setMinutes(now.getMinutes() + 30);
    }

    return slots;
  }

  function formatTime(date: Date) {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const slots = generateSlots();

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-[60]">
      <div className="bg-white w-[600px] max-w-full rounded-2xl p-6 shadow-xl">
        {/* HEADER */}
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold">Select Time Schedule</h2>
          <button onClick={onClose}>✕</button>
        </div>

        {/* DAY */}
        <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-full w-fit">
          <button
            onClick={() => setDay("today")}
            className={`px-5 py-2 rounded-full ${
              day === "today" ? "bg-[var(--primary-color)] text-white" : ""
            }`}
          >
            Today
          </button>

          <button
            onClick={() => setDay("tomorrow")}
            className={`px-5 py-2 rounded-full ${
              day === "tomorrow" ? "bg-[var(--primary-color)] text-white" : ""
            }`}
          >
            Tomorrow
          </button>
        </div>

        {/* SLOTS */}
        <div className="grid grid-cols-2 gap-4 max-h-[400px] overflow-y-auto">
          {slots.map((slot, i) => {
            const fullTime = `${day} - ${slot.label}`;

            return (
              <div
                key={i}
                onClick={() => setLocalSelected(fullTime)}
                className={`cursor-pointer py-3 text-center rounded-full text-sm transition
                ${
                  localSelected === fullTime
                    ? "bg-[var(--primary-color)] text-white shadow"
                    : "bg-gray-100"
                }`}
              >
                {slot.label}
              </div>
            );
          })}
        </div>

        {/* CONFIRM */}
        {localSelected && (
          <button
            onClick={() => {
              onSelect(localSelected);
              onClose();
            }}
            className="mt-6 w-full bg-[var(--primary-color)] text-white py-3 rounded-full"
          >
            Confirm Time
          </button>
        )}
      </div>
    </div>
  );
}
