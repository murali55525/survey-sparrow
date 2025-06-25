import React from 'react';
import { formatTime } from '../../utils/dateUtils';
import { ChevronLeft, ChevronRight, Calendar, Clock, X } from 'lucide-react';

// Add this utility function at the top of the file (or import from dateUtils if you prefer)
function formatDate(date) {
  const d = (date instanceof Date) ? date : new Date(date);
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

export default function DayView({
  dayViewDate,
  setDayViewDate,
  viewMode,
  setViewMode,
  events = {},
  setEvents, // <-- must be passed from CalendarApp
  today,
  tasks = {},
  setTasks,
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

  // State for editing event
  const [editIdx, setEditIdx] = React.useState(null);
  const [editTime, setEditTime] = React.useState('');
  const [editTitle, setEditTitle] = React.useState('');
  const [editModalOpen, setEditModalOpen] = React.useState(false);

  // Get date key for the day
  const dateKey = currentDate.toISOString().split('T')[0];
  const dayEvents = events[dateKey] || [];

  // --- Helper: get all events for a specific hour ---
  const getEventsAtHour = (hour) => {
    const dateEvents = events[dateKey] || [];
    // Show all events for this date whose time is in this hour (e.g., 12:09 in 12:00 slot)
    return dateEvents.filter(event => {
      if (!event.time) return false;
      const [h] = event.time.split(':');
      return parseInt(h, 10) === hour;
    });
  };

  // --- Edit event handler ---
  const handleEditEvent = (event, idx) => {
    setEditIdx(idx);
    setEditTitle(event.title);
    setEditTime(event.time);
    setEditModalOpen(true);
  };

  // --- Save edited event ---
  const handleSaveEditEvent = () => {
    if (!editTitle || !editTime || editIdx == null) {
      setEditModalOpen(false);
      return;
    }
    if (typeof setEvents !== 'function') {
      setEditModalOpen(false);
      return;
    }
    setEvents(prev => {
      // Update event in dateKey array
      const updatedDayEvents = (prev[dateKey] || []).map((event, i) =>
        i === editIdx ? { ...event, title: editTitle, time: editTime } : event
      );
      // Remove old event from all time slots
      let newPrev = { ...prev };
      for (let h = 0; h < 24; h++) {
        const slotKey = `${dateKey}T${String(h).padStart(2, '0')}:00`;
        if (newPrev[slotKey]) {
          newPrev[slotKey] = newPrev[slotKey].filter(
            (event, i) => !(i === editIdx && event.time)
          );
        }
      }
      // Add updated event to new time slot
      const newTimeKey = `${dateKey}T${editTime}`;
      newPrev[newTimeKey] = [...(newPrev[newTimeKey] || []), { ...prev[dateKey][editIdx], title: editTitle, time: editTime }];
      // Update dateKey array
      newPrev[dateKey] = updatedDayEvents;
      return newPrev;
    });
    setEditModalOpen(false);
    setEditIdx(null);
    setEditTitle('');
    setEditTime('');
  };

  // --- Delete event handler ---
  const handleDeleteEvent = (idx, timeStr) => {
    if (typeof setEvents !== 'function') return;
    setEvents(prev => {
      let newPrev = { ...prev };
      // Remove from dateKey
      newPrev[dateKey] = (newPrev[dateKey] || []).filter((_, i) => i !== idx);
      // Remove from all time slots for this date
      for (let h = 0; h < 24; h++) {
        const slotKey = `${dateKey}T${String(h).padStart(2, '0')}:00`;
        if (newPrev[slotKey]) {
          newPrev[slotKey] = newPrev[slotKey].filter(
            (event, i) => !(i === idx && event.time)
          );
        }
      }
      return newPrev;
    });
  };

  // Fix: Use a state for current time and update every minute
  const [currentTime, setCurrentTime] = React.useState(new Date());
  React.useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000 * 30);
    return () => clearInterval(interval);
  }, []);

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

  // Add this fallback if onGoToToday is not passed
  const handleGoToToday = onGoToToday || (() => {});

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
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto px-1 sm:px-2 pb-2 relative z-10">
        <div className="max-w-full sm:max-w-2xl md:max-w-4xl lg:max-w-7xl mx-auto px-0 sm:px-2"> {/* Responsive max-w and px */}
          {/* Time slots grid */}
          <div className="grid gap-1 sm:gap-2">
            {Array.from({ length: 24 }, (_, hour) => {
              const timeStr = `${String(hour).padStart(2, '0')}:00`;
              const eventsAtThisTime = getEventsAtHour(hour);
              const isCurrentTimeHour =
                dateKey === currentTime.toISOString().split('T')[0] &&
                hour === currentTime.getHours();

              return (
                <div 
                  key={hour} 
                  className="group flex flex-row items-start space-x-1 sm:space-x-2 animate-slide-up"
                  style={{ animationDelay: `${hour * 30}ms` }}
                >
                  {/* Time display - responsive width */}
                  <div className="w-14 sm:w-24 md:w-32 lg:w-40 text-right flex-shrink-0">
                    <div className="inline-flex items-center justify-center w-12 sm:w-20 md:w-28 lg:w-36 h-8 md:h-10 bg-gradient-to-br from-white/60 to-gray-100/60 rounded-lg border border-white/40 shadow-md">
                      <span className="text-xs sm:text-sm md:text-base font-bold text-gray-700">
                        {hour === 0 ? '12 AM' : hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
                      </span>
                    </div>
                  </div>
                  
                  {/* Time slot */}
                  <div
                    className="flex-1 min-h-[40px] sm:min-h-[48px] md:min-h-[64px] bg-white/40 backdrop-blur-xl rounded-lg border border-white/50 p-2 md:p-4 group-hover:bg-gradient-to-r group-hover:from-blue-50/60 group-hover:to-purple-50/60 transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-[1.01] cursor-pointer relative overflow-hidden"
                    style={{ zIndex: 2 }}
                  >
                    {/* Holographic pattern overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    
                    {/* Content area with enhanced styling */}
                    <div className="relative z-10">
                      {eventsAtThisTime.map((event, idx) => (
                        <div key={idx} className="mb-3 p-4 bg-gradient-to-r from-blue-100/80 to-purple-100/80 rounded-xl border-l-4 border-blue-500 shadow-lg transform hover:scale-105 transition-all duration-300 backdrop-blur-sm flex justify-between items-center">
                          <div>
                            <div className="font-black text-blue-800 text-lg">{event.title}</div>
                            <div className="text-sm text-blue-600 opacity-75 mt-1 font-semibold">{event.time} • {event.category}</div>
                          </div>
                          <div className="flex gap-2 ml-2">
                            <button
                              className="text-blue-500 hover:text-blue-700"
                              onClick={() => handleEditEvent(event, dayEvents.findIndex(e => e === event))}
                              title="Edit"
                            >✏️</button>
                            <button
                              className="text-red-500 hover:text-red-700"
                              onClick={() => handleDeleteEvent(dayEvents.findIndex(e => e === event), event.time)}
                              title="Delete"
                            ><X className="w-4 h-4" /></button>
                          </div>
                        </div>
                      ))}
                      {!eventsAtThisTime.length && (
                        <div className="flex items-center justify-center h-full min-h-[48px]">
                          <div className="text-gray-400 text-center group-hover:text-gray-600 transition-colors duration-300">
                            <div className="text-base font-semibold">No events</div>
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
              );
            })}
          </div>
        </div>
      </div>
      {/* Edit Event Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-xs p-6 border border-gray-200 relative flex flex-col items-center">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
              onClick={() => setEditModalOpen(false)}
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="text-lg font-bold mb-4 text-gray-800 text-center">Edit Event</h2>
            <div className="mb-3 w-full">
              <label className="block text-xs font-semibold text-gray-600 mb-1">Event Name</label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded px-2 py-1"
                value={editTitle}
                onChange={e => setEditTitle(e.target.value)}
                placeholder="Event name"
                autoFocus
              />
            </div>
            <div className="mb-4 w-full">
              <label className="block text-xs font-semibold text-gray-600 mb-1">Time</label>
              <input
                type="time"
                className="w-full border border-gray-200 rounded px-2 py-1"
                value={editTime}
                onChange={e => setEditTime(e.target.value)}
                step="900"
              />
            </div>
            <button
              className="w-full py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded font-bold shadow hover:shadow-lg"
              onClick={handleSaveEditEvent}
              disabled={!editTitle || !editTime}
            >
              Update Event
            </button>
          </div>
        </div>
      )}
    </div>
  );
}