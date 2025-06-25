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
  setEvents,
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

  // --- Fix: Track which event is being edited by unique key ---
  const [editIdx, setEditIdx] = React.useState(null);
  const [editTime, setEditTime] = React.useState('');
  const [editTitle, setEditTitle] = React.useState('');
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [editEventObj, setEditEventObj] = React.useState(null);

  // Get date key for the day
  const dateKey = currentDate.toISOString().split('T')[0];
  // Merge events from dateKey and all timeKeys for this date
  const allEvents = [
    ...(events[dateKey] || []),
    ...Object.entries(events)
      .filter(([k]) => k.startsWith(dateKey + 'T'))
      .flatMap(([, arr]) => arr)
  ];
  // Remove duplicates (by title+time)
  const uniqueEvents = allEvents.filter(
    (e, i, arr) =>
      arr.findIndex(ev => ev.title === e.title && ev.time === e.time) === i
  );

  // --- Helper: get all events for a specific hour ---
  const getEventsAtHour = (hour) => {
    return uniqueEvents.filter(event => {
      if (!event.time) return false;
      const [h] = event.time.split(':');
      return parseInt(h, 10) === hour;
    });
  };

  // --- Edit event handler (from full list or hour slot) ---
  const handleEditEvent = (event, idx) => {
    setEditIdx(idx);
    setEditTitle(event.title);
    setEditTime(event.time);
    setEditEventObj(event);
    setEditModalOpen(true);
  };

  // --- Cancel edit handler ---
  const handleCancelEdit = () => {
    setEditModalOpen(false);
    setEditIdx(null);
    setEditTitle('');
    setEditTime('');
    setEditEventObj(null);
  };

  // --- Save edited event ---
  const handleSaveEditEvent = () => {
    if (!editTitle || !editTime || editIdx == null || !editEventObj) {
      setEditModalOpen(false);
      setEditIdx(null);
      setEditTitle('');
      setEditTime('');
      setEditEventObj(null);
      return;
    }
    if (typeof setEvents !== 'function') {
      setEditModalOpen(false);
      setEditIdx(null);
      setEditTitle('');
      setEditTime('');
      setEditEventObj(null);
      return;
    }
    setEvents(prev => {
      // Find the event in dateKey array by matching title+time
      const updatedDayEvents = (prev[dateKey] || []).map((event, i) =>
        i === editIdx ? { ...event, title: editTitle, time: editTime } : event
      );
      // Remove old event from all time slots
      let newPrev = { ...prev };
      Object.keys(prev).forEach(key => {
        if (key.startsWith(dateKey + 'T')) {
          newPrev[key] = (newPrev[key] || []).filter(
            (event) => !(event.title === editEventObj.title && event.time === editEventObj.time)
          );
        }
      });
      // Add updated event to new time slot
      const newTimeKey = `${dateKey}T${editTime}`;
      newPrev[newTimeKey] = [...(newPrev[newTimeKey] || []), { ...editEventObj, title: editTitle, time: editTime }];
      // Update dateKey array
      newPrev[dateKey] = updatedDayEvents;
      return newPrev;
    });
    setEditModalOpen(false);
    setEditIdx(null);
    setEditTitle('');
    setEditTime('');
    setEditEventObj(null);
  };

  // --- Delete event handler (from full list or hour slot) ---
  const handleDeleteEvent = (idx, timeStr) => {
    if (typeof setEvents !== 'function') return;
    setEvents(prev => {
      let newPrev = { ...prev };
      // Remove from dateKey
      newPrev[dateKey] = (newPrev[dateKey] || []).filter((_, i) => i !== idx);
      // Remove from all time slots for this date
      Object.keys(prev).forEach(key => {
        if (key.startsWith(dateKey + 'T')) {
          newPrev[key] = (newPrev[key] || []).filter(
            (event, i) => !(i === idx && event.time)
          );
        }
      });
      // Remove from specific timeKey if possible
      if (timeStr) {
        const timeKey = `${dateKey}T${timeStr}`;
        if (newPrev[timeKey]) {
          newPrev[timeKey] = newPrev[timeKey].filter(
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

  // Enhanced state for UI enhancements
  const [hoveredHour, setHoveredHour] = React.useState(null);
  const [selectedEvents, setSelectedEvents] = React.useState([]);
  const [showEventDetails, setShowEventDetails] = React.useState(false);
  const [animatedEvents, setAnimatedEvents] = React.useState(new Set());
  const [weatherData, setWeatherData] = React.useState({ temp: 24, condition: 'sunny' });

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

  // Enhanced color schemes for different times of day
  const getEnhancedTimeScheme = (hour) => {
    if (hour >= 5 && hour < 8) return {
      gradient: 'from-orange-100/80 via-amber-100/80 to-yellow-100/80',
      border: 'border-orange-200/60',
      text: 'text-orange-700',
      accent: 'bg-gradient-to-r from-orange-400 to-amber-500',
      icon: '🌅'
    };
    if (hour >= 8 && hour < 12) return {
      gradient: 'from-sky-100/80 via-blue-100/80 to-cyan-100/80',
      border: 'border-sky-200/60',
      text: 'text-sky-700',
      accent: 'bg-gradient-to-r from-sky-400 to-cyan-500',
      icon: '☀️'
    };
    if (hour >= 12 && hour < 17) return {
      gradient: 'from-emerald-100/80 via-green-100/80 to-teal-100/80',
      border: 'border-emerald-200/60',
      text: 'text-emerald-700',
      accent: 'bg-gradient-to-r from-emerald-400 to-teal-500',
      icon: '🌤️'
    };
    if (hour >= 17 && hour < 20) return {
      gradient: 'from-purple-100/80 via-violet-100/80 to-indigo-100/80',
      border: 'border-purple-200/60',
      text: 'text-purple-700',
      accent: 'bg-gradient-to-r from-purple-400 to-indigo-500',
      icon: '🌆'
    };
    return {
      gradient: 'from-slate-100/80 via-gray-100/80 to-zinc-100/80',
      border: 'border-slate-200/60',
      text: 'text-slate-700',
      accent: 'bg-gradient-to-r from-slate-400 to-zinc-500',
      icon: '🌙'
    };
  };

  // Add this fallback if onGoToToday is not passed
  const handleGoToToday = onGoToToday || (() => {});

  // Enhanced event click handler
  const handleEventClick = (event, idx) => {
    setSelectedEvents([{ ...event, idx }]);
    setShowEventDetails(true);
    setAnimatedEvents(prev => new Set([...prev, `${event.title}-${idx}`]));
  };

  // Weather component
  const WeatherWidget = () => (
    <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-xl rounded-2xl p-3 shadow-lg border border-white/30">
      <div className="flex items-center gap-2">
        <span className="text-2xl animate-pulse">
          {weatherData.condition === 'sunny' ? '☀️' : weatherData.condition === 'cloudy' ? '☁️' : '🌧️'}
        </span>
        <div className="text-white">
          <div className="text-lg font-bold">{weatherData.temp}°</div>
          <div className="text-xs opacity-80 capitalize">{weatherData.condition}</div>
        </div>
      </div>
    </div>
  );

  // Enhanced progress bar for day completion
  const DayProgressBar = () => {
    const currentHour = currentTime.getHours();
    const progress = (currentHour / 24) * 100;
    
    return (
      <div className="w-full bg-white/20 rounded-full h-1 sm:h-2 mb-2 sm:mb-4 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full transition-all duration-1000 ease-out relative"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute right-0 top-0 w-1 h-1 sm:w-2 sm:h-2 bg-white rounded-full shadow-lg animate-pulse"></div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Compact Cosmic Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.03%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] animate-pulse"></div>
        <div className="absolute top-5 right-5 w-32 h-32 md:w-48 md:h-48 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 left-5 w-24 h-24 md:w-40 md:h-40 bg-gradient-to-br from-pink-400/10 to-indigo-400/10 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
        
        {/* Minimal floating particles */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-0.5 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Compact Header */}
      <div className="sticky top-0 z-30 px-1 sm:px-2 pt-1 sm:pt-2 pb-1">
        <div className="bg-white/10 backdrop-blur-3xl rounded-lg sm:rounded-xl p-2 sm:p-3 shadow-lg border border-white/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-gradient-x"></div>
          
          {/* Minimal Day Progress Bar */}
          <div className="w-full bg-white/20 rounded-full h-0.5 sm:h-1 mb-1 sm:mb-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full transition-all duration-1000 ease-out relative"
              style={{ width: `${(currentTime.getHours() / 24) * 100}%` }}
            >
              <div className="absolute right-0 top-0 w-0.5 h-0.5 sm:w-1 sm:h-1 bg-white rounded-full shadow-lg animate-pulse"></div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between relative z-10 gap-1 sm:gap-3">
            <div className="flex-1 min-w-0">
              <div className="relative group">
                <h1 className="text-sm sm:text-lg md:text-xl lg:text-2xl font-black bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent drop-shadow-2xl leading-tight">
                  {formatDate(currentDate)}
                </h1>
                <div className="mt-0.5 sm:mt-1 text-xs sm:text-sm md:text-base font-bold text-white/90 flex items-center gap-1 sm:gap-2">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse shadow-lg"></div>
                  <span className="font-mono tracking-wider text-xs sm:text-sm">
                    {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <div className="text-xs opacity-70">
                    {currentTime.getSeconds() % 2 === 0 ? '✨' : '💫'}
                  </div>
                </div>
                
                {/* Minimal decorative elements */}
                <div className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-bounce shadow-xl"></div>
                <div className="absolute -bottom-0.5 -left-0.5 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-green-400 to-teal-500 rounded-full animate-pulse shadow-lg"></div>
              </div>
            </div>
            
            <div className="flex items-center gap-1 sm:gap-2 md:gap-3 w-full sm:w-auto justify-end">
              {/* Minimal Weather Widget */}
              <div className="bg-white/20 backdrop-blur-xl rounded-md p-1 sm:p-1.5 shadow-lg border border-white/30">
                <div className="flex items-center gap-1">
                  <span className="text-sm sm:text-lg animate-pulse">☀️</span>
                  <div className="text-white text-xs">
                    <div className="font-bold">{weatherData.temp}°</div>
                  </div>
                </div>
              </div>
              
              <button
                className="group relative px-2 py-1 sm:px-3 sm:py-2 md:px-4 md:py-2 rounded-md sm:rounded-lg bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white font-bold shadow-xl transform transition-all duration-300 hover:scale-105 overflow-hidden text-xs sm:text-sm"
                onClick={handleGoToToday}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 flex items-center gap-1">
                  <span className="text-xs sm:text-sm animate-bounce">✨</span>
                  <span className="font-black tracking-wide">TODAY</span>
                </span>
              </button>
              
              <div className="flex bg-white/10 backdrop-blur-xl rounded-md sm:rounded-lg shadow-lg overflow-hidden p-0.5 border border-white/20">
                <button
                  onClick={() => setDayViewDate(new Date(currentDate.getTime() - 86400000))}
                  className="p-1 sm:p-2 text-white/80 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white transition-all duration-300 group rounded-md"
                >
                  <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 transform group-hover:scale-110 transition-transform duration-200" />
                </button>
                <button
                  onClick={() => setDayViewDate(new Date(currentDate.getTime() + 86400000))}
                  className="p-1 sm:p-2 text-white/80 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white transition-all duration-300 group rounded-md"
                >
                  <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 transform group-hover:scale-110 transition-transform duration-200" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Compact Full Day Events List */}
      <div className="max-w-full mx-auto px-1 sm:px-2 mt-1 sm:mt-2">
        <div className="bg-white/10 backdrop-blur-3xl rounded-lg sm:rounded-xl shadow-lg border border-white/20 mb-2 sm:mb-4 p-2 sm:p-3 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5"></div>
          
          <div className="relative z-10">
            <h2 className="text-sm sm:text-base md:text-lg font-black text-white mb-2 sm:mb-3 flex items-center gap-1 sm:gap-2">
              <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                <Calendar className="w-2 h-2 sm:w-3 sm:h-3 text-white" />
              </div>
              <span className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                Today's Schedule
              </span>
              <div className="ml-auto bg-white/20 rounded-full px-1 py-0.5 text-xs font-bold">
                {uniqueEvents.length}
              </div>
            </h2>
            
            {uniqueEvents.length === 0 ? (
              <div className="text-center py-3 sm:py-6">
                <div className="text-2xl sm:text-4xl mb-1 sm:mb-2 animate-bounce">🌟</div>
                <div className="text-white/70 text-xs sm:text-sm italic">Your day is free for new adventures!</div>
              </div>
            ) : (
              <div className="grid gap-1 sm:gap-2 max-h-32 sm:max-h-48 overflow-y-auto">
                {uniqueEvents.map((event, idx) => (
                  <div
                    key={event.title + event.time + idx}
                    className={`group relative bg-white/10 backdrop-blur-2xl rounded-md sm:rounded-lg p-2 sm:p-3 border border-white/20 shadow-lg transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl cursor-pointer ${
                      animatedEvents.has(`${event.title}-${idx}`) ? 'animate-pulse' : ''
                    }`}
                    onClick={() => handleEventClick(event, idx)
                    }
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-md sm:rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1 sm:gap-2 mb-0.5 sm:mb-1">
                          <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${event.color ? `bg-${event.color}-400` : 'bg-blue-400'} shadow-lg animate-pulse`}></div>
                          <h3 className="text-xs sm:text-sm md:text-base font-bold text-white truncate">{event.title}</h3>
                          {event.priority === 'high' && <span className="text-yellow-400 animate-bounce text-xs">⭐</span>}
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-white/80 text-xs">
                          <div className="flex items-center gap-1">
                            <Clock className="w-2 h-2 sm:w-3 sm:h-3" />
                            <span className="font-mono">
                              {event.time ? event.time : 'All Day'}
                              {event.endTime && ` - ${event.endTime}`}
                            </span>
                          </div>
                          
                          {event.category && (
                            <div className="flex items-center gap-1">
                              <span className="text-purple-300">📂</span>
                              <span className="capitalize truncate">{event.category}</span>
                            </div>
                          )}
                        </div>
                        
                        {event.description && (
                          <div className="mt-1 sm:mt-2 text-white/70 text-xs bg-white/5 rounded-md p-1 sm:p-2 border border-white/10 line-clamp-1">
                            {event.description}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-0.5 sm:gap-1 ml-1 sm:ml-2">
                        <button
                          className="p-1 sm:p-1.5 bg-blue-500/20 hover:bg-blue-500/40 rounded-md transition-all duration-300 hover:scale-110 border border-blue-400/30"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditEvent(event, idx);
                          }}
                          title="Edit Event"
                        >
                          <span className="text-xs sm:text-sm">✏️</span>
                        </button>
                        <button
                          className="p-1 sm:p-1.5 bg-red-500/20 hover:bg-red-500/40 rounded-md transition-all duration-300 hover:scale-110 border border-red-400/30"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteEvent(idx, event.time);
                          }}
                          title="Delete Event"
                        >
                          <X className="w-2 h-2 sm:w-3 sm:h-3 text-red-300" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Compact Hourly Timeline */}
      <div className="flex-1 overflow-y-auto px-1 sm:px-2 pb-2 sm:pb-4 relative z-10">
        <div className="max-w-full mx-auto">
          <div className="space-y-0.5 sm:space-y-1">
            {Array.from({ length: 24 }, (_, hour) => {
              const timeScheme = getEnhancedTimeScheme(hour);
              const eventsAtThisTime = getEventsAtHour(hour);
              const isCurrentTimeHour = dateKey === currentTime.toISOString().split('T')[0] && hour === currentTime.getHours();
              const isHovered = hoveredHour === hour;

              return (
                <div 
                  key={hour} 
                  className={`group flex items-start space-x-1 sm:space-x-2 transition-all duration-500 transform hover:scale-[1.01] ${
                    isCurrentTimeHour ? 'ring-1 ring-yellow-400/50 bg-yellow-400/10 rounded-md p-0.5 sm:p-1' : ''
                  }`}
                  style={{ animationDelay: `${hour * 10}ms` }}
                  onMouseEnter={() => setHoveredHour(hour)}
                  onMouseLeave={() => setHoveredHour(null)}
                >
                  {/* Compact Time Display */}
                  <div className="w-12 sm:w-16 md:w-20 flex-shrink-0 text-right">
                    <div className={`inline-flex items-center justify-center px-1 py-0.5 sm:px-2 sm:py-1 rounded-md backdrop-blur-xl border shadow-lg transition-all duration-300 ${
                      isCurrentTimeHour 
                        ? 'bg-yellow-400/20 border-yellow-400/50 text-yellow-100 shadow-yellow-400/25' 
                        : `bg-white/10 ${timeScheme.border} text-white/90`
                    } ${isHovered ? 'scale-105 shadow-2xl' : ''}`}>
                      <div className="text-center">
                        <div className="text-xs sm:text-sm font-black">
                          {hour === 0 ? '12' : hour === 12 ? '12' : hour > 12 ? hour - 12 : hour}
                        </div>
                        <div className="text-[8px] sm:text-xs opacity-80 font-bold">
                          {hour >= 12 ? 'PM' : 'AM'}
                        </div>
                      </div>
                      <div className="ml-0.5 sm:ml-1 text-xs sm:text-base">
                        {timeScheme.icon}
                      </div>
                    </div>
                  </div>
                  
                  {/* Compact Time Slot */}
                  <div className={`flex-1 min-h-[40px] sm:min-h-[60px] bg-gradient-to-r ${timeScheme.gradient} backdrop-blur-xl rounded-md border ${timeScheme.border} p-1 sm:p-2 transition-all duration-300 shadow-lg hover:shadow-2xl cursor-pointer relative overflow-hidden group-hover:scale-[1.01]`}>
                    
                    {/* Hover glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md"></div>
                    
                    {/* Content */}
                    <div className="relative z-10">
                      {eventsAtThisTime.length > 0 ? (
                        <div className="space-y-1">
                          {eventsAtThisTime.map((event, idx) => (
                            <div 
                              key={idx} 
                              className="bg-white/20 backdrop-blur-xl rounded-md p-1 sm:p-2 border border-white/30 shadow-lg transform hover:scale-105 transition-all duration-300 cursor-pointer group/event"
                              onClick={() => handleEventClick(event, idx)}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1 sm:gap-2 mb-0.5 sm:mb-1">
                                    <div className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full ${event.color ? `bg-${event.color}-400` : 'bg-blue-400'} shadow-lg animate-pulse`}></div>
                                    <h4 className="font-black text-gray-800 text-xs sm:text-sm truncate">{event.title}</h4>
                                    {event.priority === 'high' && <span className="text-yellow-500 animate-bounce text-xs">⭐</span>}
                                  </div>
                                  
                                  <div className="flex flex-wrap items-center gap-1 text-xs text-gray-600">
                                    <span className="font-mono bg-white/50 px-1 py-0.5 rounded text-[10px] sm:text-xs">
                                      {event.time}
                                      {event.endTime && ` - ${event.endTime}`}
                                    </span>
                                    {event.category && (
                                      <span className="bg-purple-100 text-purple-700 px-1 py-0.5 rounded capitalize font-medium text-[10px] sm:text-xs">
                                        {event.category}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                
                                <div className="flex gap-0.5 sm:gap-1 opacity-0 group-hover/event:opacity-100 transition-opacity duration-300">
                                  <button
                                    className="p-0.5 sm:p-1 bg-blue-500/20 hover:bg-blue-500 rounded text-xs transition-all duration-300 hover:scale-110"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleEditEvent(event, uniqueEvents.findIndex(e => e.title === event.title && e.time === event.time));
                                    }}
                                    title="Edit"
                                  >
                                    <span className="text-blue-600 hover:text-white">✏️</span>
                                  </button>
                                  <button
                                    className="p-0.5 sm:p-1 bg-red-500/20 hover:bg-red-500 rounded transition-all duration-300 hover:scale-110"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteEvent(uniqueEvents.findIndex(e => e.title === event.title && e.time === event.time), event.time);
                                    }}
                                    title="Delete"
                                  >
                                    <X className="w-2 h-2 sm:w-3 sm:h-3 text-red-600 hover:text-white" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full text-center">
                          <div className={`${timeScheme.text} opacity-60 group-hover:opacity-100 transition-opacity duration-300`}>
                            <div className="text-sm sm:text-lg mb-0.5 sm:mb-1 group-hover:animate-bounce">{timeScheme.icon}</div>
                            <div className="text-[10px] sm:text-xs font-bold">Free time</div>
                            <div className="text-[8px] sm:text-[10px] opacity-70">Perfect for new plans</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Compact Edit Event Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-lg">
          <div className="bg-white/10 backdrop-blur-3xl rounded-2xl shadow-2xl w-full max-w-sm border border-white/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10"></div>
            
            <div className="relative z-10 p-4 sm:p-6">
              <button
                className="absolute top-2 right-2 text-white/70 hover:text-white text-xl transition-colors duration-300"
                onClick={handleCancelEdit}
                aria-label="Close"
              >
                ×
              </button>
              
              <h2 className="text-lg sm:text-xl font-black text-white mb-4 text-center bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                ✨ Edit Event
              </h2>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-white/90 mb-1">Event Name</label>
                  <input
                    type="text"
                    className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 text-sm"
                    value={editTitle}
                    onChange={e => setEditTitle(e.target.value)}
                    placeholder="Enter event name..."
                    autoFocus
                  />
                </div>
                
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-white/90 mb-1">Time</label>
                  <input
                    type="time"
                    className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 text-sm"
                    value={editTime}
                    onChange={e => setEditTime(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex gap-2 mt-6">
                <button
                  className="flex-1 py-2 bg-white/10 backdrop-blur-xl text-white/90 rounded-lg font-bold transition-all duration-300 hover:bg-white/20 border border-white/20 text-sm"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-bold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  onClick={handleSaveEditEvent}
                  disabled={!editTitle || !editTime}
                >
                  ✨ Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Compact Event Details Modal */}
      {showEventDetails && selectedEvents.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-lg p-2">
          <div className="bg-white/10 backdrop-blur-3xl rounded-2xl shadow-2xl w-full max-w-md border border-white/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10"></div>
            
            <div className="relative z-10">
              <div className="p-4 border-b border-white/20">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-black text-white bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                    📅 Event Details
                  </h2>
                  <button
                    onClick={() => setShowEventDetails(false)}
                    className="text-white/70 hover:text-white transition-colors duration-300"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="p-4 space-y-3">
                {selectedEvents.map((event, idx) => (
                  <div key={idx} className="bg-white/10 backdrop-blur-xl rounded-xl p-3 border border-white/20">
                    <h3 className="text-base font-bold text-white mb-2">{event.title}</h3>
                    
                    <div className="space-y-1 text-white/80 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        <span>{event.time || 'All Day'}</span>
                      </div>
                      
                      {event.location && (
                        <div className="flex items-center gap-2">
                          <span>📍</span>
                          <span>{event.location}</span>
                        </div>
                      )}
                      
                      {event.category && (
                        <div className="flex items-center gap-2">
                          <span>📂</span>
                          <span className="capitalize">{event.category}</span>
                        </div>
                      )}
                      
                      {event.description && (
                        <div className="bg-white/5 rounded-lg p-2 mt-2">
                          <p className="text-xs">{event.description}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}