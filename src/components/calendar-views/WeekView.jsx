import React, { useState } from "react";
import { formatTime } from "../../utils/dateUtils";
// import ViewSelector from "../ViewSelector";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

export default function WeekView({
  weekStartDate,
  setWeekStartDate,
  viewMode,
  setViewMode,
  events = {},
  setEvents,
  today,
  tasks = [],
  onGoToToday,
}) {
  const [currentTime, setCurrentTime] = useState(new Date());

  const navigateWeek = (direction) => {
    const newDate = new Date(weekStartDate);
    if (direction === "prev") {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() + 7);
    }
    setWeekStartDate(newDate);
  };

  const getWeekStart = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  };

  // Generate week days
  const getWeekDays = () => {
    const days = [];
    const startDate = new Date(weekStartDate || today);

    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const weekDays = getWeekDays();

  // Enhanced time slots generation
  const generateTimeSlots = () => {
    const slots = [];
    const currentHour = new Date().getHours();

    for (let hour = 0; hour < 24; hour++) {
      const isCurrentHour =
        hour === currentHour &&
        weekDays.some((day) => day.toDateString() === today.toDateString());

      slots.push(
        <div
          key={hour}
          className={`grid grid-cols-8 border-b border-gray-200/60 min-h-[80px] relative group ${
            isCurrentHour
              ? "bg-gradient-to-r from-blue-50/50 to-purple-50/50"
              : "hover:bg-gradient-to-r hover:from-gray-50/50 hover:to-blue-50/50"
          }`}
        >
          {/* Time column */}
          <div className="col-span-1 flex items-start justify-end pr-4 pt-2 border-r border-gray-200/60">
            <div
              className={`text-sm font-semibold ${
                isCurrentHour ? "text-blue-600" : "text-gray-600"
              }`}
            >
              {hour === 0
                ? "12 AM"
                : hour === 12
                ? "12 PM"
                : hour > 12
                ? `${hour - 12} PM`
                : `${hour} AM`}
            </div>
          </div>

          {/* Day columns */}
          {weekDays.map((day, dayIndex) => {
            const dateStr = day.toISOString().split("T")[0];
            const timeStr = `${String(hour).padStart(2, "0")}:00`;
            const dayEvents = [
              ...(events[`${dateStr}T${timeStr}`] || []),
              ...(events[dateStr]?.filter((event) => event.time === timeStr) || []),
            ];
            const isToday = day.toDateString() === today.toDateString();

            return (
              <div
                key={dayIndex}
                className={`col-span-1 border-r border-gray-200/60 p-2 relative cursor-pointer transition-all duration-300 ${
                  isToday
                    ? "bg-gradient-to-b from-blue-50/30 to-purple-50/30"
                    : "hover:bg-gradient-to-b hover:from-blue-50/20 hover:to-purple-50/20"
                }`}
              >
                {/* Events display */}
                {dayEvents.map((event, idx) => (
                  <div
                    key={idx}
                    className="mb-1 p-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer border border-white/20"
                  >
                    <div className="font-bold truncate">{event.title}</div>
                    <div className="text-xs opacity-80">{event.time}</div>
                  </div>
                ))}

                {/* Current time indicator */}
                {isCurrentHour && isToday && (
                  <div
                    className="absolute left-0 right-0 flex items-center pointer-events-none z-20"
                    style={{ top: `${(new Date().getMinutes() / 60) * 100}%` }}
                  >
                    <div className="w-3 h-3 bg-red-500 rounded-full shadow-lg animate-pulse"></div>
                    <div className="h-0.5 flex-1 bg-gradient-to-r from-red-500 to-red-400"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      );
    }

    return slots;
  };

  return (
    <div className="w-full h-full flex flex-col bg-transparent relative overflow-hidden">
      {/* Cosmic floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-blue-200/10 to-purple-200/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-40 left-20 w-80 h-80 bg-gradient-to-br from-pink-200/10 to-indigo-200/10 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-br from-green-200/10 to-teal-200/10 rounded-full blur-3xl animate-pulse animation-delay-4000"></div>
        <div className="absolute top-32 left-1/4 w-48 h-48 bg-gradient-to-br from-amber-200/10 to-orange-200/10 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
        <div className="absolute bottom-20 right-1/3 w-56 h-56 bg-gradient-to-br from-violet-200/10 to-rose-200/10 rounded-full blur-3xl animate-pulse animation-delay-3000"></div>
      </div>

      {/* Ultra-futuristic floating header */}
      <div className="sticky top-0 z-30 px-6 pt-6 pb-4">
        <div className="bg-white/10 backdrop-blur-3xl rounded-[2rem] p-8 shadow-[0_25px_60px_rgba(8,_112,_184,_0.8)] border border-white/30 relative overflow-hidden">
          {/* Holographic overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-gradient-x"></div>

          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center space-x-8">
              <div className="relative group">
                <h1 className="text-5xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-2xl">
                  Week of{" "}
                  {(weekStartDate || today).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </h1>
                <div className="absolute -bottom-2 left-0 w-full h-2 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full transform origin-left group-hover:scale-x-100 scale-x-0 transition-transform duration-700"></div>

                {/* Floating decorative elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-bounce shadow-2xl"></div>
                <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-gradient-to-r from-green-400 to-teal-500 rounded-full animate-pulse shadow-xl"></div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              {/* Removed <ViewSelector currentView={viewMode} setViewMode={setViewMode} /> */}
              <button
                className="group relative px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold shadow-2xl transform transition-all duration-300 hover:scale-110 hover:shadow-emerald-500/25 overflow-hidden"
                onClick={() => {
                  if (onGoToToday) onGoToToday();
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <span className="relative z-10 flex items-center gap-2">
                  <span className="text-xl animate-bounce">✨</span>
                  Today
                </span>
              </button>

              <div className="flex bg-white/20 backdrop-blur-xl rounded-2xl shadow-lg overflow-hidden p-1">
                <button
                  onClick={() => navigateWeek("prev")}
                  className="p-4 text-gray-700 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white transition-all duration-300 group rounded-xl"
                >
                  <ChevronLeft className="w-6 h-6 transform group-hover:scale-110 transition-transform duration-200" />
                </button>
                <button
                  onClick={() => navigateWeek("next")}
                  className="p-4 text-gray-700 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white transition-all duration-300 group rounded-xl"
                >
                  <ChevronRight className="w-6 h-6 transform group-hover:scale-110 transition-transform duration-200" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced week days header */}
      <div className="sticky top-[140px] z-20 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-lg">
        <div className="grid grid-cols-8 py-4">
          {/* Time column header */}
          <div className="col-span-1 flex items-center justify-center border-r border-gray-200/60">
            <div className="text-sm font-bold text-gray-600">Time</div>
          </div>

          {/* Day headers */}
          {weekDays.map((day, index) => {
            const isToday = day.toDateString() === today.toDateString();
            const dayEvents = Object.keys(events).filter((key) =>
              key.startsWith(day.toISOString().split("T")[0])
            ).length;

            return (
              <div
                key={index}
                className={`col-span-1 text-center border-r border-gray-200/60 p-4 cursor-pointer transition-all duration-300 hover:bg-gradient-to-b hover:from-blue-50 hover:to-purple-50 relative group ${
                  isToday ? "bg-gradient-to-b from-blue-100/50 to-purple-100/50" : ""
                }`}
                onClick={() =>
                  handleDayClick && handleDayClick(day.toISOString().split("T")[0])
                }
              >
                <div
                  className={`text-sm font-bold ${
                    isToday ? "text-blue-600" : "text-gray-600"
                  } mb-1`}
                >
                  {day.toLocaleDateString("en-US", { weekday: "short" })}
                </div>
                <div
                  className={`text-2xl font-black ${
                    isToday ? "text-blue-700" : "text-gray-800"
                  } relative`}
                >
                  {day.getDate()}
                  {isToday && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
                  )}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {day.toLocaleDateString("en-US", { month: "short" })}
                </div>

                {/* Event count indicator */}
                {dayEvents > 0 && (
                  <div className="absolute top-2 right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-lg animate-bounce">
                    {dayEvents}
                  </div>
                )}

                {/* Hover effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Enhanced time slots grid */}
      <div className="flex-1 overflow-y-auto bg-gradient-to-br from-white/50 via-gray-50/30 to-blue-50/30 backdrop-blur-sm relative">
        {/* Floating background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(59,130,246,0.5),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(168,85,247,0.5),transparent_50%)]"></div>
        </div>

        <div className="relative z-10">{generateTimeSlots()}</div>
      </div>
    </div>
  );
}


