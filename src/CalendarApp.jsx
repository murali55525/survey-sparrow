import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import CalendarHeader from './components/CalendarHeader'
import MonthView from './components/calendar-views/MonthView'
import DayView from './components/calendar-views/DayView'
import WeekView from './components/calendar-views/WeekView'
import YearView from './components/calendar-views/YearView'
import EventModal from './components/EventModal'
import { formatTime, getDaysInMonth, getFirstDayOfWeek, getDateStr } from './utils/dateUtils'

// Constants
const today = new Date()

export default function CalendarApp() {
  // Core state
  const [events, setEvents] = useState({})
  const [viewMode, setViewMode] = useState('month')
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [dayViewDate, setDayViewDate] = useState(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [sidebarOpen, setSidebarOpen] = useState(true)
  
  // Modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [title, setTitle] = useState('')

  // Add task state
  const [tasks, setTasks] = useState({})
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

  const handleAddEvent = (eventDetails) => {
    if (!eventDetails?.title) return
    
    const { 
      title, 
      description, 
      isAllDay, 
      location, 
      color, 
      endTime
    } = eventDetails
    
    const eventKey = isAllDay || !selectedTime 
      ? selectedDate 
      : `${selectedDate}T${selectedTime}`
    
    setEvents(prev => ({
      ...prev,
      [eventKey]: [...(prev[eventKey] || []), { 
        title, 
        time: selectedTime,
        endTime,
        description,
        location,
        color,
        isAllDay
      }]
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

  // Helper functions for date manipulation
  const getTimeRangeStr = (hour) => {
    return `${formatTime(hour, 0)} - ${formatTime(hour + 1, 0)}`;
  }

  return (
    <div className="min-h-screen flex bg-gray-50/80 overflow-hidden font-sans">
      {/* Mobile toggle button - matte styling */}
      <button 
        className="fixed z-40 bottom-6 left-6 md:hidden bg-blue-400/90 text-white p-4 rounded-2xl shadow-lg backdrop-blur-sm"
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
      />
      
      <div className="flex-1 flex flex-col">
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
        
        <div className="flex-1 overflow-auto">
          {viewMode === 'day' && (
            <DayView 
              dayViewDate={dayViewDate}
              events={events}
              currentTime={currentTime}
              handleOpenModal={handleOpenModal}
              handleDeleteEvent={handleDeleteEvent}
              handleDayClick={handleDayClick} // Make sure to pass this prop
              tasks={tasks || {}}
              handleToggleTaskCompletion={handleToggleTaskCompletion}
              handleDeleteTask={handleDeleteTask}
            />
          )}
          
          {viewMode === 'week' && (
            <WeekView 
              dayViewDate={dayViewDate || getDateStr(viewYear, viewMonth, today.getDate())}
              events={events}
              handleOpenModal={handleOpenModal}
              handleDayClick={handleDayClick}
              today={today}
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
            />
          )}
          
          {viewMode === 'year' && (
            <YearView 
              viewYear={viewYear}
              today={today}
              setViewMonth={setViewMonth}
              setViewMode={setViewMode}
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