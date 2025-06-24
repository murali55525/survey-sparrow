import React, { useState, useEffect } from 'react';
import { Calendar, Plus, X, Clock, MapPin, User, Star, ChevronLeft, ChevronRight } from 'lucide-react';

// Utility functions (mock implementations)
const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfWeek = (year, month) => new Date(year, month, 1).getDay();
const getDateStr = (year, month, day) => `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

export default function EnhancedMonthView() {
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

  // Replace colored backgrounds with white
  const dayColors = {
    today: 'bg-white border-2 border-gray-400 text-gray-800',
    weekend: 'bg-white text-gray-800',
    weekday: 'bg-white text-gray-800',
    otherMonth: 'bg-white text-gray-400',
    hasEvents: 'border border-gray-300',
  };

  const categoryColors = {
    work: 'bg-white text-gray-800 border-l-2 border-gray-400',
    personal: 'bg-white text-gray-800 border-l-2 border-gray-400',
    holiday: 'bg-white text-gray-800 border-l-2 border-gray-400',
    health: 'bg-white text-gray-800 border-l-2 border-gray-400',
    social: 'bg-white text-gray-800 border-l-2 border-gray-400',
    travel: 'bg-white text-gray-800 border-l-2 border-gray-400',
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
    <div className="w-full h-full flex flex-col bg-white rounded-xl shadow overflow-hidden">
      {/* Header with white background */}
      <div className="bg-white text-gray-800 p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Calendar className="w-8 h-8 text-gray-600" />
            <h1 className="text-3xl font-bold">
              {monthNames[viewMonth]} {viewYear}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 rounded-lg bg-white border border-gray-200"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 rounded-lg bg-white border border-gray-200"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Weekdays Header - change text-red-600 to text-gray-600 */}
      <div className="grid grid-cols-7 bg-white border-b border-gray-200">
        {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, idx) => (
          <div key={day} className={`text-center py-4 font-semibold ${
            idx === 0 || idx === 6 ? 'text-gray-600' : 'text-gray-700' /* changed from text-red-600 */
          }`}>
            <div className="text-sm">{day}</div>
            <div className="text-xs opacity-75">{day.slice(0, 3)}</div>
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 flex-1 bg-white">
        {renderCalendarCells()}
      </div>

      {/* Modal for adding events */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">Add Event</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Event Title</label>
                <input
                  type="text"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
                  placeholder="Enter event title..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                <input
                  type="time"
                  value={newEventTime}
                  onChange={(e) => setNewEventTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={newEventCategory}
                  onChange={(e) => setNewEventCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none appearance-none"
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
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAddEvent}
                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded border border-gray-300"
              >
                Add Event
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 bg-white text-gray-800 py-2 px-4 rounded border border-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}