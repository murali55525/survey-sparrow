import React, { useState, useRef } from 'react'
import { Search, Settings } from 'lucide-react'

// Enhanced dropdown for view mode selection
const VIEW_MODES = [
  { label: 'Day', value: 'day' },
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' },
  { label: 'Year', value: 'year' },
];

export default function CalendarHeader({
  setViewMonth,
  setViewYear,
  setViewMode,
  today,
  viewMode,
  viewYear,
  viewMonth,
  dayViewDate,
  sidebarOpen,
  setSidebarOpen,
  handlePrevMonth,
  handleNextMonth,
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  React.useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  const handleGoToToday = () => {
    if (setViewYear && today) {
      setViewYear(today.getFullYear());
      // Do NOT change month or view mode here
    }
  };

  return (
    <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3 shrink-0 bg-white/90 backdrop-blur-sm shadow-sm relative z-[60]">
      <div className="flex items-center space-x-3">
        {/* Sidebar toggle for mobile - matte styling */}
        <button 
          className="md:hidden p-2 rounded-xl text-gray-600 bg-gray-50/80"
          onClick={() => setSidebarOpen && setSidebarOpen(!sidebarOpen)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
        
        {/* Permanent search functionality */}
        <div className="flex items-center bg-gray-50/80 rounded-full px-4 py-2 border border-gray-200/60 min-w-[280px]">
          <Search className="w-4 h-4 text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent flex-1 text-sm text-gray-700 placeholder-gray-500 focus:outline-none"
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setSearchQuery('');
              }
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="ml-2 p-1 hover:bg-gray-200/60 rounded-full transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 text-gray-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        {/* Settings button */}
        <button className="p-2.5 bg-gray-50/80 hover:bg-gray-100/80 rounded-full border border-gray-200/60 transition-all duration-200 hover:scale-105">
          <Settings className="w-4 h-4 text-gray-600" />
        </button>

        {/* View selector - dropdown glassy/futuristic */}
        <div className="relative z-[70]" ref={dropdownRef}>
          <button
            className="flex items-center px-5 py-2 rounded-xl bg-gradient-to-r from-blue-400/20 to-purple-400/20 text-blue-700 font-bold shadow border border-blue-200/50 hover:scale-105 transition-all duration-200"
            onClick={() => setDropdownOpen((v) => !v)}
            aria-haspopup="listbox"
            aria-expanded={dropdownOpen}
          >
            <span className="mr-2">{VIEW_MODES.find(vm => vm.value === viewMode)?.label || 'View'}</span>
            <svg className={`w-4 h-4 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white/95 border border-blue-100 rounded-xl shadow-2xl z-[80] animate-slide-up">
              {VIEW_MODES.map(({ label, value }) => (
                <button
                  key={value}
                  className={`w-full text-left px-5 py-3 text-base font-bold rounded-xl transition-all duration-150 ${
                    viewMode === value
                      ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-700'
                      : 'hover:bg-blue-50/80 text-gray-700'
                  }`}
                  onClick={() => {
                    setViewMode(value);
                    setDropdownOpen(false);
                  }}
                  aria-selected={viewMode === value}
                  role="option"
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}