"use client";

import {IoClose} from "react-icons/io5";

const generateTimes = (selectedDay: "today" | "tomorrow" = "today") => {
  const times: string[] = [];
  
  // Get current time for filtering
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  // Closing time is 8 PM (20:00)
  const CLOSING_HOUR = 20;
  
  // Starting time: 4 PM (16:00) for today, 11 AM (11:00) for tomorrow
  const startHour = selectedDay === "today" ? 16 : 11;
  
  let hour = startHour;
  let minute = 0;

  while (hour < CLOSING_HOUR) {
    const start = formatTime(hour, minute);

    minute += 30;
    if (minute === 60) {
      hour++;
      minute = 0;
    }

    // Stop if we've reached closing time
    if (hour > CLOSING_HOUR) {
      break;
    }

    const end = formatTime(hour, minute);
    const timeSlot = `${start} - ${end}`;

    // If today, only add times that are in the future
    if (selectedDay === "today") {
      if (hour > currentHour || (hour === currentHour && minute > currentMinute)) {
        times.push(timeSlot);
      }
    } else {
      // If tomorrow, add all times up to closing (including 19:30 - 20:00)
      if (hour <= CLOSING_HOUR) {
        times.push(timeSlot);
      }
    }
  }

  return times;
};

const formatTime = (h: number, m: number) => {
  const hour = h.toString().padStart(2, "0");
  const min = m.toString().padStart(2, "0");
  return `${hour}:${min}`;
};

const TimeModal = ({
  show,
  onClose,
  selectedTime,
  setSelectedTime,
  selectedDay,
  setSelectedDay,
  onConfirm,
}: any) => {
  if (!show) return null;

  const times = generateTimes(selectedDay);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[600px] max-w-[95%] rounded-2xl shadow-xl p-6 relative">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-semibold">Select Time Schedule</h2>
          <button onClick={onClose}>
            <IoClose size={22} />
          </button>
        </div>

        <div className="flex gap-3 mb-6">
          <button
            onClick={() => {
              setSelectedDay("today");
              setSelectedTime(null); // Reset time when switching days
            }}
            className={`px-5 py-2 rounded-full ${
              selectedDay === "today"
                ? "bg-[#FA664D] text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Today
          </button>

          <button
            onClick={() => {
              setSelectedDay("tomorrow");
              setSelectedTime(null); // Reset time when switching days
            }}
            className={`px-5 py-2 rounded-full ${
              selectedDay === "tomorrow"
                ? "bg-[#FA664D] text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Tomorrow
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 max-h-[350px] overflow-y-auto pr-2">
          {times.map((time) => (
            <div
              key={time}
              onClick={() => setSelectedTime(time)}
              className={`py-3 rounded-full text-center cursor-pointer transition ${
                selectedTime === time
                  ? "bg-[#FA664D] text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {time}
            </div>
          ))}
        </div>

        <button
          onClick={() => {
            if (!selectedTime) {
              alert("Please select a time");
              return;
            }

            if (onConfirm) {
              onConfirm({
                day: selectedDay,
                time: selectedTime,
              });
            }

            onClose();
          }}
          className="w-full mt-6 py-3 rounded-full bg-[#FA664D] text-white font-semibold hover:opacity-90"
        >
          Confirm Time
        </button>
      </div>
    </div>
  );
};

export default TimeModal;
