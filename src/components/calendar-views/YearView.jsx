import React from 'react'
import { getDaysInMonth, getFirstDayOfWeek } from '../../utils/dateUtils'

export default function YearView({ viewYear, today, setViewMonth, setViewMode }) {
  // Generate year view with mini calendars for each month
  const generateYearView = () => {
    const months = []
    
    for (let month = 0; month < 12; month++) {
      months.push(
        <div 
          key={`month-${month}`} 
          className="border border-gray-200/70 rounded-xl overflow-hidden shadow-sm bg-white/90 backdrop-blur-sm"
          onClick={() => {
            setViewMonth(month)
            setViewMode('month')
          }}
        >
          <div className="bg-blue-50/50 py-2 border-b border-gray-100/80">
            <h3 className="text-center text-sm font-medium text-gray-700">
              {new Date(viewYear, month).toLocaleString('default', { month: 'long' })}
            </h3>
          </div>
          <div className="p-2 bg-white/70">
            <div className="grid grid-cols-7 gap-1 text-[10px] text-gray-500 mb-1">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                <div key={d} className="text-center">{d}</div>
              ))}
            </div>
            {/* Month mini-calendar */}
            <div className="grid grid-cols-7 gap-1 mt-1">
              {(() => {
                const days = []
                const monthFirstDay = getFirstDayOfWeek(viewYear, month)
                const monthDaysCount = getDaysInMonth(viewYear, month)
                
                // Empty cells
                for (let i = 0; i < monthFirstDay; i++) {
                  days.push(<div key={`empty-${month}-${i}`} className="h-4" />)
                }
                
                // Day cells
                for (let day = 1; day <= monthDaysCount; day++) {
                  const isCurrentDate = 
                    day === today.getDate() &&
                    month === today.getMonth() &&
                    viewYear === today.getFullYear()
                  
                  days.push(
                    <div 
                      key={`day-${month}-${day}`}
                      className={`text-[10px] h-4 flex items-center justify-center ${
                        isCurrentDate ? 'bg-blue-400/90 text-white rounded-full shadow-sm' : ''
                      }`}
                    >
                      {day}
                    </div>
                  )
                }
                return days
              })()}
            </div>
          </div>
        </div>
      )
    }
    
    return months
  }

  return (
    <div className="grid grid-cols-3 md:grid-cols-4 gap-4 p-4 w-full bg-gray-50/40 backdrop-blur-sm">
      {generateYearView()}
    </div>
  )
}
