import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function WeekView({
  dayViewDate,
  setDayViewDate, // This will be used to update the date when navigating weeks
  events = {},
  today,
  onGoToToday,
  ...props
}) {
  // Always ensure dayViewDate is a Date object
  const currentDate = dayViewDate instanceof Date ? dayViewDate : new Date(dayViewDate);

  // Get the start of the week (Sunday)
  const getWeekStartDate = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    const weekStart = new Date(d.setDate(diff));
    weekStart.setHours(0, 0, 0, 0);
    return weekStart;
  };

  // Generate array of 7 days for the week
  const getWeekDays = (date) => {
    const weekStart = getWeekStartDate(date);
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const [currentWeek, setCurrentWeek] = useState(getWeekDays(currentDate));

  // Update week if dayViewDate changes from outside
  useEffect(() => {
    setCurrentWeek(getWeekDays(currentDate));
  }, [dayViewDate]);

  const handleNavigateWeek = (direction) => {
    const currentStartDate = currentWeek[0];
    const newStartDate = new Date(currentStartDate);
    if (direction === "prev") {
      newStartDate.setDate(newStartDate.getDate() - 7);
    } else {
      newStartDate.setDate(newStartDate.getDate() + 7);
    }
    // Update the parent component's date, which will trigger the useEffect
    if (typeof setDayViewDate === "function") {
      setDayViewDate(newStartDate);
    }
  };

  const weekStartFormatted = currentWeek[0].toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });
  const weekEndFormatted = currentWeek[6].toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="w-full h-full flex flex-col bg-transparent relative overflow-hidden">
      {/* Cosmic floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-blue-200/10 to-purple-200/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-40 left-20 w-80 h-80 bg-gradient-to-br from-pink-200/10 to-indigo-200/10 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-br from-green-200/10 to-teal-200/10 rounded-full blur-3xl animate-pulse animation-delay-4000"></div>
      </div>

      {/* Header */}
      <div className="sticky top-0 z-30 px-2 pt-2 pb-2">
        <div className="bg-white/10 backdrop-blur-3xl rounded-xl p-3 shadow border border-white/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-gradient-x"></div>

          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center space-x-6">
              <div className="relative group">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-2xl">
                  {weekStartFormatted} - {weekEndFormatted}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              <button
                className="group relative px-3 md:px-6 py-2 md:py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-emerald-500/25 overflow-hidden text-sm md:text-base"
                onClick={onGoToToday}
              >
                <span className="relative z-10">Today</span>
              </button>

              <div className="flex bg-white/20 backdrop-blur-xl rounded-xl shadow-md overflow-hidden p-0.5">
                <button
                  onClick={() => handleNavigateWeek("prev")}
                  className="p-2 md:p-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white transition-all duration-300 group rounded-lg"
                >
                  <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
                </button>
                <button
                  onClick={() => handleNavigateWeek("next")}
                  className="p-2 md:p-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white transition-all duration-300 group rounded-lg"
                >
                  <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content - responsive for mobile */}
      <div className="flex-1 overflow-auto px-1 sm:px-2 pb-2 relative z-10">
        <div className="max-w-full sm:max-w-2xl md:max-w-4xl lg:max-w-7xl mx-auto px-0 sm:px-2">
          {/* Mobile: Show days in vertical stack on very small screens */}
          <div className="sm:hidden space-y-2">
            {currentWeek.map((date, index) => {
              const dateStr = date.toISOString().split("T")[0];
              const dayEvents = events[dateStr] || [];
              const isToday = date.toDateString() === today.toDateString();

              return (
                <div
                  key={dateStr}
                  className={`p-3 rounded-xl border transition-all duration-300 ${
                    isToday
                      ? "bg-gradient-to-r from-blue-100 to-purple-100 border-blue-300"
                      : "bg-white/60 border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="text-sm font-bold text-gray-800">
                        {date.toLocaleDateString("en-US", { weekday: "short" })}
                      </div>
                      <div
                        className={`text-lg font-bold ${
                          isToday ? "text-blue-600" : "text-gray-700"
                        }`}
                      >
                        {date.getDate()}
                      </div>
                    </div>
                    {dayEvents.length > 0 && (
                      <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                        {dayEvents.length}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    {dayEvents.slice(0, 3).map((event, idx) => (
                      <div key={idx} className="text-xs bg-blue-50 p-2 rounded border-l-2 border-blue-400">
                        <div className="font-medium text-blue-800">{event.title}</div>
                        {event.time && <div className="text-blue-600">{event.time}</div>}
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="text-xs text-gray-500 text-center">
                        +{dayEvents.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop/Tablet: Traditional 7-column grid for larger screens */}
          <div className="hidden sm:grid grid-cols-7 gap-1 md:gap-2 lg:gap-3">
            {/* Day headers */}
            <div className="contents">
              {currentWeek.map((date, index) => {
                const isToday = date.toDateString() === today.toDateString();
                return (
                  <div
                    key={`header-${index}`}
                    className={`text-center p-2 md:p-3 font-bold text-sm md:text-base border-b-2 ${
                      isToday
                        ? "text-blue-600 border-blue-400 bg-blue-50"
                        : "text-gray-700 border-gray-200"
                    }`}
                  >
                    <div>{date.toLocaleDateString("en-US", { weekday: "short" })}</div>
                    <div className={`text-lg md:text-xl ${isToday ? "text-blue-600" : "text-gray-800"}`}>
                      {date.getDate()}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Day content cells */}
            <div className="contents">
              {currentWeek.map((date, index) => {
                const dateStr = date.toISOString().split("T")[0];
                const dayEvents = events[dateStr] || [];
                const isToday = date.toDateString() === today.toDateString();

                return (
                  <div
                    key={`content-${index}`}
                    className={`min-h-[120px] md:min-h-[200px] p-2 md:p-3 border border-gray-200 transition-all duration-300 hover:bg-gray-50 ${
                      isToday ? "bg-blue-50/50" : "bg-white/60"
                    }`}
                  >
                    <div className="space-y-1">
                      {dayEvents.slice(0, 4).map((event, idx) => (
                        <div key={idx} className="text-xs bg-blue-100 p-1.5 md:p-2 rounded border-l-2 border-blue-400">
                          <div className="font-medium text-blue-800 truncate">{event.title}</div>
                          {event.time && <div className="text-blue-600">{event.time}</div>}
                        </div>
                      ))}
                      {dayEvents.length > 4 && (
                        <div className="text-xs text-gray-500 text-center">
                          +{dayEvents.length - 4} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


