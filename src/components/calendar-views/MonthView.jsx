import React, { useState, useEffect } from 'react';
import { Calendar, Plus, X, Clock, MapPin, User, Star, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { addEvent, updateEvent, deleteEvent } from '../../utils/eventStorage';

// Utility functions (mock implementations)
const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfWeek = (year, month) => new Date(year, month, 1).getDay();
const getDateStr = (year, month, day) => `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

export default function MonthView({ 
  viewMode, 
  setViewMode, 
  onGoToToday,
  setViewMonth,
  setViewYear,
  events,
  setEvents,
  tasks,
  setTasks,
  ...props 
}) {
  const [today] = useState(new Date());
  const [viewMonth, setViewMonthState] = useState(today.getMonth());
  const [viewYear, setViewYearState] = useState(today.getFullYear());
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventTime, setNewEventTime] = useState('');
  const [newEventCategory, setNewEventCategory] = useState('personal');
  const [hoveredDay, setHoveredDay] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editEvent, setEditEvent] = useState(null);
  const [editEventDate, setEditEventDate] = useState('');
  const [editEventIdx, setEditEventIdx] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Enhanced colorful styling
  const dayColors = {
    today: 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-xl ring-4 ring-blue-200 transform scale-105',
    weekend: 'bg-gradient-to-br from-rose-50 to-pink-50 text-rose-600 hover:from-rose-100 hover:to-pink-100',
    weekday: 'bg-white hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 transition-all duration-200',
    otherMonth: 'bg-gray-50/60 text-gray-400',
    hasEvents: 'ring-2 ring-blue-400/30',
  };

  const categoryColors = {
    work: 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-l-4 border-blue-500 shadow-sm',
    personal: 'bg-gradient-to-r from-green-100 to-emerald-200 text-green-800 border-l-4 border-green-500 shadow-sm',
    holiday: 'bg-gradient-to-r from-red-100 to-rose-200 text-red-800 border-l-4 border-red-500 shadow-sm',
    health: 'bg-gradient-to-r from-purple-100 to-violet-200 text-purple-800 border-l-4 border-purple-500 shadow-sm',
    social: 'bg-gradient-to-r from-amber-100 to-yellow-200 text-amber-800 border-l-4 border-amber-500 shadow-sm',
    travel: 'bg-gradient-to-r from-cyan-100 to-teal-200 text-cyan-800 border-l-4 border-cyan-500 shadow-sm',
  };

  const priorityIcons = {
    high: <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />,
    medium: <Clock className="w-3 h-3 text-orange-500" />,
    low: <User className="w-3 h-3 text-gray-500" />,
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfWeek(viewYear, viewMonth);

  const isCurrentDate = (day) => 
    day === today.getDate() &&
    viewMonth === today.getMonth() &&
    viewYear === today.getFullYear();

  const handleDayClick = (dateStr) => {
    setSelectedDate(dateStr);
    setIsModalOpen(true);
  };

  // --- FIX: Use eventStorage for saving events ---
  const handleAddEvent = () => {
    if (newEventTitle.trim() && selectedDate) {
      const newEvent = {
        title: newEventTitle,
        time: newEventTime,
        category: newEventCategory,
        priority: 'medium'
      };
      setEvents(prev => addEvent(prev, selectedDate, newEvent));
      setNewEventTitle('');
      setNewEventTime('');
      setIsModalOpen(false);
    }
  };

  const handleDeleteEvent = (dateStr, eventIndex) => {
    setEvents(prev => deleteEvent(prev, dateStr, eventIndex));
  };

  const handleEditEvent = (dateStr, event, idx) => {
    setEditEvent({ ...event });
    setEditEventDate(dateStr);
    setEditEventIdx(idx);
    setEditModalOpen(true);
  };

  const handleSaveEditEvent = () => {
    if (!editEvent || editEventIdx === null) return;
    setEvents(prev => updateEvent(prev, editEventDate, editEventIdx, editEvent));
    setEditModalOpen(false);
    setEditEvent(null);
    setEditEventIdx(null);
    setEditEventDate('');
  };

  const handleDeleteEditEvent = () => {
    if (!editEvent || editEventIdx === null) return;
    setEvents(prev => ({
      ...prev,
      [editEventDate]: prev[editEventDate].filter((_, i) => i !== editEventIdx)
    }));
    setEditModalOpen(false);
    setEditEvent(null);
    setEditEventIdx(null);
    setEditEventDate('');
  };

  const navigateMonth = (direction) => {
    if (direction === 'prev') {
      if (viewMonth === 0) {
        setViewMonthState(11);
        setViewYearState(viewYear - 1);
      } else {
        setViewMonthState(viewMonth - 1);
      }
    } else {
      if (viewMonth === 11) {
        setViewMonthState(0);
        setViewYearState(viewYear + 1);
      } else {
        setViewMonthState(viewMonth + 1);
      }
    }
  };

  // Enhanced Kerala and Tamil festivals data
  const festivals = {
    '2024-12-25': [{ 
      title: 'Christmas', 
      type: 'national', 
      color: 'bg-red-200',
      textColor: 'text-red-800'
    }],
    '2024-12-31': [{ 
      title: 'New Year\'s Eve', 
      type: 'national', 
      color: 'bg-purple-200',
      textColor: 'text-purple-800'
    }],
    '2025-01-01': [{ 
      title: 'New Year\'s Day', 
      type: 'national', 
      color: 'bg-blue-200',
      textColor: 'text-blue-800'
    }],
    '2025-01-14': [{ 
      title: 'Makar Sankranti', 
      type: 'tamil', 
      color: 'bg-orange-200',
      textColor: 'text-orange-800'
    }],
    '2025-01-15': [{ 
      title: 'Thai Pusam', 
      type: 'tamil', 
      color: 'bg-yellow-200',
      textColor: 'text-yellow-800'
    }],
    '2025-01-26': [{ 
      title: 'Republic Day', 
      type: 'national', 
      color: 'bg-green-200',
      textColor: 'text-green-800'
    }],
    '2025-02-13': [{ 
      title: 'Maha Shivratri', 
      type: 'kerala', 
      color: 'bg-blue-200',
      textColor: 'text-blue-800'
    }],
    '2025-02-26': [{ 
      title: 'Holi', 
      type: 'national', 
      color: 'bg-pink-200',
      textColor: 'text-pink-800'
    }],
    '2025-03-30': [{ 
      title: 'Ugadi', 
      type: 'tamil', 
      color: 'bg-green-200',
      textColor: 'text-green-800'
    }],
    '2025-04-10': [{ 
      title: 'Vishu', 
      type: 'kerala', 
      color: 'bg-yellow-200',
      textColor: 'text-yellow-800'
    }],
    '2025-04-13': [{ 
      title: 'Tamil New Year', 
      type: 'tamil', 
      color: 'bg-red-200',
      textColor: 'text-red-800'
    }],
    '2025-04-14': [{ 
      title: 'Ram Navami', 
      type: 'kerala', 
      color: 'bg-orange-200',
      textColor: 'text-orange-800'
    }],
    '2025-05-12': [{ 
      title: 'Akshaya Tritiya', 
      type: 'kerala', 
      color: 'bg-yellow-200',
      textColor: 'text-yellow-800'
    }],
    '2025-06-15': [{ 
      title: 'Eid ul-Fitr', 
      type: 'national', 
      color: 'bg-green-200',
      textColor: 'text-green-800'
    }],
    '2025-07-13': [{ 
      title: 'Guru Purnima', 
      type: 'kerala', 
      color: 'bg-purple-200',
      textColor: 'text-purple-800'
    }],
    '2025-08-15': [{ 
      title: 'Independence Day', 
      type: 'national', 
      color: 'bg-green-200',
      textColor: 'text-green-800'
    }],
    '2025-08-16': [{ 
      title: 'Janmashtami', 
      type: 'kerala', 
      color: 'bg-blue-200',
      textColor: 'text-blue-800'
    }],
    '2025-08-19': [{ 
      title: 'Onam Begins', 
      type: 'kerala', 
      color: 'bg-yellow-200',
      textColor: 'text-yellow-800'
    }],
    '2025-08-30': [{ 
      title: 'Thiruvonam (Onam)', 
      type: 'kerala', 
      color: 'bg-amber-200',
      textColor: 'text-amber-800'
    }],
    '2025-09-05': [{ 
      title: 'Ganesh Chaturthi', 
      type: 'kerala', 
      color: 'bg-pink-200',
      textColor: 'text-pink-800'
    }],
    '2025-10-02': [{ 
      title: 'Gandhi Jayanti', 
      type: 'national', 
      color: 'bg-green-200',
      textColor: 'text-green-800'
    }],
    '2025-10-20': [{ 
      title: 'Navaratri Begins', 
      type: 'kerala', 
      color: 'bg-purple-200',
      textColor: 'text-purple-800'
    }],
    '2025-10-22': [{ 
      title: 'Dussehra', 
      type: 'kerala', 
      color: 'bg-red-200',
      textColor: 'text-red-800'
    }],
    '2025-11-01': [{ 
      title: 'Diwali', 
      type: 'kerala', 
      color: 'bg-yellow-200',
      textColor: 'text-yellow-800'
    }],
    '2025-11-15': [{ 
      title: 'Guru Nanak Jayanti', 
      type: 'kerala', 
      color: 'bg-cyan-200',
      textColor: 'text-cyan-800'
    }],
    '2025-11-30': [{ 
      title: 'Karthikai Deepam', 
      type: 'tamil', 
      color: 'bg-amber-200',
      textColor: 'text-amber-800'
    }],
    '2025-12-25': [{ 
      title: 'Christmas', 
      type: 'national', 
      color: 'bg-red-200',
      textColor: 'text-red-800'
    }],
  };

  const renderCalendarCells = () => {
    const cells = [];
    
    // Empty cells for days before the 1st of the month
    for (let i = 0; i < firstDay; i++) {
      cells.push(
        <div key={`empty-${i}`} className="bg-white/5 border border-white/10 min-h-[160px] rounded-lg" />
      );
    }
    
    // Day cells with enhanced styling
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = getDateStr(viewYear, viewMonth, day);
      // FIX: Define isToday for this day
      const isToday = (
        day === today.getDate() &&
        viewMonth === today.getMonth() &&
        viewYear === today.getFullYear()
      );
      const isWeekend = (new Date(viewYear, viewMonth, day)).getDay() % 6 === 0;

      const dayEvents = events[dateStr] || [];
      const dayFestivals = festivals[dateStr] || [];
      const primaryFestival = dayFestivals[0];
      const remainingFestivals = dayFestivals.slice(1);
      const allItems = [...remainingFestivals, ...dayEvents];

      cells.push(
        <div
          key={`date-${day}`}
          className={`group relative backdrop-blur-sm border border-white/20 p-3 min-h-[160px] flex flex-col justify-start items-stretch rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl cursor-pointer ${
            isToday 
              ? 'bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-blue-400/50 shadow-lg ring-2 ring-blue-400/30' 
              : 'bg-white/40 hover:bg-white/60'
          }`}
          onClick={() => handleDayClick(dateStr)}
          style={{ 
            backdropFilter: 'blur(12px)',
            animationDelay: `${(day * 20)}ms`
          }}
        >
          {/* Gradient overlay for hover effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Primary festival displayed with enhanced styling */}
          {primaryFestival && (
            <div 
              className={`relative z-10 ${primaryFestival.color} ${primaryFestival.textColor} px-3 py-1.5 rounded-lg text-xs font-semibold mb-2 border-l-4 border-current shadow-sm backdrop-blur-sm flex items-center gap-2 transform hover:scale-105 transition-transform duration-200`}
              title={`${primaryFestival.title} - ${primaryFestival.type === 'kerala' ? 'Kerala Festival' : primaryFestival.type === 'tamil' ? 'Tamil Festival' : 'National Holiday'}`}
            >
              <span className="text-sm animate-pulse">
                {primaryFestival.type === 'kerala' ? '🌴' : 
                 primaryFestival.type === 'tamil' ? '🏛️' : 
                 primaryFestival.type === 'national' ? '🇮🇳' : '🎉'}
              </span>
              <span className="break-words font-bold">{primaryFestival.title}</span>
              <Sparkles className="w-3 h-3 ml-auto opacity-60" />
            </div>
          )}
          
          {/* Day number with enhanced styling */}
          <div className="relative z-10 flex items-center justify-between mb-2">
            <span className={`relative text-lg font-bold transition-all duration-200 ${
              isToday 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-lg ring-2 ring-white/50' 
                : isWeekend 
                  ? 'text-red-500 group-hover:text-red-600' 
                  : 'text-gray-800 group-hover:text-gray-900'
            }`}>
              {day}
              {isToday && (
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-ping opacity-30"></div>
              )}
            </span>
            
            {allItems.length > 0 && (
              <span className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 rounded-full px-2 py-1 text-xs font-bold shadow-sm border border-blue-200">
                {allItems.length}
              </span>
            )}
          </div>
          
          {/* Show all events and festivals with nice UI */}
          <div className="relative z-10 flex flex-col gap-1.5 flex-1 overflow-y-auto max-h-32">
            {/* Remaining festivals */}
            {remainingFestivals.map((festival, idx) => (
              <div 
                key={`festival-${idx}`} 
                className={`${festival.color} ${festival.textColor} px-2 py-1 rounded-md text-xs font-medium border-l-3 border-current flex items-center gap-1.5 shadow-sm backdrop-blur-sm transition-transform duration-200 hover:scale-105`}
                title={`${festival.title} - ${festival.type === 'kerala' ? 'Kerala Festival' : festival.type === 'tamil' ? 'Tamil Festival' : 'National Holiday'}`}
              >
                <span className="text-xs">
                  {festival.type === 'kerala' ? '🌴' : 
                   festival.type === 'tamil' ? '🏛️' : 
                   festival.type === 'national' ? '🇮🇳' : '🎉'}
                </span>
                <span className="break-words font-semibold">{festival.title}</span>
              </div>
            ))}
            {/* All events for the day */}
            {dayEvents.map((event, idx) => (
              <div 
                key={`event-${idx}`} 
                className="bg-gradient-to-r from-blue-100/80 to-indigo-100/80 text-blue-800 px-2 py-1 rounded-md text-xs font-medium border-l-3 border-blue-500 flex items-center gap-1.5 shadow-sm backdrop-blur-sm transition-transform duration-200 hover:scale-105 cursor-pointer"
                title={event.title}
                onClick={e => {
                  e.stopPropagation();
                  handleEditEvent(dateStr, event, idx);
                }}
              >
                <Clock className="w-3 h-3 opacity-60" />
                <span className="break-words font-semibold">{event.title}</span>
                {event.time && <span className="text-blue-600 ml-auto text-xs font-bold">{event.time}</span>}
                <button
                  className="ml-2 text-xs text-red-500 hover:text-red-700"
                  onClick={e => {
                    e.stopPropagation();
                    handleDeleteEvent(dateStr, idx);
                  }}
                  title="Delete"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            {/* If too many, show a scroll indicator */}
            {allItems.length > 5 && (
              <div className="text-xs text-gray-400 text-center mt-1">Scroll for more...</div>
            )}
          </div>
        </div>
      );
    }
    
    // Ensure 42 cells for consistent layout
    while (cells.length < 42) {
      cells.push(<div key={`filler-${cells.length}`} className="bg-white/5 border border-white/10 min-h-[160px] rounded-lg" />);
    }
    
    return cells;
  };

  return (
    <div className="w-full h-full flex flex-col bg-transparent relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-40 left-20 w-80 h-80 bg-gradient-to-br from-pink-400/10 to-indigo-400/10 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-br from-green-400/10 to-teal-400/10 rounded-full blur-3xl animate-pulse animation-delay-4000"></div>
      </div>

      {/* Enhanced header with glass-morphism */}
      <div className="relative z-20 border-b border-white/20 px-6 py-4 backdrop-blur-xl bg-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-lg">
              {monthNames[viewMonth]} {viewYear}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              className="group relative px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-bold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-emerald-500/25 overflow-hidden"
              onClick={() => {
                if (onGoToToday) onGoToToday();
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 flex items-center gap-2">
                <Sparkles className="w-4 h-4 animate-pulse" />
                Today
              </span>
            </button>
            
            <div className="flex bg-white/20 backdrop-blur-xl rounded-xl shadow-md overflow-hidden border border-white/30">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white transition-all duration-300 group"
              >
                <ChevronLeft className="w-5 h-5 transform group-hover:scale-110 transition-transform duration-200" />
              </button>
              <button
                onClick={() => navigateMonth('next')}
                className="p-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white transition-all duration-300 group"
              >
                <ChevronRight className="w-5 h-5 transform group-hover:scale-110 transition-transform duration-200" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced weekdays header */}
      <div className="relative z-10 grid grid-cols-7 border-b border-white/20 bg-white/5 backdrop-blur-sm">
        {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, idx) => (
          <div key={day} className={`text-center py-4 text-sm font-bold border-r border-white/10 last:border-r-0 transition-all duration-200 hover:bg-white/10 ${
            idx === 0 || idx === 6 ? 'text-red-500' : 'text-gray-700'
          }`}>
            <div className="uppercase tracking-wide">{day.slice(0, 3)}</div>
          </div>
        ))}
      </div>

      {/* Enhanced calendar grid */}
      <div className="flex-1 overflow-auto relative z-10 p-4">
        <div className="grid grid-cols-7 gap-3 min-h-full">
          {renderCalendarCells()}
        </div>
      </div>
    </div>
  );
}