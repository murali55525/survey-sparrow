import { useState, useEffect } from 'react'

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfWeek(year, month) {
  return new Date(year, month, 1).getDay()
}

const today = new Date()
const formatTime = (hours, minutes) => {
  return `${hours % 12 || 12}:${minutes.toString().padStart(2, '0')} ${hours >= 12 ? 'PM' : 'AM'}`
}

export default function App() {
  const [events, setEvents] = useState({})
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [title, setTitle] = useState('')
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [dayViewDate, setDayViewDate] = useState(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [viewMode, setViewMode] = useState('month') // 'day', 'week', 'month', 'year'
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true) // Track sidebar visibility

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const daysInMonth = getDaysInMonth(viewYear, viewMonth)
  const firstDay = getFirstDayOfWeek(viewYear, viewMonth)

  const handleOpenModal = (date, time = '') => {
    setSelectedDate(date)
    setSelectedTime(time)
    setTitle('')
    setModalOpen(true)
  }

  const handleCloseModal = () => setModalOpen(false)

  const handleAddEvent = () => {
    if (!title) return
    const eventKey = selectedTime 
      ? `${selectedDate}T${selectedTime}` 
      : selectedDate
    
    setEvents(prev => ({
      ...prev,
      [eventKey]: [...(prev[eventKey] || []), { title, time: selectedTime }]
    }))
    setModalOpen(false)
  }

  const handleDeleteEvent = (dateKey, idx) => {
    setEvents(prev => {
      const updated = [...(prev[dateKey] || [])]
      updated.splice(idx, 1)
      return { ...prev, [dateKey]: updated }
    })
  }
  
  // Update handleDayClick to automatically switch to day view
  const handleDayClick = (date) => {
    setDayViewDate(date);
    setViewMode('day');
  }

  const handleBackToMonth = () => {
    setDayViewDate(null);
  }

  const handlePrevMonth = () => {
    setViewMonth(m => {
      if (m === 0) {
        setViewYear(y => y - 1)
        return 11
      }
      return m - 1
    })
  }

  const handleNextMonth = () => {
    setViewMonth(m => {
      if (m === 11) {
        setViewYear(y => y + 1)
        return 0
      }
      return m + 1
    })
  }

  // Helper to get date string
  const getDateStr = (day) => `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`

  // Check if date is today
  const isCurrentDate = (day) => 
    day === today.getDate() &&
    viewMonth === today.getMonth() &&
    viewYear === today.getFullYear()

  // Helper to get full time range string
  const getTimeRangeStr = (hour) => {
    return `${formatTime(hour, 0)} - ${formatTime(hour + 1, 0)}`;
  }

  // Generate time slots for day view
  const generateTimeSlots = () => {
    const slots = [];
    const dateStr = dayViewDate;
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();
    
    for (let hour = 0; hour < 24; hour++) {
      const timeStr = `${String(hour).padStart(2, '0')}:00`;
      const eventKey = `${dateStr}T${timeStr}`;
      const isCurrentTimeHour = 
        new Date(dateStr).toDateString() === currentTime.toDateString() && 
        hour === currentHour;
      
      const eventsAtThisTime = events[eventKey] || [];
      
      slots.push(
        <div 
          key={timeStr} 
          className="flex border-b border-gray-100 relative" 
          id={`hour-${hour}`}
        >
          <div className="w-16 py-3 text-right pr-3 text-xs text-gray-500">
            {formatTime(hour, 0)}
          </div>
          <div className="flex-1 min-h-[60px] relative">
            {eventsAtThisTime.map((event, idx) => (
              <div 
                key={idx} 
                className="absolute left-0 right-0 ml-1 mr-3 bg-blue-500 text-white rounded px-2 py-1 text-sm"
              >
                <div className="flex justify-between items-center">
                  <span>{event.title}</span>
                  <button
                    onClick={() => handleDeleteEvent(eventKey, idx)}
                    className="text-blue-200 hover:text-white"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
            <button 
              className="absolute inset-0 w-full h-full hover:bg-blue-50/30"
              onClick={() => handleOpenModal(dateStr, timeStr)}
            ></button>
          </div>
          
          {/* Current time indicator - guaranteed bright red line */}
          {isCurrentTimeHour && (
            <div 
              className="absolute left-0 right-0 flex items-center pointer-events-none" 
              style={{ top: `${currentMinute / 60 * 100}%` }}
            >
              {/* Time label on the left */}
              <div className="absolute -left-[60px] -translate-y-1/2 text-xs whitespace-nowrap z-10 font-bold text-red-500">
                {formatTime(currentHour, currentMinute)}
              </div>
              
              {/* Bright red dot */}
              <div className="w-4 h-4 rounded-full ml-[13px] z-10 shadow-md bg-red-500" 
                style={{ backgroundColor: '#ef4444' }}></div>
              
              {/* Bright red line that will definitely be visible */}
              <div className="h-[4px] w-full z-10 shadow-md bg-red-500" 
                style={{ backgroundColor: '#ef4444 !important' }}>
              </div>
            </div>
          )}
        </div>
      );
    }
    
    return slots;
  };

  // Calendar grid - update to match Google Calendar style
  const calendarCells = []
  for (let i = 0; i < firstDay; i++) {
    calendarCells.push(<div key={`empty-${i}`} className="bg-gray-50/20" />)
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = getDateStr(day)
    const isToday = isCurrentDate(day)
    
    // Get all events for this day (regardless of time)
    const dayEvents = Object.entries(events)
      .filter(([key]) => key.startsWith(dateStr))
      .reduce((acc, [_, eventsArray]) => [...acc, ...eventsArray], []);
      
    calendarCells.push(
      <div
        key={dateStr}
        className={`border border-gray-100 p-1.5 min-h-[80px] md:min-h-[100px] flex flex-col relative transition-all duration-200 cursor-pointer ${
          isToday 
            ? 'bg-blue-50/30 border-blue-200' 
            : 'bg-white hover:bg-gray-50/30'
        }`}
        onClick={() => handleDayClick(dateStr)}
      >
        <div className="flex items-center justify-between">
          <span className={`flex items-center justify-center h-7 w-7 text-sm rounded-full ${
            isToday ? 'bg-blue-500 text-white font-medium' : 'text-gray-700 hover:bg-gray-100'
          }`}>
            {day}
          </span>
          <button
            className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors opacity-0 group-hover:opacity-100"
            onClick={(e) => {
              e.stopPropagation();
              handleOpenModal(dateStr);
            }}
            title="Add event"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
        </div>
        <div className="flex flex-col gap-0.5 overflow-y-auto max-h-[70px] text-xs mt-1">
          {dayEvents.map((e, idx) => (
            <div 
              key={idx} 
              className="flex items-center py-1 px-2 rounded bg-blue-100 text-blue-800 text-xs"
              onClick={(ev) => ev.stopPropagation()}
            >
              <div className="w-2 h-full bg-blue-500 rounded-full mr-1.5"></div>
              <span className="truncate">{e.title}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Create a mini calendar for the sidebar - Google Calendar style
  const generateMiniCalendarDays = () => {
    const days = []
    const miniFirstDay = getFirstDayOfWeek(viewYear, viewMonth)
    const miniDaysInMonth = getDaysInMonth(viewYear, viewMonth)
    
    for (let i = 0; i < miniFirstDay; i++) {
      days.push(<div key={`mini-empty-${i}`} className="h-8 w-8" />)
    }
    
    for (let day = 1; day <= miniDaysInMonth; day++) {
      const dateStr = getDateStr(day)
      const isToday = isCurrentDate(day)
      days.push(
        <div 
          key={`mini-${day}`} 
          className={`flex items-center justify-center h-8 w-8 text-sm rounded-full cursor-pointer
            ${isToday ? 'bg-blue-500 text-white' : 'hover:bg-gray-100 text-gray-700'}
            ${dayViewDate === dateStr ? 'ring-1 ring-blue-500' : ''}`}
          onClick={() => handleDayClick(dateStr)}
        >
          {day}
        </div>
      )
    }
    
    return days
  }

  // Generate week view
  const generateWeekView = () => {
    const weekDays = [];
    const weekStart = dayViewDate ? new Date(dayViewDate) : new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Start from Sunday
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + i);
      const dateStr = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`;
      
      // Get events for this day
      const dayEvents = Object.entries(events)
        .filter(([key]) => key.startsWith(dateStr))
        .reduce((acc, [_, eventsArray]) => [...acc, ...eventsArray], []);
      
      const isToday = day.toDateString() === today.toDateString();
      
      weekDays.push(
        <div key={dateStr} className="flex flex-col flex-1">
          <div className={`text-center py-2 ${isToday ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-600'}`}>
            <div className="text-xs uppercase">{day.toLocaleString('default', { weekday: 'short' })}</div>
            <div className={`mx-auto mt-1 w-8 h-8 flex items-center justify-center rounded-full ${
              isToday ? 'bg-blue-200 text-blue-700' : ''
            }`}>
              {day.getDate()}
            </div>
          </div>
          <div className="flex-1 border-r border-gray-100 p-1">
            {dayEvents.map((event, idx) => (
              <div key={idx} className="text-xs p-1 my-1 bg-blue-100 rounded text-blue-700">
                {event.title}
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    return weekDays;
  };

  // Generate year view
  const generateYearView = () => {
    const months = [];
    
    for (let month = 0; month < 12; month++) {
      months.push(
        <div key={`month-${month}`} className="p-2 border rounded">
          <div className="text-center font-medium text-sm mb-2">
            {new Date(viewYear, month).toLocaleString('default', { month: 'long' })}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
              <div key={d} className="text-center text-gray-400 text-xs">{d}</div>
            ))}
            
            {(() => {
              const days = [];
              const monthFirstDay = getFirstDayOfWeek(viewYear, month);
              const monthDaysCount = getDaysInMonth(viewYear, month);
              
              // Add empty cells for days before the first day of month
              for (let i = 0; i < monthFirstDay; i++) {
                days.push(<div key={`empty-${month}-${i}`} className="h-5" />);
              }
              
              // Add cells for all days
              for (let day = 1; day <= monthDaysCount; day++) {
                const isCurrentDate = 
                  day === today.getDate() &&
                  month === today.getMonth() &&
                  viewYear === today.getFullYear();
                
                days.push(
                  <div 
                    key={`day-${month}-${day}`}
                    className={`text-xs h-5 flex items-center justify-center ${
                      isCurrentDate ? 'bg-blue-100 text-blue-700 rounded-full' : ''
                    }`}
                  >
                    {day}
                  </div>
                );
              }
              return days;
            })()}
          </div>
        </div>
      );
    }
    
    return months;
  };

  return (
    <div className="min-h-screen flex bg-white w-full overflow-hidden font-sans">
      {/* Mobile Sidebar Toggle */}
      <button 
        className="fixed bottom-4 left-4 z-30 md:hidden bg-white text-gray-700 p-3 rounded-full shadow-lg border border-gray-200"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        )}
      </button>

      {/* Google Calendar Style Sidebar */}
      <div 
        className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                   fixed md:static top-0 left-0 z-20 h-full
                   w-64 md:w-64 lg:w-72 p-4 flex flex-col border-r border-gray-100 shrink-0 overflow-y-auto
                   bg-white transition-transform duration-300 md:translate-x-0`}
      >
        {/* Google-styled header */}
        <div className="flex items-center mb-6 pl-1">
          <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M20 3h-1V2h-2v1H7V2H5v1H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V10h16v11zm0-13H4V5h16v3z"></path>
          </svg>
          <h1 className="text-xl text-gray-700 font-normal">Calendar</h1>
        </div>
        
        {/* Google-styled Create button */}
        <button 
          className="mb-6 flex items-center justify-center px-6 py-3 rounded-lg hover:bg-gray-100 transition-all text-sm shadow-sm border border-gray-200"
          onClick={() => {
            handleOpenModal(dayViewDate || getDateStr(today.getDate()));
            setSidebarOpen(false);
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-3 text-gray-500" viewBox="0 0 24 24">
            <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path>
          </svg>
          <span className="text-gray-700">Create</span>
        </button>
        
        {/* Google-styled mini calendar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-medium text-gray-700">
              {new Date(viewYear, viewMonth).toLocaleString('default', { month: 'long' })} {viewYear}
            </h2>
            <div className="flex gap-1">
              <button 
                className="p-1.5 hover:bg-gray-100 rounded-full" 
                onClick={handlePrevMonth}
                aria-label="Previous month"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-gray-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
              <button 
                className="p-1.5 hover:bg-gray-100 rounded-full"
                onClick={handleNextMonth}
                aria-label="Next month"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-gray-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Google-styled mini calendar */}
          <div className="w-full">
            <div className="grid grid-cols-7 gap-0 text-xs">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                <div key={d} className="flex justify-center items-center h-8 text-gray-500">{d}</div>
              ))}
              {generateMiniCalendarDays()}
            </div>
          </div>
        </div>
        
        {/* My Calendars section */}
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">My calendars</h3>
          <div className="space-y-1">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-700">Calendar</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-700">Tasks</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-700">Reminders</span>
            </div>
          </div>
        </div>

        {/* Upcoming Events section */}
        <div className="mt-4 border-t border-gray-100 pt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Upcoming events</h3>
          <div className="text-xs space-y-2 max-h-[180px] overflow-auto">
            {Object.entries(events)
              .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
              .slice(0, 3)
              .map(([date, dateEvents]) => dateEvents.map((event, idx) => (
                <div key={`${date}-${idx}`} className="p-2 bg-gray-50 text-gray-700 rounded border-l-4 border-blue-400">
                  <div className="font-medium">{event.title}</div>
                  <div className="text-gray-500">{new Date(date.split('T')[0]).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    {event.time && ` • ${formatTime(parseInt(event.time.split(':')[0]), 0)}`}</div>
                </div>
              )))
              .flat()
          }
          </div>
        </div>
      </div>

      {/* Main Content - Google Calendar Style */}
      <div className="flex-1 flex flex-col w-full overflow-hidden relative">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-gray-800/20 z-10 md:hidden" onClick={() => setSidebarOpen(false)}></div>
        )}

        {/* Google Calendar-styled top toolbar */}
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-2 shrink-0 bg-white">
          <div className="flex items-center space-x-2">
            {/* Sidebar toggle for mobile */}
            <button 
              className="mr-2 md:hidden p-2 rounded-full text-gray-600 hover:bg-gray-100"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
            
            {/* Today button - Google style */}
            <button 
              className="px-5 py-1.5 rounded-md text-sm bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              onClick={() => {
                setViewMonth(today.getMonth())
                setViewYear(today.getFullYear())
                setDayViewDate(getDateStr(today.getDate()))
                setViewMode('day')
              }}
            >
              Today
            </button>
            
            {/* Month navigation - Google style */}
            <div className="flex items-center space-x-1">
              <button 
                className="p-1.5 hover:bg-gray-100 rounded-full" 
                onClick={handlePrevMonth}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
              <button 
                className="p-1.5 hover:bg-gray-100 rounded-full"
                onClick={handleNextMonth}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>
            
            {/* Month/Year display - Google style */}
            <h2 className="text-xl font-normal text-gray-800">
              {dayViewDate && viewMode !== 'year' ? (
                new Date(dayViewDate).toLocaleDateString('en-US', {
                  weekday: viewMode === 'day' ? 'short' : undefined,
                  month: 'long',
                  day: 'numeric'
                })
              ) : (
                `${viewMode === 'year' ? viewYear : new Date(viewYear, viewMonth).toLocaleString('default', { month: 'long' }) + ' ' + viewYear}`
              )}
            </h2>
          </div>
          
          {/* View selector - Google style */}
          <div className="flex items-center">
            <div className="relative">
              <div className="flex border border-gray-300 rounded-md overflow-hidden">
                <button 
                  className={`px-4 py-1.5 text-sm ${viewMode === 'day' ? 'bg-blue-100 text-blue-700' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                  onClick={() => {
                    setViewMode('day')
                    if (!dayViewDate) setDayViewDate(getDateStr(today.getDate()))
                  }}
                >Day</button>
                <button 
                  className={`px-4 py-1.5 text-sm ${viewMode === 'week' ? 'bg-blue-100 text-blue-700' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                  onClick={() => setViewMode('week')}
                >Week</button>
                <button 
                  className={`px-4 py-1.5 text-sm ${viewMode === 'month' ? 'bg-blue-100 text-blue-700' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                  onClick={() => setViewMode('month')}
                >Month</button>
                <button 
                  className={`px-4 py-1.5 text-sm ${viewMode === 'year' ? 'bg-blue-100 text-blue-700' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                  onClick={() => setViewMode('year')}
                >Year</button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Calendar Content - Google style */}
        <div className="flex-1 p-0 overflow-auto w-full h-[calc(100vh-64px)]">
          {viewMode === 'day' && (
            <div className="w-full h-full">
              <div className="overflow-y-auto h-full w-full">
                {/* Current time indicator at the top */}
                <div className="sticky top-0 z-10 bg-white py-2 border-b border-red-200 mb-4 flex items-center justify-center">
                  <div className="flex items-center bg-red-100 rounded-full px-4 py-1.5 shadow-sm">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                    <span className="text-red-700 font-medium flex items-center">
                      <span className="mr-1">Current Time:</span>
                      <span className="bg-red-500 text-white py-0.5 px-2 rounded font-bold">
                        {formatTime(currentTime.getHours(), currentTime.getMinutes())}
                      </span>
                    </span>
                  </div>
                </div>
                
                {/* Day view with current time line */}
                <div className="relative group">
                  {/* Scroll to current time button */}
                  {currentTime.toDateString() === new Date(dayViewDate || '').toDateString() && (
                    <div className="sticky top-16 z-10 flex justify-end mb-2">
                      <button 
                        className="text-sm bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 shadow-sm flex items-center"
                        onClick={() => {
                          const hourElement = document.getElementById(`hour-${currentTime.getHours()}`)
                          if (hourElement) {
                            hourElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
                          }
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        Go to current time
                      </button>
                    </div>
                  )}
                  
                  {/* Time slots with enhanced current time indicator */}
                  {generateTimeSlots()}
                </div>
              </div>
            </div>
          )}
          
          {viewMode === 'week' && (
            <div className="flex h-full w-full border-t">
              {generateWeekView()}
            </div>
          )}
          
          {/* Google-styled month view */}
          {viewMode === 'month' && (
            <div className="w-full h-full flex flex-col">
              {/* Weekdays Header - Google style */}
              <div className="grid grid-cols-7 w-full border-b border-gray-200">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                  <div key={day} className="text-center py-2 text-xs font-medium text-gray-500">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid - Google style */}
              <div className="grid grid-cols-7 w-full flex-1 bg-white">
                {calendarCells}
              </div>
            </div>
          )}
          
          {/* Google-styled year view */}
          {viewMode === 'year' && (
            <div className="grid grid-cols-3 md:grid-cols-4 gap-4 p-4 w-full">
              {Array(12).fill().map((_, month) => (
                <div 
                  key={`month-${month}`} 
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md cursor-pointer"
                  onClick={() => {
                    setViewMonth(month);
                    setViewMode('month');
                  }}
                >
                  <div className="bg-gray-50 py-2 border-b border-gray-100">
                    <h3 className="text-center text-sm font-medium text-gray-700">
                      {new Date(viewYear, month).toLocaleString('default', { month: 'long' })}
                    </h3>
                  </div>
                  <div className="p-2 bg-white">
                    <div className="grid grid-cols-7 gap-1 text-[10px] text-gray-500">
                      {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                        <div key={d} className="text-center">{d}</div>
                      ))}
                    </div>
                    {/* Month mini-calendar */}
                    <div className="grid grid-cols-7 gap-1 mt-1">
                      {(() => {
                        const days = [];
                        const monthFirstDay = getFirstDayOfWeek(viewYear, month);
                        const monthDaysCount = getDaysInMonth(viewYear, month);
                        
                        // Empty cells
                        for (let i = 0; i < monthFirstDay; i++) {
                          days.push(<div key={`empty-${month}-${i}`} className="h-4" />);
                        }
                        
                        // Day cells
                        for (let day = 1; day <= monthDaysCount; day++) {
                          const isCurrentDate = 
                            day === today.getDate() &&
                            month === today.getMonth() &&
                            viewYear === today.getFullYear();
                          
                          days.push(
                            <div 
                              key={`day-${month}-${day}`}
                              className={`text-[10px] h-4 flex items-center justify-center ${
                                isCurrentDate ? 'bg-blue-500 text-white rounded-full' : ''
                              }`}
                            >
                              {day}
                            </div>
                          );
                        }
                        return days;
                      })()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Google-styled modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md animate-fadeIn overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h2 className="text-lg font-medium text-gray-700">
                Add Event
              </h2>
            </div>
            <div className="p-4">
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                placeholder="Add title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                autoFocus
              />
              
              <div className="flex items-center mb-4">
                <svg className="w-5 h-5 text-gray-500 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M19 19H5V8h14m-3-7v2H8V2H6v2H5c-1.11 0-2 .89-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2h-1V2m-1 11h-5v5h5v-5z"></path>
                </svg>
                <span className="text-sm text-gray-700">
                  {new Date(selectedDate).toLocaleDateString('en-US', { 
                    weekday: 'short',
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                  {selectedTime && ` • ${getTimeRangeStr(parseInt(selectedTime.split(':')[0]))}`}
                </span>
              </div>
            </div>
            <div className="flex justify-end gap-2 p-4 border-t border-gray-100 bg-gray-50">
              <button
                className="px-4 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100"
                onClick={handleCloseModal}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-md text-sm bg-blue-500 text-white hover:bg-blue-600"
                onClick={handleAddEvent}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
