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

// Use props for all state and handlers needed from CalendarApp
export default function CalendarContent({
  events,
  setEvents,
  modalOpen,
  setModalOpen,
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
  title,
  setTitle,
  viewYear,
  setViewYear,
  viewMonth,
  setViewMonth,
  dayViewDate,
  setDayViewDate,
  currentTime,
  setCurrentTime,
  viewMode,
  setViewMode,
  dropdownOpen,
  setDropdownOpen,
  sidebarOpen,
  setSidebarOpen,
}) {
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
    <>
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
    </>
  )
}