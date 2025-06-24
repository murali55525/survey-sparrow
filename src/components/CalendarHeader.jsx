import React from 'react'

// Use props for all state and handlers needed from CalendarApp
export default function CalendarHeader(props) {
  const {
    viewMode,
    setViewMode,
    viewYear,
    viewMonth,
    dayViewDate,
    sidebarOpen,
    setSidebarOpen,
    today,
    handlePrevMonth,
    handleNextMonth,
  } = props

  return (
    <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3 shrink-0 bg-white/90 backdrop-blur-sm shadow-sm">
      <div className="flex items-center space-x-3">
        {/* Sidebar toggle for mobile - matte styling */}
        <button 
          className="md:hidden p-2 rounded-xl text-gray-600 bg-gray-50/80"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
        
        {/* Today button - matte styling */}
        <button 
          className="px-5 py-2 rounded-xl text-sm bg-white border border-gray-200 text-gray-700 shadow-sm"
          onClick={() => {
            setViewMonth(today.getMonth())
            setViewYear(today.getFullYear())
            setDayViewDate(getDateStr(today.getDate()))
            setViewMode('day')
          }}
        >
          Today
        </button>
        
        {/* Month navigation - matte styling */}
        <div className="flex items-center space-x-2">
          <button 
            className="p-2 bg-gray-50/80 rounded-xl" 
            onClick={handlePrevMonth}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-gray-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button 
            className="p-2 bg-gray-50/80 rounded-xl"
            onClick={handleNextMonth}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-gray-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
        
        {/* Month/Year display - matte styling */}
        <h2 className="text-xl font-normal text-gray-800 px-2 py-1 bg-white/50 rounded-md">
          {dayViewDate && viewMode !== 'year' 
            ? new Date(dayViewDate).toLocaleDateString('en-US', {
                weekday: viewMode === 'day' ? 'short' : undefined,
                month: 'long',
                day: 'numeric'
              })
            : viewMode === 'year' 
              ? viewYear 
              : `${new Date(viewYear, viewMonth).toLocaleString('default', { month: 'long' })} ${viewYear}`
          }
        </h2>
      </div>
      
      {/* View selector - matte styling */}
      <div className="flex items-center">
        <div className="relative">
          <div className="flex border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white/90">
            <button 
              className={`px-4 py-2 text-sm ${viewMode === 'day' ? 'bg-blue-400/20 text-blue-700' : 'bg-white/70 text-gray-700'}`}
              onClick={() => setViewMode('day')}
            >Day</button>
            <button 
              className={`px-4 py-2 text-sm ${viewMode === 'week' ? 'bg-blue-400/20 text-blue-700' : 'bg-white/70 text-gray-700'}`}
              onClick={() => setViewMode('week')}
            >Week</button>
            <button 
              className={`px-4 py-2 text-sm ${viewMode === 'month' ? 'bg-blue-400/20 text-blue-700' : 'bg-white/70 text-gray-700'}`}
              onClick={() => setViewMode('month')}
            >Month</button>
            <button 
              className={`px-4 py-2 text-sm ${viewMode === 'year' ? 'bg-blue-400/20 text-blue-700' : 'bg-white/70 text-gray-700'}`}
              onClick={() => setViewMode('year')}
            >Year</button>
          </div>
        </div>
      </div>
    </div>
  )
}