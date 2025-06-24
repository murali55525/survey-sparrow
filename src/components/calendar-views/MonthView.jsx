import React from 'react'
import { getDaysInMonth, getFirstDayOfWeek, getDateStr } from '../../utils/dateUtils'

export default function MonthView({ viewYear, viewMonth, events, today, handleDayClick, handleOpenModal }) {
  const daysInMonth = getDaysInMonth(viewYear, viewMonth)
  const firstDay = getFirstDayOfWeek(viewYear, viewMonth)

  // Helper function to check if date is today
  const isCurrentDate = (day) => 
    day === today.getDate() &&
    viewMonth === today.getMonth() &&
    viewYear === today.getFullYear()

  // Generate calendar cells
  const renderCalendarCells = () => {
    const cells = []
    
    // Empty cells for days before the 1st of the month
    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={`empty-${i}`} className="bg-gray-50/20" />)
    }
    
    // Day cells
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = getDateStr(viewYear, viewMonth, day)
      const isToday = isCurrentDate(day)
      
      // Get events for this day
      const dayEvents = Object.entries(events)
        .filter(([key]) => key.startsWith(dateStr))
        .reduce((acc, [_, eventsArray]) => [...acc, ...eventsArray], [])
        
      cells.push(
        <div
          key={dateStr}
          className={`border border-gray-100/50 p-2 min-h-[80px] md:min-h-[100px] flex flex-col relative transition-all duration-200 cursor-pointer ${
            isToday 
              ? 'bg-blue-50/50 border-blue-200/70 rounded-lg' 
              : 'bg-white/80 rounded-md'
          }`}
          onClick={() => handleDayClick(dateStr)}
        >
          <div className="flex items-center justify-between">
            <span className={`flex items-center justify-center h-7 w-7 text-sm rounded-xl ${
              isToday ? 'bg-blue-400/90 text-white font-medium shadow-sm' : 'text-gray-700 bg-gray-50/50'
            }`}>
              {day}
            </span>
            <button
              className="w-6 h-6 flex items-center justify-center text-gray-400 bg-gray-50/70 rounded-lg"
              onClick={(e) => {
                e.stopPropagation()
                handleOpenModal(dateStr)
              }}
              title="Add event"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </button>
          </div>
          
          <div className="flex flex-col gap-1 overflow-y-auto max-h-[70px] text-xs mt-2">
            {dayEvents.map((e, idx) => (
              <div 
                key={idx} 
                className="flex items-center py-1 px-2 rounded-lg bg-blue-50/90 text-blue-700 text-xs shadow-sm"
                onClick={(ev) => ev.stopPropagation()}
              >
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-1.5"></div>
                <span className="truncate">{e.title}</span>
              </div>
            ))}
          </div>
        </div>
      )
    }
    
    return cells
  }

  return (
    <div className="w-full h-full flex flex-col">
      {/* Weekdays Header - matte styling */}
      <div className="grid grid-cols-7 w-full border-b border-gray-200/70 bg-white/70 backdrop-blur-sm">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
          <div key={day} className="text-center py-3 text-xs font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid - matte styling */}
      <div className="grid grid-cols-7 w-full flex-1 bg-white/50 backdrop-blur-sm shadow-inner">
        {renderCalendarCells()}
      </div>
    </div>
  )
}
