import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import CalendarHeader from './components/CalendarHeader'
import DayView from './components/calendar-views/DayView'
import MonthView from './components/calendar-views/MonthView'
import YearView from './components/calendar-views/YearView'
import WeekView from './components/calendar-views/WeekView'
import EventModal from './components/EventModal'
import { formatTime, getDaysInMonth, getFirstDayOfWeek, getDateStr } from './utils/dateUtils'

// Constants
const today = new Date()

export default function CalendarApp({ viewMode, setViewMode }) {
  // Always start with empty events/tasks (do not load from localStorage)
  const [events, setEvents] = useState({})
  const [tasks, setTasks] = useState({})

  // Core state
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [dayViewDate, setDayViewDate] = useState(new Date())
  const [currentTime, setCurrentTime] = useState(new Date())
  const [sidebarOpen, setSidebarOpen] = useState(true)
  
  // Modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [title, setTitle] = useState('')

  // Add task state
  const [isTaskMode, setIsTaskMode] = useState(false)

  // Update time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  // Check if date is today
  const isCurrentDate = (day) => 
    day === today.getDate() &&
    viewMonth === today.getMonth() &&
    viewYear === today.getFullYear()

  // Event handlers
  const handleOpenModal = (date, time = '', isTask = false) => {
    setSelectedDate(date)
    setSelectedTime(time)
    setTitle('')
    setIsTaskMode(isTask)
    setModalOpen(true)
  }

  const handleCloseModal = () => setModalOpen(false)

  // --- Event handlers ---
  const handleAddEvent = (eventDetails) => {
    if (!eventDetails?.title) return;

    const {
      title,
      description,
      isAllDay,
      location,
      color,
      endTime,
      time, // get time from eventDetails (should be required from sidebar)
      category,
    } = eventDetails;

    // Always require a time for non-all-day events
    const eventTime = isAllDay ? '' : (time || selectedTime || '00:00');
    const dateKey = selectedDate;
    const timeKey = isAllDay ? selectedDate : `${selectedDate}T${eventTime}`;

    const eventObj = {
      title,
      time: eventTime,
      endTime,
      description,
      location,
      color,
      isAllDay,
      category,
    };

    setEvents(prev => {
      // Store under date key for month/day view
      const dateEvents = [...(prev[dateKey] || []), eventObj];
      // Store under date+time key for week/day view
      const timeKeyEvents = [...(prev[timeKey] || []), eventObj];
      return {
        ...prev,
        [dateKey]: dateEvents,
        [timeKey]: timeKeyEvents,
      };
    });
    setModalOpen(false);
  }

  const handleDeleteEvent = (dateKey, idx) => {
    setEvents(prev => {
      const updated = [...(prev[dateKey] || [])]
      updated.splice(idx, 1)
      return { ...prev, [dateKey]: updated }
    })
  }
  
  const handleAddTask = () => {
    if (!title) return
    
    setTasks(prev => {
      const dateKey = selectedDate
      const newTask = { 
        id: Date.now(), 
        title, 
        completed: false, 
        date: selectedDate 
      }
      
      return {
        ...prev,
        [dateKey]: [...(prev[dateKey] || []), newTask]
      }
    })
    
    setModalOpen(false)
    setTitle('')
    setIsTaskMode(false)
  }

  const handleToggleTaskCompletion = (dateKey, taskId) => {
    setTasks(prev => {
      const updatedTasks = prev[dateKey].map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
      return { ...prev, [dateKey]: updatedTasks }
    })
  }

  const handleDeleteTask = (dateKey, taskId) => {
    setTasks(prev => {
      const updatedTasks = prev[dateKey].filter(task => task.id !== taskId)
      return { ...prev, [dateKey]: updatedTasks }
    })
  }
  
  const handleDayClick = (date) => {
    // Ensure the date is properly formatted as YYYY-MM-DD
    let formattedDate;
    
    try {
      // If it's already a string, check if properly formatted
      if (typeof date === 'string') {
        // Check if the string is in YYYY-MM-DD format
        if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
          formattedDate = date;
        } else {
          // Try to parse and reformat
          const parsedDate = new Date(date);
          if (!isNaN(parsedDate.getTime())) {
            formattedDate = parsedDate.toISOString().split('T')[0];
          } else {
            throw new Error("Invalid date string");
          }
        }
      } else if (date instanceof Date) {
        // Convert Date object to string
        formattedDate = date.toISOString().split('T')[0];
      } else {
        throw new Error("Invalid date type");
      }
      
      console.log("Setting dayViewDate to:", formattedDate);
      setDayViewDate(formattedDate);
      setViewMode('day');

      // Extract year and month from the date for consistency
      const dateObj = new Date(formattedDate);
      setViewYear(dateObj.getFullYear());
      setViewMonth(dateObj.getMonth());
      
    } catch (err) {
      console.error("Error in handleDayClick:", err);
      // Fallback to today
      const today = new Date();
      setDayViewDate(today.toISOString().split('T')[0]);
      setViewMode('day');
    }
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

  // Handler for "Today" button in MonthView/YearView/DayView
  const handleGoToToday = () => {
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
    setDayViewDate(today);
    setViewMode(viewMode); // Stay in current view
  };

  // Helper functions for date manipulation
  const getTimeRangeStr = (hour) => {
    return `${formatTime(hour, 0)} - ${formatTime(hour + 1, 0)}`;
  }

  return (
    <div className="flex min-h-screen w-full bg-[#f8fafc]">
      {/* Sidebar */}
      <Sidebar 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        viewYear={viewYear}
        viewMonth={viewMonth}
        dayViewDate={dayViewDate}
        handleDayClick={handleDayClick}
        handlePrevMonth={handlePrevMonth}
        handleNextMonth={handleNextMonth}
        handleOpenModal={handleOpenModal}
        events={events}
        today={today}
        tasks={tasks}
        handleToggleTaskCompletion={handleToggleTaskCompletion}
        handleDeleteTask={handleDeleteTask}
        setEvents={setEvents} // <-- pass setEvents to Sidebar so it can save events
      />
      {/* Main content area */}
      <div className="flex-1 flex flex-col items-stretch">
        <CalendarHeader 
          viewMode={viewMode}
          setViewMode={setViewMode}
          viewYear={viewYear}
          viewMonth={viewMonth}
          dayViewDate={dayViewDate}
          setDayViewDate={setDayViewDate}
          handlePrevMonth={handlePrevMonth}
          handleNextMonth={handleNextMonth}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          today={today}
          handleDayClick={handleDayClick}
        />
        
        <div className="flex-1 overflow-auto relative">
          {/* Backdrop for mobile, covers only the view area */}
          {sidebarOpen && (
            <div
              className="absolute inset-0 z-20 bg-black/40 backdrop-blur-sm md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
          
          {viewMode === 'day' && (
            <DayView 
              dayViewDate={dayViewDate}
              events={events}
              setEvents={setEvents} // <-- pass setEvents so edit/delete works
              currentTime={currentTime}
              handleOpenModal={handleOpenModal}
              handleDeleteEvent={handleDeleteEvent}
              handleDayClick={handleDayClick}
              tasks={tasks || {}}
              handleToggleTaskCompletion={handleToggleTaskCompletion}
              handleDeleteTask={handleDeleteTask}
              onGoToToday={handleGoToToday}
            />
          )}
          
          {viewMode === 'week' && (
            <WeekView 
              dayViewDate={dayViewDate || getDateStr(viewYear, viewMonth, today.getDate())}
              setDayViewDate={setDayViewDate}
              events={events}
              handleOpenModal={handleOpenModal}
              handleDayClick={handleDayClick}
              today={today}
              onGoToToday={handleGoToToday}
            />
          )}
          
          {viewMode === 'month' && (
            <MonthView 
              viewYear={viewYear}
              viewMonth={viewMonth}
              events={events}
              today={today}
              handleDayClick={handleDayClick}
              handleOpenModal={handleOpenModal}
              viewMode={viewMode}
              setViewMode={setViewMode}
              onGoToToday={handleGoToToday}
              setViewMonth={setViewMonth}
              setViewYear={setViewYear}
            />
          )}
          
          {viewMode === 'year' && (
            <YearView 
              viewYear={viewYear}
              today={today}
              setViewMonth={setViewMonth}
              setViewMode={setViewMode}
              onGoToToday={handleGoToToday}
              setViewYear={setViewYear}
            />
          )}
        </div>
      </div>
      
      {modalOpen && (
        <EventModal 
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          title={title}
          setTitle={setTitle}
          handleAddEvent={handleAddEvent}
          isTaskMode={isTaskMode}
          setIsTaskMode={setIsTaskMode}
          handleAddTask={handleAddTask}
          getTimeRangeStr={getTimeRangeStr}
        />
      )}
    </div>
  )
}