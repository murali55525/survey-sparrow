import React from 'react'
import { formatTime } from '../../utils/dateUtils'

export default function DayView({ 
  dayViewDate, 
  events, 
  currentTime, 
  handleOpenModal, 
  handleDeleteEvent,
  handleDayClick, // Make sure this prop is received
  tasks, 
  handleToggleTaskCompletion, 
  handleDeleteTask 
}) {
  // Add error handling and debugging
  if (!dayViewDate) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center bg-white/90 p-6 rounded-xl shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-blue-400 mb-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
        <h2 className="text-xl font-medium text-gray-700 mb-2">Please select a date to view</h2>
        <button 
          className="mt-4 px-4 py-2 bg-blue-400 text-white rounded-xl shadow-sm"
          onClick={() => handleDayClick(new Date().toISOString().split('T')[0])}
        >
          Go to Today
        </button>
      </div>
    );
  }
  
  // Add a try-catch for date parsing to prevent errors
  let dateObj;
  try {
    dateObj = new Date(dayViewDate);
    // Validate the date is valid
    if (isNaN(dateObj.getTime())) {
      console.error("Invalid date:", dayViewDate);
      dateObj = new Date(); // Fallback to today
    }
  } catch (err) {
    console.error("Error parsing date:", err);
    dateObj = new Date(); // Fallback to today
  }
  
  const dateDisplay = dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
  
  // Get all-day events
  const allDayEvents = Object.entries(events || {})
    .filter(([key]) => key === dayViewDate)
    .reduce((acc, [_, events]) => [...acc, ...events], [])

  // Get tasks for this day
  const dayTasks = tasks[dayViewDate] || [];
  
  // Generate time slots for day view
  const generateTimeSlots = () => {
    if (!dayViewDate) return []
    
    const slots = []
    const currentHour = currentTime.getHours()
    const currentMinute = currentTime.getMinutes()
    
    for (let hour = 0; hour < 24; hour++) {
      const timeStr = `${String(hour).padStart(2, '0')}:00`
      const eventKey = `${dayViewDate}T${timeStr}`
      const isCurrentTimeHour = 
        new Date(dayViewDate).toDateString() === currentTime.toDateString() && 
        hour === currentHour
      
      const eventsAtThisTime = events[eventKey] || []
      
      slots.push(
        <div 
          key={timeStr} 
          className="flex border-b border-gray-100/80 relative" 
          id={`hour-${hour}`}
        >
          {/* Time indicator on the left */}
          <div className="w-16 py-3 text-right pr-3 text-xs text-gray-500 relative">
            <div className="sticky top-0">
              {formatTime(hour, 0)}
            </div>
          </div>
          
          {/* Event grid with 30-minute slots - matte effect, no hover */}
          <div className="flex-1 min-h-[60px] grid grid-rows-2 relative">
            {/* Top half hour */}
            <div className="border-b border-dashed border-gray-100/80 relative">
              {hour > 0 && hour % 3 === 0 && (
                <div className="absolute -left-16 top-0 text-[10px] text-gray-400">
                  {formatTime(hour, 0)}
                </div>
              )}
              
              {/* Event placeholder - matte effect, no hover */}
              <div className="absolute inset-0 bg-gray-50/10 rounded-md">
                <div className="h-full flex items-center justify-center">
                  <button
                    className="text-xs text-gray-400 flex items-center bg-gray-50/80 p-1.5 rounded-lg"
                    onClick={() => handleOpenModal(dayViewDate, `${String(hour).padStart(2, '0')}:00`)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 mr-1">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add
                  </button>
                </div>
              </div>
            </div>
            
            {/* Bottom half hour */}
            <div className="relative">
              {/* Event placeholder - matte effect, no hover */}
              <div className="absolute inset-0 bg-gray-50/10 rounded-md">
                <div className="h-full flex items-center justify-center">
                  <button
                    className="text-xs text-gray-400 flex items-center bg-gray-50/80 p-1.5 rounded-lg"
                    onClick={() => handleOpenModal(dayViewDate, `${String(hour).padStart(2, '0')}:30`)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 mr-1">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* Events overlay - matte effect, no hover */}
            {eventsAtThisTime.map((event, idx) => (
              <div 
                key={idx} 
                className="absolute left-0 right-0 ml-1 mr-3 bg-blue-400/90 text-white rounded-xl px-3 py-2 text-sm shadow-sm"
                style={{
                  zIndex: 10,
                  top: '2px',
                  minHeight: '56px',
                  backgroundColor: event.color ? `${event.color}CC` : '#60A5FACC' // Semi-transparent for matte effect
                }}
              >
                <div className="flex justify-between items-start h-full">
                  <div className="flex flex-col justify-between h-full">
                    <span className="font-medium">{event.title}</span>
                    <span className="text-xs text-blue-50">{formatTime(parseInt(timeStr.split(':')[0]), 0)} - {formatTime(parseInt(timeStr.split(':')[0])+1, 0)}</span>
                  </div>
                  <div className="flex space-x-2">
                    {/* Edit button - matte effect, no hover */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Edit functionality could be added here
                      }}
                      className="text-white/80 bg-blue-300/30 p-1 rounded-lg"
                      title="Edit"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                      </svg>
                    </button>
                    {/* Delete button - matte effect, no hover */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteEvent(eventKey, idx);
                      }}
                      className="text-white/80 bg-blue-300/30 p-1 rounded-lg"
                      title="Delete"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Current time indicator with matte styling */}
          {isCurrentTimeHour && (
            <div 
              className="absolute left-0 right-0 flex items-center pointer-events-none" 
              style={{ top: `${currentMinute / 60 * 100}%`, zIndex: 20 }}
            >
              {/* Time label on the left - matte styling */}
              <div className="absolute -left-[60px] -translate-y-1/2 text-xs whitespace-nowrap z-10 font-medium text-red-500 bg-white/90 px-2 py-1 shadow-sm rounded-md backdrop-blur-sm">
                {formatTime(currentHour, currentMinute)}
              </div>
              
              {/* Red dot - softer red for matte effect */}
              <div className="w-4 h-4 rounded-full ml-[13px] z-10 shadow-sm bg-red-400 animate-pulse"></div>
              
              {/* Red line - softer red for matte effect */}
              <div className="h-[2px] w-full z-10 shadow-sm bg-red-400"></div>
            </div>
          )}
        </div>
      );
    }
    
    return slots
  }

  return (
    <div className="w-full h-full flex flex-col relative">
      {/* Header section - with matte styling and more rounded corners */}
      <div className="absolute top-0 left-0 right-0 z-30 bg-white border-b shadow-sm rounded-b-xl">
        {/* Date display */}
        <div className="py-4 px-5 flex justify-between items-center">
          <h2 className="text-xl font-medium text-gray-800">{dateDisplay}</h2>
          <div className="flex items-center gap-3">
            {/* Today button - matte styling */}
            <button 
              className="text-sm px-4 py-2 border border-gray-200 rounded-xl bg-gray-50/80 text-gray-700 shadow-sm"
              onClick={() => {
                const todayStr = new Date().toISOString().split('T')[0];
                handleDayClick(todayStr);
              }}
            >
              Today
            </button>
            <div className="flex gap-2">
              {/* Navigation buttons - matte styling */}
              <button 
                className="text-sm px-3 py-2 border border-gray-200 rounded-xl bg-gray-50/80 text-gray-700"
                onClick={() => {
                  // Navigate to previous day
                  const prevDay = new Date(dateObj)
                  prevDay.setDate(prevDay.getDate() - 1)
                  const prevDayStr = prevDay.toISOString().split('T')[0]
                  handleDayClick(prevDayStr)
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
              <button 
                className="text-sm px-3 py-2 border border-gray-200 rounded-xl bg-gray-50/80 text-gray-700"
                onClick={() => {
                  // Navigate to next day
                  const nextDay = new Date(dateObj)
                  nextDay.setDate(nextDay.getDate() + 1)
                  const nextDayStr = nextDay.toISOString().split('T')[0]
                  handleDayClick(nextDayStr)
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* All-day events section - with matte styling */}
        <div className="px-5 py-3 border-t border-gray-100">
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <span>All day</span>
            <button 
              className="ml-2 p-1.5 bg-gray-50 rounded-lg"
              onClick={() => handleOpenModal(dayViewDate)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </button>
          </div>
          
          <div className="space-y-2 mb-3">
            {allDayEvents.length === 0 ? 
              <div className="text-xs text-gray-400 italic">No all-day events</div>
              : 
              allDayEvents.map((event, idx) => (
                <div 
                  key={idx} 
                  className="flex justify-between items-center py-2 px-3 bg-blue-50/80 text-blue-700 text-xs rounded-xl shadow-sm"
                >
                  <span>{event.title}</span>
                  <button
                    onClick={() => handleDeleteEvent(dayViewDate, idx)}
                    className="text-blue-400 bg-blue-100/50 p-1 rounded-lg"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))
            }
          </div>
        </div>
        
        {/* Tasks section */}
        <div className="px-5 py-3 border-t border-gray-100">
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <span>Tasks</span>
            <button 
              className="ml-2 p-1.5 bg-green-50 rounded-lg text-green-500"
              onClick={() => handleOpenModal(dayViewDate, '', true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </button>
          </div>
          
          <div className="space-y-2 mb-3">
            {dayTasks.length === 0 ? 
              <div className="text-xs text-gray-400 italic">No tasks for today</div>
              : 
              dayTasks.map((task) => (
                <div 
                  key={task.id} 
                  className="flex justify-between items-center py-2 px-3 bg-green-50/80 text-gray-700 text-xs rounded-xl shadow-sm"
                >
                  <div className="flex items-center">
                    <button
                      className={`w-5 h-5 rounded-full border ${task.completed ? 'bg-green-400 border-green-500' : 'border-gray-300'} mr-2 flex items-center justify-center`}
                      onClick={() => handleToggleTaskCompletion(dayViewDate, task.id)}
                    >
                      {task.completed && (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-3 h-3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      )}
                    </button>
                    <span className={task.completed ? 'line-through text-gray-500' : ''}>
                      {task.title}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteTask(dayViewDate, task.id)}
                    className="text-gray-400 bg-gray-100/60 p-1 rounded-lg"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))
            }
          </div>
        </div>
        
        {/* Current time indicator with matte styling */}
        <div className="py-3 border-t border-gray-100 flex items-center justify-center bg-white">
          <div className="flex items-center bg-red-50 rounded-2xl px-5 py-2 shadow-sm">
            <div className="w-3 h-3 bg-red-400 rounded-full mr-3 animate-pulse"></div>
            <span className="text-red-700 font-medium flex items-center text-sm">
              <span className="mr-2">Current Time:</span>
              <span className="bg-red-400 text-white py-1 px-3 rounded-xl font-medium">
                {formatTime(currentTime.getHours(), currentTime.getMinutes())}
              </span>
            </span>
          </div>
        </div>
      </div>
      
      {/* Scrollable container - with matte styling */}
      <div 
        id="day-view-scrollable"
        className="absolute top-[230px] bottom-0 left-0 right-0 overflow-auto"
        style={{ 
          scrollbarWidth: 'thin',
          scrollbarColor: '#CBD5E0 #F7FAFC'
        }}
      >
        {/* Current time button - matte styling */}
        {currentTime.toDateString() === new Date(dayViewDate || '').toDateString() && (
          <div className="sticky top-0 z-10 flex justify-end mb-4 px-4 py-3 bg-white/90 backdrop-blur-md">
            <button 
              className="text-sm bg-blue-400 text-white px-4 py-2 rounded-xl shadow-sm flex items-center"
              onClick={() => {
                const hourElement = document.getElementById(`hour-${currentTime.getHours()}`);
                if (hourElement) {
                  hourElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              Go to current time
            </button>
          </div>
        )}

        {/* Time grid - softer styling */}
        <div className="mx-5 relative" style={{ height: "1440px" }}>
          {/* Time slots */}
          {generateTimeSlots()}
        </div>
      </div>

      {/* Help message - matte styling */}
      <div className="fixed bottom-4 right-4 bg-gray-700/80 text-white px-4 py-2.5 rounded-xl text-sm z-50 backdrop-blur-sm shadow-md">
        Scroll the time slots
      </div>

      {/* Floating action button - matte styling */}
      <button 
        className="fixed bottom-16 right-4 bg-blue-400 text-white p-4 rounded-2xl shadow-md z-50"
        onClick={() => {
          const hourElement = document.getElementById(`hour-${currentTime.getHours()}`);
          if (hourElement) {
            hourElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Add visual indicator for the scroll target
            hourElement.classList.add('bg-blue-50');
            setTimeout(() => hourElement.classList.remove('bg-blue-50'), 2000);
          }
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      </button>
    </div>
  )
}

