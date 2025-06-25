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
  setEvents, // <-- make sure setEvents is received as a prop
}) {
  // Define utility functions locally if they're not being properly imported or passed as props
  const getLocalDateStr = (day) => `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  
  // Check if a date is today
  const isCurrentDate = (day) => 
    day === today.getDate() &&
    viewMonth === today.getMonth() &&
    viewYear === today.getFullYear()

  // Generate mini calendar days - enhanced styling
  const generateMiniCalendarDays = () => {
    const days = []
    const miniFirstDay = getFirstDayOfWeek(viewYear, viewMonth)
    const miniDaysInMonth = getDaysInMonth(viewYear, viewMonth)
    
    for (let i = 0; i < miniFirstDay; i++) {
      days.push(<div key={`mini-empty-${i}`} className="h-9 w-9" />)
    }
    
    for (let day = 1; day <= miniDaysInMonth; day++) {
      const dateStr = getLocalDateStr(day)
      const isToday = isCurrentDate(day)
      const hasEvents = events[dateStr] && events[dateStr].length > 0
      
      days.push(
        <div 
          key={`mini-${day}`} 
          className={`group relative flex items-center justify-center h-9 w-9 text-sm font-semibold rounded-2xl cursor-pointer transition-all duration-300 transform hover:scale-110 hover:z-10 ${
            isToday 
              ? 'bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-600 text-white shadow-2xl ring-4 ring-blue-200/50 animate-pulse-gentle font-black' 
              : hasEvents
                ? 'bg-gradient-to-br from-blue-50 to-indigo-100 text-blue-800 hover:from-blue-100 hover:to-indigo-200 font-bold shadow-lg hover:shadow-xl border border-blue-200'
                : 'text-gray-700 hover:bg-gradient-to-br hover:from-gray-50 hover:to-gray-100 hover:shadow-lg hover:text-gray-900'
          }
          ${dayViewDate === dateStr ? 'ring-3 ring-purple-400 ring-opacity-60 bg-gradient-to-br from-purple-100 to-pink-100' : ''}`}
          onClick={() => handleDayClick(dateStr)}
        >
          <span className="relative z-10 transform group-hover:scale-110 transition-transform duration-200">{day}</span>
          
          {/* Enhanced today indicator with multiple layers */}
          {isToday && (
            <div className="absolute -top-1 -right-1">
              <div className="relative">
                <div className="w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-ping opacity-75"></div>
                <div className="absolute inset-0 w-4 h-4 bg-gradient-to-r from-yellow-300 to-orange-400 rounded-full animate-pulse"></div>
                <div className="absolute inset-1 w-2 h-2 bg-white rounded-full animate-bounce"></div>
              </div>
            </div>
          )}
          
          {/* Enhanced event indicator with glow effect */}
          {hasEvents && !isToday && (
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-1">
              <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full shadow-lg animate-pulse"></div>
              {events[dateStr].length > 1 && (
                <div className="w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-md animate-pulse" style={{ animationDelay: '0.3s' }}></div>
              )}
            </div>
          )}
          
          {/* Selected date indicator */}
          {dayViewDate === dateStr && !isToday && (
            <div className="absolute -top-1 -left-1">
              <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full animate-pulse shadow-lg"></div>
            </div>
          )}
          
          {/* Hover glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
        </div>
      )
    }
    
    return days
  }

  // Format time utility function if needed
  const formatTime = (hours, minutes = 0) => {
    return `${hours % 12 || 12}:${minutes.toString().padStart(2, '0')} ${hours >= 12 ? 'PM' : 'AM'}`
  }

  // Add state for new event creation
  const [showCreateEvent, setShowCreateEvent] = React.useState(false);
  const [eventName, setEventName] = React.useState('');
  const [eventDate, setEventDate] = React.useState('');
  const [eventTime, setEventTime] = React.useState('');

  // Helper for today's date in YYYY-MM-DD
  const getTodayStr = () => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  };

  // Handler for saving event (add or edit)
  const handleSaveEvent = () => {
    if (!eventName || !eventDate || !eventTime) return;
    if (typeof setEvents === 'function') {
      setEvents(prev => {
        const dateKey = eventDate;
        const timeKey = `${eventDate}T${eventTime}`;
        const eventObj = { title: eventName, time: eventTime };
        // Remove old event if editing
        let newPrev = { ...prev };
        if (editIdx !== null && editDate && editTime) {
          // Remove from dateKey and timeKey
          newPrev[editDate] = (newPrev[editDate] || []).filter((_, i) => i !== editIdx);
          newPrev[`${editDate}T${editTime}`] = (newPrev[`${editDate}T${editTime}`] || []).filter((_, i) => i !== editIdx);
        }
        // Add new/edited event
        return {
          ...newPrev,
          [dateKey]: [...(newPrev[dateKey] || []), eventObj],
          [timeKey]: [...(newPrev[timeKey] || []), eventObj],
        };
      });
    }
    setShowCreateEvent(false);
    setEventName('');
    setEventDate('');
    setEventTime('');
    setEditIdx(null);
    setEditDate('');
    setEditTime('');
  };

  // State for editing
  const [editIdx, setEditIdx] = React.useState(null);
  const [editDate, setEditDate] = React.useState('');
  const [editTime, setEditTime] = React.useState('');

  // Handler for editing event
  const handleEditEvent = (dateKey, idx) => {
    const event = events[dateKey][idx];
    setEventName(event.title);
    setEventDate(dateKey);
    setEventTime(event.time);
    setEditIdx(idx);
    setEditDate(dateKey);
    setEditTime(event.time);
    setShowCreateEvent(true);
  };

  // Handler for deleting event
  const handleDeleteEvent = (dateKey, idx) => {
    if (typeof setEvents === 'function') {
      setEvents(prev => {
        const timeKey = `${dateKey}T${(prev[dateKey][idx] && prev[dateKey][idx].time) || ''}`;
        const newPrev = { ...prev };
        newPrev[dateKey] = (newPrev[dateKey] || []).filter((_, i) => i !== idx);
        if (newPrev[timeKey]) {
          newPrev[timeKey] = newPrev[timeKey].filter((_, i) => i !== idx);
        }
        return newPrev;
      });
    }
  };

  return (
    <div 
      className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                 fixed md:static top-0 left-0 z-50 h-full
                 w-72 sm:w-80 md:w-64 lg:w-72 flex flex-col shrink-0
                 bg-white/95 md:bg-white/90 backdrop-blur-2xl transition-all duration-500 md:translate-x-0
                 shadow-2xl md:shadow-xl rounded-r-3xl border border-white/50 overflow-hidden`}
    >
      <div className="flex-1 overflow-y-auto p-3 sm:p-6">
        {/* Enhanced header with glassmorphism */}
        <div className="flex items-center mb-8 p-4 bg-gradient-to-r from-blue-50/80 to-purple-50/80 rounded-2xl border border-white/50 shadow-lg backdrop-blur-sm">
          <div className="relative">
            <svg className="w-8 h-8 mr-3 text-blue-500" viewBox="0 0 24 24">
              <path fill="currentColor" d="M20 3h-1V2h-2v1H7V2H5v1H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"></path>
              <path fill="#FFFFFF" d="M4 10h16v11H4z"></path>
            </svg>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
          </div>
          <h1 className="text-2xl text-gray-800 font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Calendar</h1>
        </div>
        
        {/* Enhanced create button */}
        <button 
          className="group mb-8 flex items-center justify-center px-6 py-4 rounded-2xl shadow-lg border border-white/50 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-sm transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:from-blue-600 hover:to-purple-700 relative overflow-hidden w-full"
          onClick={() => {
            setShowCreateEvent(true);
            setEventDate(getTodayStr());
            setEventTime('');
            setEventName('');
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-3 relative z-10" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path>
          </svg>
          <span className="relative z-10">Create Event</span>
        </button>

        {/* Create Event Modal */}
        {showCreateEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-xs p-6 border border-gray-200 relative flex flex-col items-center">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
                onClick={() => {
                  setShowCreateEvent(false);
                  setEditIdx(null);
                  setEditDate('');
                  setEditTime('');
                }}
                aria-label="Close"
              >
                ×
              </button>
              <h2 className="text-lg font-bold mb-4 text-gray-800 text-center">{editIdx !== null ? 'Edit Event' : 'Create Event'}</h2>
              <div className="mb-3 w-full">
                <label className="block text-xs font-semibold text-gray-600 mb-1">Event Name</label>
                <input
                  type="text"
                  className="w-full border border-gray-200 rounded px-2 py-1"
                  value={eventName}
                  onChange={e => setEventName(e.target.value)}
                  placeholder="Event name"
                  autoFocus
                />
              </div>
              <div className="mb-3 w-full">
                <label className="block text-xs font-semibold text-gray-600 mb-1">Date</label>
                <input
                  type="date"
                  className="w-full border border-gray-200 rounded px-2 py-1"
                  value={eventDate}
                  min={getTodayStr()}
                  onChange={e => setEventDate(e.target.value)}
                />
              </div>
              <div className="mb-4 w-full">
                <label className="block text-xs font-semibold text-gray-600 mb-1">Time</label>
                <input
                  type="time"
                  className="w-full border border-gray-200 rounded px-2 py-1"
                  value={eventTime}
                  onChange={e => setEventTime(e.target.value)}
                  step="900"
                />
              </div>
              <button
                className="w-full py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded font-bold shadow hover:shadow-lg"
                onClick={handleSaveEvent}
                disabled={!eventName || !eventDate || !eventTime}
              >
                {editIdx !== null ? 'Update Event' : 'Save Event'}
              </button>
            </div>
          </div>
        )}

        {/* Enhanced mini calendar */}
        <div className="mb-8 bg-gradient-to-br from-white/80 to-gray-50/80 p-5 rounded-3xl shadow-xl border border-white/50 backdrop-blur-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {new Date(viewYear, viewMonth).toLocaleString('default', { month: 'long' })} {viewYear}
            </h2>
            <div className="flex gap-2 bg-white/60 rounded-2xl p-1 shadow-inner">
              <button 
                className="group p-2 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 rounded-xl transition-all duration-300 hover:shadow-lg" 
                onClick={handlePrevMonth}
                aria-label="Previous month"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors duration-300">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
              <button 
                className="group p-2 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 rounded-xl transition-all duration-300 hover:shadow-lg"
                onClick={handleNextMonth}
                aria-label="Next month"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors duration-300">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Enhanced mini calendar grid */}
          <div className="w-full">
            <div className="grid grid-cols-7 gap-2 mb-3">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
                <div key={day + idx} className="text-center text-xs font-bold text-gray-500 h-6 flex items-center justify-center">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
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
              .map(([date, dateEvents]) =>
                dateEvents.map((event, idx) => (
                  <div key={`${date}-${idx}`} className="p-2 bg-gray-50 text-gray-700 rounded border-l-4 border-blue-400 flex items-center justify-between">
                    <div>
                      <div className="font-medium">{event.title}</div>
                      <div className="text-gray-500">
                        {new Date(date.split('T')[0]).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        {event.time && ` • ${event.time}`}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-2">
                      <button
                        className="text-blue-500 hover:text-blue-700"
                        onClick={() => handleEditEvent(date, idx)}
                        title="Edit"
                      >✏️</button>
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDeleteEvent(date, idx)}
                        title="Delete"
                      >🗑️</button>
                    </div>
                  </div>
                ))
              )
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
    </div>
  )
}