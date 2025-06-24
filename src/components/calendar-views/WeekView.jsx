import React from 'react'
import { formatTime } from '../../utils/dateUtils'

export default function WeekView({ dayViewDate, events, handleDayClick, handleOpenModal, today }) {
  // Generate week view
  const generateWeekView = () => {
    const weekDays = []
    const weekStart = dayViewDate ? new Date(dayViewDate) : new Date()
    weekStart.setDate(weekStart.getDate() - weekStart.getDay()) // Start from Sunday
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart)
      day.setDate(weekStart.getDate() + i)
      const dateStr = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`
      
      // Get events for this day
      const dayEvents = Object.entries(events)
        .filter(([key]) => key.startsWith(dateStr))
        .reduce((acc, [_, eventsArray]) => [...acc, ...eventsArray], [])
      
      const isToday = day.toDateString() === today.toDateString()
      
      weekDays.push(
        <div key={dateStr} className="flex flex-col flex-1">
          <div 
            className={`text-center py-2 cursor-pointer rounded-t-lg ${
              isToday ? 'bg-blue-50/80 text-blue-600 shadow-sm' : 'bg-gray-50/70 text-gray-600'
            }`}
            onClick={() => handleDayClick(dateStr)}
          >
            <div className="text-xs uppercase">{day.toLocaleString('default', { weekday: 'short' })}</div>
            <div className={`mx-auto mt-1 w-8 h-8 flex items-center justify-center rounded-full ${
              isToday ? 'bg-blue-400/80 text-white shadow-sm' : ''
            }`}>
              {day.getDate()}
            </div>
          </div>
          <div className="flex-1 border-r border-gray-100/70 p-2 bg-white/80">
            {dayEvents.map((event, idx) => (
              <div 
                key={idx} 
                className="text-xs p-2 my-1 bg-blue-50/90 rounded-lg text-blue-700 flex items-center shadow-sm"
              >
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-1.5"></div>
                <span className="truncate">{event.title}</span>
                {event.time && (
                  <span className="ml-auto text-blue-500 text-[10px] bg-blue-100/50 px-1.5 py-0.5 rounded-md">
                    {formatTime(parseInt(event.time.split(':')[0]))}
                  </span>
                )}
              </div>
            ))}
            <button 
              className="w-full h-6 mt-1 text-xs text-gray-400 flex items-center justify-center bg-gray-50/70 rounded-lg shadow-sm"
              onClick={() => handleOpenModal(dateStr)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3 mr-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add
            </button>
          </div>
        </div>
      )
    }
    
    return weekDays
  }

  return (
    <div className="flex h-full w-full border-t">
      {generateWeekView()}
    </div>
  )
}
