import React from 'react';
import { formatTime } from '../../utils/dateUtils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function DayView({
  dayViewDate,
  setDayViewDate,
  viewMode,
  setViewMode,
  events = {},
  setEvents,
  today,
  tasks = [],
  onGoToToday,
  ...props
}) {
  // Always ensure dayViewDate is a Date object
  const currentDate = dayViewDate instanceof Date ? dayViewDate : new Date(dayViewDate);

  // Error handling for missing date
  if (!dayViewDate) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center bg-white p-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-12 h-12 text-gray-400 mb-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
          />
        </svg>
        <h2 className="text-lg font-normal text-gray-700 mb-2">Please select a date</h2>
        <button
          className="mt-4 py-2 px-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={handleGoToToday}
        >
          Go to Today
        </button>
      </div>
    );
  }

  // Date parsing with fallback
  let dateObj;
  try {
    dateObj = new Date(dayViewDate);
    if (isNaN(dateObj.getTime())) {
      dateObj = new Date();
    }
  } catch (err) {
    dateObj = new Date();
  }

  const dateDisplay = dateObj.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const dayOfWeek = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
  const dayNumber = dateObj.getDate();

  // Get all-day events
  const allDayEvents = Object.entries(events || {})
    .filter(([key]) => key === dayViewDate)
    .reduce((acc, [_, events]) => [...acc, ...events], []);

  // Get tasks for this day
  const dayTasks = tasks[dayViewDate] || [];

  // Define colorful styles for different parts of the day
  const timeColorScheme = {
    morning: 'bg-gradient-to-r from-amber-50 to-yellow-50', // 6am-12pm
    afternoon: 'bg-gradient-to-r from-blue-50 to-sky-50',   // 12pm-6pm
    evening: 'bg-gradient-to-r from-indigo-50 to-violet-50', // 6pm-12am
    night: 'bg-gradient-to-r from-blue-900/5 to-indigo-900/5', // 12am-6am
  };

  // Get time period color scheme
  const getTimePeriodColor = (hour) => {
    if (hour >= 6 && hour < 12) return timeColorScheme.morning;
    if (hour >= 12 && hour < 18) return timeColorScheme.afternoon;
    if (hour >= 18) return timeColorScheme.evening;
    return timeColorScheme.night;
  };

  // Generate time slots for day view with more colors
  const generateTimeSlots = () => {
    if (!dayViewDate) return [];
    
    const slots = [];
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();
    
    for (let hour = 0; hour < 24; hour++) {
      const timeStr = `${String(hour).padStart(2, '0')}:00`;
      const eventKey = `${dayViewDate}T${timeStr}`;
      const isCurrentTimeHour =
        new Date(dayViewDate).toDateString() === currentTime.toDateString() &&
        hour === currentHour;
      const eventsAtThisTime = events[eventKey] || [];

      slots.push(
        <div 
          key={timeStr} 
          className={`flex border-b border-gray-200/60 relative ${getTimePeriodColor(hour)}`} 
          id={`hour-${hour}`}
        >
          {/* Time indicator */}
          <div className="w-12 py-2 text-right pr-2 text-xs text-gray-500">
            <div className="sticky top-0">
              {hour === 0 ? '' : formatTime(hour, 0)}
            </div>
          </div>

          {/* Event slot (main column) */}
          <div className="flex-1 min-h-[48px] relative">
            {/* Hover interaction zone */}
            <div className="absolute inset-0">
              <button
                className="absolute inset-0 w-full h-full opacity-0 hover:opacity-100"
                onClick={() => handleOpenModal(dayViewDate, `${String(hour).padStart(2, '0')}:00`)}
              >
                <div className="h-full flex items-center justify-center">
                  <div className="text-xs text-blue-600 flex items-center bg-blue-50 p-1 rounded-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-3 h-3 mr-1"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4.5v15m7.5-7.5h-15"
                      />
                    </svg>
                    <span className="font-medium">Add</span>
                  </div>
                </div>
              </button>
            </div>

            {/* Events display with gradient backgrounds */}
            {eventsAtThisTime.map((event, idx) => (
              <div 
                key={idx} 
                className="absolute left-1 right-3 bg-gradient-to-r from-blue-100 to-indigo-100 border-l-4 border-blue-600 text-blue-800 px-2 py-1 text-xs rounded-r-md shadow-sm"
                style={{
                  zIndex: 10,
                  top: '2px',
                  minHeight: '44px',
                }}
              >
                <div className="flex justify-between items-start h-full">
                  <div className="flex flex-col justify-between h-full overflow-hidden">
                    <span className="font-medium truncate">{event.title}</span>
                    <span className="text-xs text-blue-700 opacity-75">
                      {formatTime(parseInt(timeStr.split(':')[0]), 0)} –{' '}
                      {formatTime(parseInt(timeStr.split(':')[0]) + 1, 0)}
                    </span>
                  </div>
                  <div className="opacity-0 hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteEvent(eventKey, idx);
                      }}
                      className="text-gray-500 hover:text-gray-700 p-1"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-3 h-3"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Current time indicator with pulsing effect */}
          {isCurrentTimeHour && (
            <div 
              className="absolute left-0 right-0 flex items-center pointer-events-none" 
              style={{ top: `${currentMinute / 60 * 100}%`, zIndex: 20 }}
            >
              <div className="w-3 h-3 rounded-full ml-[10px] z-10 bg-red-500 shadow-md shadow-red-500/30 animate-pulse"></div>
              <div className="h-[2px] w-full z-10 bg-gradient-to-r from-red-500 to-red-400"></div>
            </div>
          )}
        </div>
      );
    }
    
    return slots;
  };

  const formatDate = (date) => {
    const d = (date instanceof Date) ? date : new Date(date)
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  };

  // Fix: Go to Today button handler
  const handleGoToToday = () => {
    if (typeof setDayViewDate === 'function') {
      setDayViewDate(new Date());
    }
  };

  // Fix: Navigation for previous/next day
  const handleNavigateDay = (direction) => {
    if (!dayViewDate || !setDayViewDate) return;
    const newDate = new Date(dayViewDate);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 1);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setDayViewDate(newDate);
  };

  // Get events for the current day
  const dayEvents = events[
    currentDate && typeof currentDate.toISOString === 'function'
      ? currentDate.toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0]
  ] || [];

  // Fix: Use a state for current time and update every minute
  const [currentTime, setCurrentTime] = React.useState(new Date());
  React.useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000 * 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full flex flex-col bg-transparent relative overflow-hidden">
      {/* Cosmic floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-blue-200/10 to-purple-200/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-40 left-20 w-80 h-80 bg-gradient-to-br from-pink-200/10 to-indigo-200/10 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-br from-green-200/10 to-teal-200/10 rounded-full blur-3xl animate-pulse animation-delay-4000"></div>
      </div>

      {/* Ultra-futuristic floating header */}
      <div className="sticky top-0 z-30 px-4 pt-4 pb-3">
        <div className="bg-white/10 backdrop-blur-3xl rounded-[1.5rem] p-6 shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)] border border-white/30 relative overflow-hidden">
          {/* Holographic overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-gradient-x"></div>
          
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center space-x-6">
              <div className="relative group">
                <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-2xl">
                  {formatDate(currentDate)}
                </h1>
                {/* Show current time below date */}
                <div className="mt-2 text-lg font-bold text-blue-700 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: undefined })}
                </div>
                
                {/* Floating decorative elements */}
                <div className="absolute -top-3 -right-3 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-bounce shadow-xl"></div>
                <div className="absolute -bottom-1.5 -left-1.5 w-5 h-5 bg-gradient-to-r from-green-400 to-teal-500 rounded-full animate-pulse shadow-lg"></div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                className="group relative px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-emerald-500/25 overflow-hidden"
                onClick={handleGoToToday}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <span className="relative z-10 flex items-center gap-2">
                  <span className="text-lg animate-bounce">✨</span>
                  Today
                </span>
              </button>
              
              <div className="flex bg-white/20 backdrop-blur-xl rounded-xl shadow-md overflow-hidden p-0.5">
                <button
                  onClick={() => handleNavigateDay('prev')}
                  className="p-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white transition-all duration-300 group rounded-lg"
                >
                  <ChevronLeft className="w-5 h-5 transform group-hover:scale-110 transition-transform duration-200" />
                </button>
                <button
                  onClick={() => handleNavigateDay('next')}
                  className="p-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white transition-all duration-300 group rounded-lg"
                >
                  <ChevronRight className="w-5 h-5 transform group-hover:scale-110 transition-transform duration-200" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Revolutionary day content with holographic time slots */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Enhanced events summary with 3D effects */}
          {dayEvents.length > 0 && (
            <div className="mb-6 bg-white/20 backdrop-blur-3xl rounded-[1.5rem] p-6 border border-white/30 shadow-[0_15px_35px_rgba(0,0,0,0.1)] animate-slide-up relative overflow-hidden">
              {/* Holographic background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 opacity-50"></div>
              
              <h2 className="text-2xl font-black text-gray-800 mb-4 flex items-center gap-3 relative z-10">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-xl">
                  <span className="text-white text-base">📅</span>
                </div>
                Today's Events
                <div className="flex-1 h-px bg-gradient-to-r from-blue-500 to-purple-600 opacity-30"></div>
              </h2>
              
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 relative z-10">
                {dayEvents.map((event, idx) => (
                  <div 
                    key={idx} 
                    className="group p-4 bg-gradient-to-br from-white/80 to-blue-50/80 rounded-xl border border-blue-200/30 hover:shadow-xl transform hover:scale-105 transition-all duration-500 backdrop-blur-lg relative overflow-hidden"
                    style={{ animationDelay: `${idx * 150}ms` }}
                  >
                    {/* Floating background effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 to-purple-100/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className="flex items-center space-x-3 relative z-10">
                      <div className="w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse shadow-md"></div>
                      <div className="flex-1">
                        <div className="font-bold text-gray-800 group-hover:text-blue-700 transition-colors duration-200 text-base">{event.title}</div>
                        <div className="text-sm text-gray-600 mt-1 font-semibold">{event.time} • {event.category}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ultra-futuristic time slots grid */}
          <div className="grid gap-4 lg:gap-6">
            {Array.from({ length: 24 }, (_, hour) => (
              <div 
                key={hour} 
                className="group flex flex-col sm:flex-row items-start space-y-3 sm:space-y-0 sm:space-x-6 animate-slide-up"
                style={{ animationDelay: `${hour * 50}ms` }}
              >
                {/* Holographic time display */}
                <div className="w-full sm:w-28 text-center sm:text-right">
                  <div className="inline-flex items-center justify-center w-24 h-12 bg-gradient-to-br from-white/60 to-gray-100/60 rounded-xl group-hover:from-blue-100/60 group-hover:to-purple-100/60 transition-all duration-500 backdrop-blur-lg border border-white/40 shadow-md group-hover:shadow-xl transform group-hover:scale-105">
                    <span className="text-lg font-black text-gray-700 group-hover:text-blue-700 transition-colors duration-300">
                      {hour === 0 ? '12 AM' : hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
                    </span>
                  </div>
                </div>
                
                {/* Revolutionary time slot with advanced interactivity */}
                <div className="flex-1 min-h-[80px] bg-white/40 backdrop-blur-xl rounded-2xl border border-white/50 p-6 group-hover:bg-gradient-to-r group-hover:from-blue-50/60 group-hover:to-purple-50/60 transition-all duration-500 shadow-md hover:shadow-xl transform hover:scale-[1.01] cursor-pointer relative overflow-hidden">
                  {/* Holographic pattern overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  
                  {/* Content area with enhanced styling */}
                  <div className="relative z-10">
                    {/* Enhanced event display */}
                    {dayEvents
                      .filter(event => {
                        const eventHour = parseInt(event.time?.split(':')[0] || '0');
                        return eventHour === hour;
                      })
                      .map((event, idx) => (
                        <div key={idx} className="mb-3 p-4 bg-gradient-to-r from-blue-100/80 to-purple-100/80 rounded-xl border-l-4 border-blue-500 shadow-lg transform hover:scale-105 transition-all duration-300 backdrop-blur-sm">
                          <div className="font-black text-blue-800 text-lg">{event.title}</div>
                          <div className="text-sm text-blue-600 opacity-75 mt-1 font-semibold">{event.time} • {event.category}</div>
                        </div>
                      ))}
                    
                    {/* Enhanced empty state */}
                    {!dayEvents.some(event => parseInt(event.time?.split(':')[0] || '0') === hour) && (
                      <div className="flex items-center justify-center h-full min-h-[48px]">
                        <div className="text-gray-400 text-center group-hover:text-gray-600 transition-colors duration-300">
                          <div className="text-3xl mb-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-110">➕</div>
                          <div className="text-base font-semibold">No events • Click to add</div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Floating interaction indicators */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse shadow-md"></div>
                  </div>
                  <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse shadow-md"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ultra-modern floating action button */}
      <div className="fixed right-6 bottom-6 z-40">
        <button className="group relative w-16 h-16 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 rounded-2xl flex items-center justify-center shadow-[0_15px_35px_rgba(59,130,246,0.4)] transform transition-all duration-500 hover:scale-125 hover:rotate-90 hover:shadow-[0_20px_45px_rgba(59,130,246,0.6)] focus:outline-none focus:ring-4 focus:ring-blue-300/50 animate-float overflow-hidden">
          {/* Holographic overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          
          <span className="text-white text-2xl group-hover:scale-110 transition-transform duration-200 relative z-10">➕</span>
          
          {/* Orbiting particles */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-white/60 rounded-full animate-orbit"
                style={{
                  animationDelay: `${i * 200}ms`,
                  animationDuration: '3s'
                }}
              />
            ))}
          </div>
        </button>
      </div>
    </div>
  );
}