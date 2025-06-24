import React from 'react'
import { getDaysInMonth, getFirstDayOfWeek, getDateStr } from '../utils/dateUtils'

export default function Sidebar({ 
  sidebarOpen, 
  setSidebarOpen, 
  viewYear, 
  viewMonth, 
  dayViewDate, 
  handleDayClick, 
  handlePrevMonth, 
  handleNextMonth, 
  handleOpenModal,
  events,
  today,
  tasks,
  handleToggleTaskCompletion,
  handleDeleteTask,
}) {
  // Define utility functions locally if they're not being properly imported or passed as props
  const getLocalDateStr = (day) => `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  
  // Check if a date is today
  const isCurrentDate = (day) => 
    day === today.getDate() &&
    viewMonth === today.getMonth() &&
    viewYear === today.getFullYear()

  // Generate mini calendar days - fixed to use proper function names
  const generateMiniCalendarDays = () => {
    const days = []
    const miniFirstDay = getFirstDayOfWeek(viewYear, viewMonth)
    // Fix: change getDaysInMonth2 to getDaysInMonth
    const miniDaysInMonth = getDaysInMonth(viewYear, viewMonth)
    
    for (let i = 0; i < miniFirstDay; i++) {
      days.push(<div key={`mini-empty-${i}`} className="h-8 w-8" />)
    }
    
    for (let day = 1; day <= miniDaysInMonth; day++) {
      // Fix: Use local function instead of missing getDateStr
      const dateStr = getLocalDateStr(day)
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
  
  // Format time utility function if needed
  const formatTime = (hours, minutes = 0) => {
    return `${hours % 12 || 12}:${minutes.toString().padStart(2, '0')} ${hours >= 12 ? 'PM' : 'AM'}`
  }

  return (
    <div 
      className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                 fixed md:static top-0 left-0 z-20 h-full
                 w-64 md:w-64 lg:w-72 p-5 flex flex-col border-r border-gray-100 shrink-0 overflow-y-auto
                 bg-white/95 md:bg-white/80 backdrop-blur-md transition-transform duration-300 md:translate-x-0
                 shadow-md md:shadow-sm rounded-r-2xl`}
    >
      {/* Google-styled header - matte styling */}
      <div className="flex items-center mb-6 pl-1">
        <svg className="w-6 h-6 mr-2 text-blue-400" viewBox="0 0 24 24">
          <path fill="currentColor" d="M20 3h-1V2h-2v1H7V2H5v1H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"></path>
          <path fill="#FFFFFF" d="M4 10h16v11H4z"></path>
        </svg>
        <h1 className="text-xl text-gray-700 font-medium">Calendar</h1>
      </div>
      
      {/* Create button - matte styling */}
      <button 
        className="mb-6 flex items-center justify-center px-6 py-3 rounded-xl shadow-sm border border-gray-200 bg-white/80 text-sm"
        onClick={() => {
          // Use local function
          handleOpenModal(dayViewDate || getLocalDateStr(today.getDate()));
          setSidebarOpen(false);
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-3 text-blue-400" viewBox="0 0 24 24">
          <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path>
        </svg>
        <span className="text-gray-700">Create</span>
      </button>
      
      {/* Mini calendar - matte styling */}
      <div className="mb-6 bg-white/70 p-3 rounded-xl shadow-sm border border-gray-100">
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
      
      {/* My Calendars section - matte styling */}
      <div className="mb-4 bg-white/70 p-3 rounded-xl shadow-sm">
        <h3 className="text-sm font-medium text-gray-700 mb-3">My calendars</h3>
        <div className="space-y-2">
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

      {/* Tasks section */}
      <div className="mb-4 bg-white/70 p-4 rounded-xl shadow-sm border border-gray-100/80">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-700">My Tasks</h3>
          <button
            className="p-1.5 bg-green-50 text-green-500 rounded-lg"
            onClick={() => handleOpenModal(new Date().toISOString().split('T')[0], '', true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-2 max-h-[200px] overflow-y-auto">
          {Object.keys(tasks || {}).length === 0 ? (
            <div className="text-xs text-gray-400 italic p-2">No tasks yet</div>
          ) : (
            Object.entries(tasks).map(([dateKey, tasksList]) => (
              tasksList.map(task => (
                <div 
                  key={task.id} 
                  className="flex items-center justify-between p-2 bg-green-50/80 rounded-lg text-xs"
                >
                  <div className="flex items-center">
                    <button
                      className={`w-5 h-5 rounded-full border ${task.completed ? 'bg-green-400 border-green-500' : 'border-gray-300'} mr-2 flex items-center justify-center`}
                      onClick={() => handleToggleTaskCompletion(dateKey, task.id)}
                    >
                      {task.completed && (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-3 h-3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      )}
                    </button>
                    <span className={task.completed ? 'line-through text-gray-500' : 'text-gray-700'}>
                      {task.title}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-400 mr-2 text-[10px]">
                      {new Date(dateKey).toLocaleDateString('default', { month: 'short', day: 'numeric' })}
                    </span>
                    <button
                      onClick={() => handleDeleteTask(dateKey, task.id)}
                      className="text-gray-400 bg-gray-100/60 p-1 rounded-lg"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
             ))
            )).flat()
          )}
        </div>
      </div>

      {/* Upcoming Events section */}
      <div className="mt-4 border-t border-gray-100 pt-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Upcoming events</h3>
        <div className="text-xs space-y-2 max-h-[180px] overflow-auto">
          {Object.entries(events || {})
            .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
            .slice(0, 3)
            .map(([date, dateEvents]) => dateEvents.map((event, idx) => (
              <div key={`${date}-${idx}`} className="p-2 bg-gray-50 text-gray-700 rounded border-l-4 border-blue-400">
                <div className="font-medium">{event.title}</div>
                <div className="text-gray-500">
                  {new Date(date.split('T')[0]).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  {event.time && ` • ${formatTime(parseInt(event.time.split(':')[0]), 0)}`}
                </div>
              </div>
            )))
            .flat()
          }
        </div>
      </div>

      {/* Keyboard shortcuts section */}
      <div className="mt-4 border-t border-gray-100 pt-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Keyboard shortcuts</h3>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-600">Today</span>
            <span className="text-gray-500 font-mono">T</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Day view</span>
            <span className="text-gray-500 font-mono">1</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Week view</span>
            <span className="text-gray-500 font-mono">2</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Month view</span>
            <span className="text-gray-500 font-mono">3</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Create event</span>
            <span className="text-gray-500 font-mono">C</span>
          </div>
        </div>
      </div>
    </div>
  )
}