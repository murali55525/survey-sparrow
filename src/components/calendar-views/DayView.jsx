import React from 'react';
import { formatTime } from '../../utils/dateUtils';

export default function DayView({
  dayViewDate,
  events,
  currentTime,
  handleOpenModal,
  handleDeleteEvent,
  handleDayClick,
  tasks,
  handleToggleTaskCompletion,
  handleDeleteTask,
}) {
  // Error handling for missing date
  if (!dayViewDate) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center bg-white p-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-12 h-12 text-gray-400 mb-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 0 0121 11.25v7.5"
          />
        </svg>
        <h2 className="text-lg font-normal text-gray-700 mb-2">Please select a date</h2>
        <button
          className="mt-4 py-2 px-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => handleDayClick(new Date().toISOString().split('T')[0])}
        >
          Go to Today
        </button>
      </div>
    );
  }

  // Date parsing with fallback
  let dateObj;
  try {
    dateObj = new Date(dayViewDate);
    if (isNaN(dateObj.getTime())) {
      dateObj = new Date();
    }
  } catch (err) {
    dateObj = new Date();
  }

  const dateDisplay = dateObj.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const dayOfWeek = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
  const dayNumber = dateObj.getDate();

  // Get all-day events
  const allDayEvents = Object.entries(events || {})
    .filter(([key]) => key === dayViewDate)
    .reduce((acc, [_, events]) => [...acc, ...events], []);

  // Get tasks for this day
  const dayTasks = tasks[dayViewDate] || [];

  // Define colorful styles for different parts of the day
  const timeColorScheme = {
    morning: 'bg-gradient-to-r from-amber-50 to-yellow-50', // 6am-12pm
    afternoon: 'bg-gradient-to-r from-blue-50 to-sky-50',   // 12pm-6pm
    evening: 'bg-gradient-to-r from-indigo-50 to-violet-50', // 6pm-12am
    night: 'bg-gradient-to-r from-blue-900/5 to-indigo-900/5', // 12am-6am
  };

  // Get time period color scheme
  const getTimePeriodColor = (hour) => {
    if (hour >= 6 && hour < 12) return timeColorScheme.morning;
    if (hour >= 12 && hour < 18) return timeColorScheme.afternoon;
    if (hour >= 18) return timeColorScheme.evening;
    return timeColorScheme.night;
  };

  // Generate time slots for day view with more colors
  const generateTimeSlots = () => {
    if (!dayViewDate) return [];
    
    const slots = [];
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();
    
    for (let hour = 0; hour < 24; hour++) {
      const timeStr = `${String(hour).padStart(2, '0')}:00`;
      const eventKey = `${dayViewDate}T${timeStr}`;
      const isCurrentTimeHour =
        new Date(dayViewDate).toDateString() === currentTime.toDateString() &&
        hour === currentHour;
      const eventsAtThisTime = events[eventKey] || [];

      slots.push(
        <div 
          key={timeStr} 
          className={`flex border-b border-gray-200/60 relative ${getTimePeriodColor(hour)}`} 
          id={`hour-${hour}`}
        >
          {/* Time indicator */}
          <div className="w-12 py-2 text-right pr-2 text-xs text-gray-500">
            <div className="sticky top-0">
              {hour === 0 ? '' : formatTime(hour, 0)}
            </div>
          </div>

          {/* Event slot (main column) */}
          <div className="flex-1 min-h-[48px] relative">
            {/* Hover interaction zone */}
            <div className="absolute inset-0">
              <button
                className="absolute inset-0 w-full h-full opacity-0 hover:opacity-100"
                onClick={() => handleOpenModal(dayViewDate, `${String(hour).padStart(2, '0')}:00`)}
              >
                <div className="h-full flex items-center justify-center">
                  <div className="text-xs text-blue-600 flex items-center bg-blue-50 p-1 rounded-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-3 h-3 mr-1"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4.5v15m7.5-7.5h-15"
                      />
                    </svg>
                    <span className="font-medium">Add</span>
                  </div>
                </div>
              </button>
            </div>

            {/* Events display with gradient backgrounds */}
            {eventsAtThisTime.map((event, idx) => (
              <div 
                key={idx} 
                className="absolute left-1 right-3 bg-gradient-to-r from-blue-100 to-indigo-100 border-l-4 border-blue-600 text-blue-800 px-2 py-1 text-xs rounded-r-md shadow-sm"
                style={{
                  zIndex: 10,
                  top: '2px',
                  minHeight: '44px',
                }}
              >
                <div className="flex justify-between items-start h-full">
                  <div className="flex flex-col justify-between h-full overflow-hidden">
                    <span className="font-medium truncate">{event.title}</span>
                    <span className="text-xs text-blue-700 opacity-75">
                      {formatTime(parseInt(timeStr.split(':')[0]), 0)} –{' '}
                      {formatTime(parseInt(timeStr.split(':')[0]) + 1, 0)}
                    </span>
                  </div>
                  <div className="opacity-0 hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteEvent(eventKey, idx);
                      }}
                      className="text-gray-500 hover:text-gray-700 p-1"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-3 h-3"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Current time indicator with pulsing effect */}
          {isCurrentTimeHour && (
            <div 
              className="absolute left-0 right-0 flex items-center pointer-events-none" 
              style={{ top: `${currentMinute / 60 * 100}%`, zIndex: 20 }}
            >
              <div className="w-3 h-3 rounded-full ml-[10px] z-10 bg-red-500 shadow-md shadow-red-500/30 animate-pulse"></div>
              <div className="h-[2px] w-full z-10 bg-gradient-to-r from-red-500 to-red-400"></div>
            </div>
          )}
        </div>
      );
    }
    
    return slots;
  };

  return (
    <div className="w-full h-screen flex flex-col bg-white">
      {/* Header - Colorful Google Calendar style */}
      <div className="border-b border-gray-200 bg-gradient-to-r from-white to-gray-50 sticky top-0 z-30">
        {/* Date navigation */}
        <div className="px-4 h-16 flex justify-between items-center">
          <div className="flex items-center">
            <h2 className="text-xl font-normal text-gray-800">{dateDisplay}</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="text-sm px-4 py-2 rounded hover:bg-gray-100 text-blue-600 font-medium"
              onClick={() => {
                const todayStr = new Date().toISOString().split('T')[0];
                handleDayClick(todayStr);
              }}
            >
              Today
            </button>
            <div className="flex gap-1">
              <button
                className="p-2 hover:bg-gray-100 rounded-full"
                onClick={() => {
                  const prevDay = new Date(dateObj);
                  prevDay.setDate(prevDay.getDate() - 1);
                  const prevDayStr = prevDay.toISOString().split('T')[0];
                  handleDayClick(prevDayStr);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-4 h-4 text-gray-600"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 19.5L8.25 12l7.5-7.5"
                  />
                </svg>
              </button>
              <button
                className="p-2 hover:bg-gray-100 rounded-full"
                onClick={() => {
                  const nextDay = new Date(dateObj);
                  nextDay.setDate(nextDay.getDate() + 1);
                  const nextDayStr = nextDay.toISOString().split('T')[0];
                  handleDayClick(nextDayStr);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-4 h-4 text-gray-600"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Day indicator */}
        <div className="pl-16 pr-4 flex items-center border-t border-gray-200 h-14">
          <div className="flex items-center justify-center flex-col w-14 h-14">
            <span className="text-xs font-medium uppercase text-gray-600">{dayOfWeek}</span>
            <span className="text-2xl font-normal text-gray-800">{dayNumber}</span>
          </div>
        </div>
      </div>

      {/* Time grid container */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        {/* All-day events section */}
        {allDayEvents.length > 0 && (
          <div className="pl-12 pr-4 py-2 border-b border-gray-200">
            {allDayEvents.map((event, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center py-1 px-3 mb-1 bg-blue-100 border-l-4 border-blue-600 text-blue-800 text-xs rounded-sm"
                style={{ borderRadius: '0 3px 3px 0' }}
              >
                <span className="font-medium">{event.title}</span>
                <button
                  onClick={() => handleDeleteEvent(dayViewDate, idx)}
                  className="text-gray-500 hover:text-gray-700 p-1 opacity-0 hover:opacity-100 transition-opacity"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-3 h-3"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Tasks section */}
        {dayTasks.length > 0 && (
          <div className="pl-12 pr-4 py-2 border-b border-gray-200">
            {dayTasks.map((task) => (
              <div
                key={task.id}
                className="flex justify-between items-center py-1 px-3 mb-1 bg-green-50 text-gray-700 text-xs border-l-4 border-green-600 rounded-sm"
                style={{ borderRadius: '0 3px 3px 0' }}
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggleTaskCompletion(dayViewDate, task.id)}
                    className="mr-2 h-3 w-3 rounded text-green-600"
                  />
                  <span className={task.completed ? 'line-through text-gray-500' : ''}>
                    {task.title}
                  </span>
                </div>
                <button
                  onClick={() => handleDeleteTask(dayViewDate, task.id)}
                  className="text-gray-400 hover:text-gray-700 p-1 opacity-0 hover:opacity-100 transition-opacity"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-3 h-3"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Time slots */}
        <div className="relative">
          {/* Current time jump button */}
          {currentTime.toDateString() === new Date(dayViewDate || '').toDateString() && (
            <div className="sticky top-0 z-10 flex justify-end py-2 px-4 bg-white/95 border-b border-gray-100">
              <button
                className="text-xs px-3 py-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 flex items-center font-medium"
                onClick={() => {
                  const hourElement = document.getElementById(`hour-${currentTime.getHours()}`);
                  if (hourElement) {
                    hourElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-3.5 h-3.5 mr-1"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
                Current time
              </button>
            </div>
          )}

          {/* Time grid */}
          {generateTimeSlots()}
        </div>
      </div>

      {/* Google Calendar's FAB with gradient */}
      <button 
        className="fixed bottom-6 right-6 bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-4 rounded-full shadow-lg z-50 hover:shadow-xl"
        onClick={() => handleOpenModal(dayViewDate)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </button>
    </div>
  );
}