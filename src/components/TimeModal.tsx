"use client";

import {IoClose} from "react-icons/io5";

const generateTimes = () => {
  const times: string[] = [];
  let hour = 0;
  let minute = 0;

  while (hour < 24) {
    const start = formatTime(hour, minute);

    minute += 30;
    if (minute === 60) {
      hour++;
      minute = 0;
    }

    const end = formatTime(hour, minute);
    times.push(`${start} - ${end}`);
  }

  return times;
};

const formatTime = (h: number, m: number) => {
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  const min = m.toString().padStart(2, "0");
  return `${hour}:${min} ${ampm}`;
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

  const times = generateTimes();

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
            onClick={() => setSelectedDay("today")}
            className={`px-5 py-2 rounded-full ${
              selectedDay === "today"
                ? "bg-[#FA664D] text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Today
          </button>

          <button
            onClick={() => setSelectedDay("tomorrow")}
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
