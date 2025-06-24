import React, { useState, useEffect } from 'react';
import { Calendar, Plus, X, Clock, MapPin, User, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import ViewSelector from '../ViewSelector';

// Utility functions (mock implementations)
const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfWeek = (year, month) => new Date(year, month, 1).getDay();
const getDateStr = (year, month, day) => `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

export default function MonthView({ 
  viewMode, 
  setViewMode, 
  ...props 
}) {
  const [today] = useState(new Date());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [events, setEvents] = useState({
    '2024-12-25': [
      { title: 'Christmas Day', time: '00:00', category: 'holiday', priority: 'high' },
    ],
    '2024-12-31': [
      { title: 'New Year\'s Eve Party', time: '20:00', category: 'personal', priority: 'medium' },
    ],
    '2025-01-01': [
      { title: 'New Year\'s Day', time: '00:00', category: 'holiday', priority: 'high' },
    ],
    '2025-01-15': [
      { title: 'Team Meeting', time: '14:00', category: 'work', priority: 'high' },
      { title: 'Lunch with Sarah', time: '12:30', category: 'personal', priority: 'low' },
    ],
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventTime, setNewEventTime] = useState('');
  const [newEventCategory, setNewEventCategory] = useState('personal');
  const [hoveredDay, setHoveredDay] = useState(null);

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

  const handleAddEvent = () => {
    if (newEventTitle.trim()) {
      const newEvent = {
        title: newEventTitle,
        time: newEventTime,
        category: newEventCategory,
        priority: 'medium'
      };
      
      setEvents(prev => ({
        ...prev,
        [selectedDate]: [...(prev[selectedDate] || []), newEvent]
      }));
      
      setNewEventTitle('');
      setNewEventTime('');
      setIsModalOpen(false);
    }
  };

  const handleDeleteEvent = (dateStr, eventIndex) => {
    setEvents(prev => ({
      ...prev,
      [dateStr]: prev[dateStr].filter((_, idx) => idx !== eventIndex)
    }));
  };

  const navigateMonth = (direction) => {
    if (direction === 'prev') {
      if (viewMonth === 0) {
        setViewMonth(11);
        setViewYear(viewYear - 1);
      } else {
        setViewMonth(viewMonth - 1);
      }
    } else {
      if (viewMonth === 11) {
        setViewMonth(0);
        setViewYear(viewYear + 1);
      } else {
        setViewMonth(viewMonth + 1);
      }
    }
  };

  const renderCalendarCells = () => {
    const cells = [];
    
    // Empty cells for days before the 1st of the month
    for (let i = 0; i < firstDay; i++) {
      cells.push(
        <div key={`empty-${i}`} className="bg-white border border-gray-100" />
      );
    }
    
    // Day cells
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = getDateStr(viewYear, viewMonth, day);
      const isToday = isCurrentDate(day);
      const isWeekend = (new Date(viewYear, viewMonth, day)).getDay() % 6 === 0;
      const isCurrentMonth = viewMonth === today.getMonth() && viewYear === today.getFullYear();
      
      const dayEvents = events[dateStr] || [];
      
      cells.push(
        <div
          key={dateStr}
          className={`border border-gray-200 p-3 min-h-[120px] flex flex-col relative bg-white ${
            isToday ? dayColors.today : 
            isWeekend ? dayColors.weekend : dayColors.weekday
          } ${dayEvents.length > 0 ? dayColors.hasEvents : ''}`}
          onClick={() => handleDayClick(dateStr)}
        >
          <div className="flex items-center justify-between mb-2">
            <span className={`flex items-center justify-center h-8 w-8 text-sm font-semibold ${
              isToday ? 'border-2 border-gray-400 rounded-full' : ''
            }`}>
              {day}
            </span>
            
            <div className="flex items-center gap-1">
              {dayEvents.length > 0 && (
                <span className="text-xs bg-gray-200 text-gray-800 rounded-full px-2 py-1 font-medium">
                  {dayEvents.length}
                </span>
              )}
              <button
                className="w-7 h-7 flex items-center justify-center text-gray-500 bg-white rounded-lg border border-gray-200"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDayClick(dateStr);
                }}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {/* Events with white background */}
          <div className="flex flex-col gap-1 overflow-y-auto flex-1">
            {dayEvents.slice(0, 3).map((event, idx) => (
              <div 
                key={idx} 
                className="flex items-center py-1.5 px-2 rounded bg-white border border-gray-200 shadow-sm"
                onClick={(ev) => ev.stopPropagation()}
              >
                <div className="flex items-center gap-1 flex-1 min-w-0">
                  {priorityIcons[event.priority]}
                  <span className="truncate text-xs font-medium">{event.title}</span>
                </div>
                <div className="flex items-center gap-1">
                  {event.time && (
                    <span className="text-xs text-gray-500">{event.time}</span>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteEvent(dateStr, idx);
                    }}
                    className="text-gray-500 p-0.5 rounded"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
            {dayEvents.length > 3 && (
              <div className="text-xs text-gray-500 text-center py-1 bg-gray-100 rounded">
                +{dayEvents.length - 3} more
              </div>
            )}
          </div>
        </div>
      );
    }
    
    return cells;
  };

  return (
    <div className="w-full h-full flex flex-col bg-transparent overflow-hidden relative">
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
                  {new Date(viewYear, viewMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h1>
                <div className="absolute -bottom-2 left-0 w-full h-2 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full transform origin-left group-hover:scale-x-100 scale-x-0 transition-transform duration-700"></div>
                
                {/* Floating decorative elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-bounce shadow-2xl"></div>
                <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-gradient-to-r from-green-400 to-teal-500 rounded-full animate-pulse shadow-xl"></div>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <ViewSelector currentView={viewMode} setViewMode={setViewMode} />
              
              <button
                className="group relative px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold shadow-2xl transform transition-all duration-300 hover:scale-110 hover:shadow-emerald-500/25 overflow-hidden"
                onClick={() => {
                  const today = new Date();
                  setViewMonth(today.getMonth());
                  setViewYear(today.getFullYear());
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
                  onClick={() => navigateMonth('prev')}
                  className="p-4 text-gray-700 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white transition-all duration-300 group rounded-xl"
                >
                  <ChevronLeft className="w-6 h-6 transform group-hover:scale-110 transition-transform duration-200" />
                </button>
                <button
                  onClick={() => navigateMonth('next')}
                  className="p-4 text-gray-700 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white transition-all duration-300 group rounded-xl"
                >
                  <ChevronRight className="w-6 h-6 transform group-hover:scale-110 transition-transform duration-200" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ultra-modern weekdays header */}
      <div className="grid grid-cols-7 bg-gradient-to-r from-white/80 via-white/90 to-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-[140px] z-20 shadow-lg">
        {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, idx) => (
          <div key={day + idx} className={`text-center py-6 font-black text-lg transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 relative group ${
            idx === 0 || idx === 6 ? 'text-red-500' : 'text-gray-800'
          }`}>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="text-xl font-black">{day}</div>
              <div className="text-xs opacity-75 mt-1 font-semibold">{day.slice(0, 3)}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Revolutionary calendar grid */}
      <div className="grid grid-cols-7 flex-1 bg-gradient-to-br from-white/50 via-gray-50/50 to-blue-50/50 backdrop-blur-sm relative overflow-hidden">
        {/* Floating background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(59,130,246,0.5),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(168,85,247,0.5),transparent_50%)]"></div>
        </div>
        
        {renderCalendarCells()}
      </div>

      {/* Enhanced modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-0 w-full max-w-md overflow-hidden border border-gray-200/50 transform animate-in zoom-in-95 duration-200">
            {/* Enhanced modal header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
              <div className="flex items-center">
                <div className="w-4 h-12 bg-white/20 rounded-full mr-4"></div>
                <input
                  type="text"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  className="text-xl bg-transparent border-none w-full text-white placeholder-white/70 focus:outline-none"
                  placeholder="Add event title..."
                />
              </div>
            </div>
            
            {/* Enhanced modal body */}
            <div className="p-6 space-y-6">
              <div className="flex items-center space-x-4">
                <Calendar className="w-5 h-5 text-blue-500" />
                <div className="text-sm font-medium text-gray-700">{selectedDate}</div>
              </div>
              
              <div className="flex items-center space-x-4">
                <Clock className="w-5 h-5 text-purple-500" />
                <input
                  type="time"
                  value={newEventTime}
                  onChange={(e) => setNewEventTime(e.target.value)}
                  className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                />
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-5 h-5 flex items-center justify-center">
                  <span className="block w-3 h-3 rounded-full bg-gradient-to-r from-amber-400 to-orange-500"></span>
                </div>
                <select
                  value={newEventCategory}
                  onChange={(e) => setNewEventCategory(e.target.value)}
                  className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                >
                  <option value="personal">Personal</option>
                  <option value="work">Work</option>
                  <option value="health">Health</option>
                  <option value="social">Social</option>
                  <option value="travel">Travel</option>
                  <option value="holiday">Holiday</option>
                </select>
              </div>
            </div>
            
            {/* Enhanced modal footer */}
            <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200/50 flex gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-6 py-3 text-gray-700 bg-white rounded-xl border border-gray-200 font-semibold transition-all duration-200 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddEvent}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold shadow-lg transition-all duration-200 hover:shadow-xl transform hover:scale-105"
              >
                Save Event
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Enhanced floating action button */}
      <div className="fixed right-8 bottom-8">
        <button
          onClick={() => {
            setSelectedDate(getDateStr(viewYear, viewMonth, new Date().getDate()));
            setIsModalOpen(true);
          }}
          className="bg-gradient-to-r from-blue-500 to-purple-600 shadow-2xl rounded-full p-4 flex items-center justify-center transform transition-all duration-200 hover:scale-110 hover:shadow-3xl focus:outline-none focus:ring-4 focus:ring-blue-300/50"
        >
          <Plus className="w-6 h-6 text-white" />
        </button>
      </div>
    </div>
  );
}