import React, { useState, useEffect } from 'react';
import { Calendar, Plus, X, Clock, MapPin, User, Star, ChevronLeft, ChevronRight } from 'lucide-react';

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
  ...props 
}) {
  const [today] = useState(new Date());
  const [viewMonth, setViewMonthState] = useState(today.getMonth());
  const [viewYear, setViewYearState] = useState(today.getFullYear());
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
        <div key={`empty-${i}`} className="bg-white border border-gray-200 min-h-[140px]" />
      );
    }
    
    // Day cells with festivals integrated
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = getDateStr(viewYear, viewMonth, day);
      const isToday = isCurrentDate(day);
      const isWeekend = (new Date(viewYear, viewMonth, day)).getDay() % 6 === 0;
      
      const dayEvents = events[dateStr] || [];
      const dayFestivals = festivals[dateStr] || [];
      const primaryFestival = dayFestivals[0]; // Display only the first festival above
      const remainingFestivals = dayFestivals.slice(1); // Remaining festivals go inside
      const allItems = [...remainingFestivals, ...dayEvents]; // Combine remaining festivals and events
      
      cells.push(
        <div
          key={`date-${day}`}
          className={`border border-gray-200 p-2 min-h-[160px] flex flex-col justify-start items-stretch ${
            isToday ? 'bg-blue-50' : 'bg-white'
          } hover:bg-gray-50 cursor-pointer transition-all duration-200`}
          onClick={() => handleDayClick(dateStr)}
          style={{ overflow: 'visible' }}
        >
          {/* Primary festival displayed above day number */}
          {primaryFestival && (
            <div 
              className={`${primaryFestival.color} ${primaryFestival.textColor} px-2 py-0.5 rounded text-xs font-semibold mb-1 border-l-2 border-current flex items-center gap-1`}
              style={{ whiteSpace: 'normal', overflow: 'visible', maxWidth: '100%' }}
              title={`${primaryFestival.title} - ${primaryFestival.type === 'kerala' ? 'Kerala Festival' : primaryFestival.type === 'tamil' ? 'Tamil Festival' : 'National Holiday'}`}
            >
              <span className="text-xs">
                {primaryFestival.type === 'kerala' ? '🌴' : 
                 primaryFestival.type === 'tamil' ? '🏛️' : 
                 primaryFestival.type === 'national' ? '🇮🇳' : '🎉'}
              </span>
              <span className="break-words">{primaryFestival.title}</span>
            </div>
          )}
          
          {/* Day number */}
          <div className="flex items-center justify-between mb-1">
            <span className={`text-sm font-medium ${
              isToday 
                ? 'bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold' 
                : isWeekend 
                  ? 'text-gray-500' 
                  : 'text-gray-900'
            }`}>
              {day}
            </span>
            {allItems.length > 0 && (
              <span className="text-xs bg-gray-200 text-gray-600 rounded-full px-1.5 py-0.5 font-medium">
                {allItems.length}
              </span>
            )}
          </div>
          
          {/* Remaining festivals and events inside the cell */}
          <div className="flex flex-col gap-1 flex-1">
            {/* Show remaining festivals (if any) */}
            {remainingFestivals.map((festival, idx) => (
              <div 
                key={`festival-${idx}`} 
                className={`${festival.color} ${festival.textColor} px-2 py-0.5 rounded text-xs font-medium border-l-3 border-current flex items-center gap-1`}
                title={`${festival.title} - ${festival.type === 'kerala' ? 'Kerala Festival' : festival.type === 'tamil' ? 'Tamil Festival' : 'National Holiday'}`}
              >
                <span className="text-xs">
                  {festival.type === 'kerala' ? '🌴' : 
                   festival.type === 'tamil' ? '🏛️' : 
                   festival.type === 'national' ? '🇮🇳' : '🎉'}
                </span>
                <span className="break-words">{festival.title}</span>
              </div>
            ))}
            
            {/* Show regular events */}
            {dayEvents.slice(0, Math.max(1, 3 - remainingFestivals.length)).map((event, idx) => (
              <div 
                key={`event-${idx}`} 
                className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs font-medium border-l-3 border-blue-600 flex items-center gap-1"
                title={event.title}
              >
                <span className="break-words">{event.title}</span>
                {event.time && <span className="text-gray-600 ml-1 text-xs">{event.time}</span>}
              </div>
            ))}
            
            {/* Show "+X more" indicator */}
            {allItems.length > 3 && (
              <div className="text-xs text-gray-500 px-2 py-0.5 hover:bg-gray-100 rounded cursor-pointer text-center">
                +{allItems.length - 3} more
              </div>
            )}
          </div>
        </div>
      );
    }
    
    // Ensure the grid has at least 6 rows (42 cells) for a full month layout
    while (cells.length < 42) {
      cells.push(<div key={`filler-${cells.length}`} className="bg-white border border-gray-200 min-h-[160px]" />);
    }
    
    return cells;
  };

  return (
    <div className="w-full h-full flex flex-col bg-white overflow-hidden">
      {/* Clean header like Google Calendar */}
      <div className="border-b border-gray-200 px-6 py-4 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-normal text-gray-900">
              {monthNames[viewMonth]} {viewYear}
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              className="px-4 py-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition-colors duration-200 text-sm font-medium"
              onClick={() => {
                if (onGoToToday) onGoToToday();
              }}
            >
              Today
            </button>
            
            <div className="flex">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-l border border-r-0 border-gray-300"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigateMonth('next')}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-r border border-gray-300"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Weekdays header */}
      <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
        {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, idx) => (
          <div key={day} className={`text-center py-3 text-xs font-medium border-r border-gray-200 last:border-r-0 ${
            idx === 0 || idx === 6 ? 'text-blue-600' : 'text-gray-700'
          }`}>
            <div className="text-xs font-medium text-gray-500 mb-1">{day.slice(0, 3).toUpperCase()}</div>
          </div>
        ))}
      </div>

      {/* Calendar grid - festivals show in respective date cells */}
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-7 min-h-full">
          {renderCalendarCells()}
        </div>
      </div>

      {/* Enhanced modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-md p-0 w-full max-w-md overflow-hidden border border-gray-200/50 transform animate-in zoom-in-95 duration-200">
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
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold shadow-md transition-all duration-200 hover:shadow-lg transform hover:scale-105"
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