import React, { useState, useRef } from 'react'
import { Sun, Moon, Palette, Settings, Search, ChevronDown, ChevronUp } from 'lucide-react';

// Enhanced dropdown for view mode selection
const VIEW_MODES = [
  { label: 'Day', value: 'day' },
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' },
  { label: 'Year', value: 'year' },
];

const THEMES = [
  { label: 'Light', value: 'light', icon: <Sun className="w-4 h-4 text-yellow-500" /> },
  { label: 'Dark', value: 'dark', icon: <Moon className="w-4 h-4 text-indigo-700" /> },
  { label: 'System', value: 'system', icon: <Palette className="w-4 h-4 text-blue-500" /> },
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
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    // Get theme from localStorage or default to 'system'
    return localStorage.getItem('calendar-theme') || 'system';
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResultsOpen, setSearchResultsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const settingsRef = useRef(null);

  // Dummy event search results for demonstration
  const [eventResults, setEventResults] = useState([
    // { title: 'Team Meeting', date: '2024-06-01', time: '10:00' }
  ]);

  // Close dropdown on outside click
  React.useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setSettingsOpen(false);
      }
      if (!event.target.closest('.event-search-results')) {
        setSearchResultsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Enhanced theme switcher logic with proper dark mode implementation
  React.useEffect(() => {
    const applyTheme = (selectedTheme) => {
      const html = document.documentElement;
      
      if (selectedTheme === 'dark') {
        html.classList.add('dark');
        html.style.colorScheme = 'dark';
      } else if (selectedTheme === 'light') {
        html.classList.remove('dark');
        html.style.colorScheme = 'light';
      } else if (selectedTheme === 'system') {
        // Check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
          html.classList.add('dark');
          html.style.colorScheme = 'dark';
        } else {
          html.classList.remove('dark');
          html.style.colorScheme = 'light';
        }
      }
      
      // Save to localStorage
      localStorage.setItem('calendar-theme', selectedTheme);
    };

    applyTheme(theme);

    // Listen for system theme changes when using 'system' theme
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme('system');
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  // Dummy event search logic (replace with real search in your app)
  React.useEffect(() => {
    if (searchQuery.trim()) {
      // Simulate search results
      setEventResults([
        { title: 'Team Meeting', date: '2024-06-01', time: '10:00' },
        { title: 'Doctor Appointment', date: '2024-06-02', time: '15:00' },
        { title: 'Birthday Party', date: '2024-06-03', time: '19:00' },
      ].filter(e => e.title.toLowerCase().includes(searchQuery.toLowerCase())));
      setSearchResultsOpen(true);
    } else {
      setEventResults([]);
      setSearchResultsOpen(false);
    }
  }, [searchQuery]);

  const handleGoToToday = () => {
    if (setViewYear && today) {
      setViewYear(today.getFullYear());
      // Do NOT change month or view mode here
    }
  };

  // Enhanced theme change handler
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between border-b border-gray-100 dark:border-gray-700 px-2 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 shrink-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-sm relative z-40 transition-colors duration-300">
      <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-0">
        {/* Sidebar toggle for mobile - enhanced with dark mode */}
        <button 
          className="md:hidden p-2 rounded-xl text-gray-600 dark:text-gray-400 bg-gray-50/80 dark:bg-gray-800/80 hover:bg-gray-100/80 dark:hover:bg-gray-700/80 transition-colors duration-200"
          onClick={() => setSidebarOpen && setSidebarOpen(!sidebarOpen)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
        
        {/* Enhanced search with dark mode support */}
        <div className="relative flex items-center bg-gray-50/80 dark:bg-gray-800/80 rounded-full px-2 sm:px-3 md:px-4 py-2 border border-gray-200/60 dark:border-gray-600/60 min-w-0 sm:min-w-[180px] md:min-w-[280px] w-full sm:w-auto transition-colors duration-200">
          <Search className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent flex-1 text-sm text-gray-700 dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none"
            onFocus={() => setSearchResultsOpen(!!searchQuery)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setSearchQuery('');
                setSearchResultsOpen(false);
              }
            }}
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSearchResultsOpen(false);
              }}
              className="ml-2 p-1 hover:bg-gray-200/60 dark:hover:bg-gray-600/60 rounded-full transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 text-gray-500 dark:text-gray-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          {/* Enhanced search results with dark mode */}
          {searchResultsOpen && eventResults.length > 0 && (
            <div className="event-search-results absolute left-0 top-full mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-xl z-50 max-h-60 overflow-auto transition-colors duration-200">
              {eventResults.map((event, idx) => (
                <div
                  key={idx}
                  className="flex items-center px-4 py-2 hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                  onClick={() => {
                    setSearchResultsOpen(false);
                  }}
                >
                  <span className="font-semibold text-blue-700 dark:text-blue-400">{event.title}</span>
                  <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">
                    {event.date} {event.time}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Enhanced Settings Dropdown with dark mode */}
        <div className="relative z-[80]" ref={settingsRef}>
          <button
            className="p-2 bg-gray-50/80 dark:bg-gray-800/80 hover:bg-gray-100/80 dark:hover:bg-gray-700/80 rounded-full border border-gray-200/60 dark:border-gray-600/60 transition-all duration-200 hover:scale-105 flex items-center"
            onClick={() => setSettingsOpen((v) => !v)}
            aria-haspopup="menu"
            aria-expanded={settingsOpen}
            title="Settings"
          >
            <Settings className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <ChevronDown className={`w-4 h-4 ml-1 text-gray-600 dark:text-gray-400 transition-transform ${settingsOpen ? 'rotate-180' : ''}`} />
          </button>
          {settingsOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white/95 dark:bg-gray-800/95 border border-gray-200 dark:border-gray-600 rounded-xl shadow-2xl z-[90] animate-slide-up p-2 backdrop-blur-md transition-colors duration-200">
              <div className="mb-2 px-2 py-1 text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase">Theme</div>
              <div className="flex gap-2 mb-3">
                {THEMES.map(({ label, value, icon }) => (
                  <button
                    key={value}
                    className={`flex-1 flex flex-col items-center justify-center p-2 rounded-lg border transition-all duration-200 ${
                      theme === value 
                        ? 'bg-blue-100 dark:bg-blue-900/50 border-blue-400 dark:border-blue-500' 
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 border-transparent'
                    }`}
                    onClick={() => handleThemeChange(value)}
                  >
                    {React.cloneElement(icon, { 
                      className: `w-4 h-4 ${
                        value === 'light' ? 'text-yellow-500' :
                        value === 'dark' ? 'text-indigo-400' :
                        'text-blue-500'
                      }`
                    })}
                    <span className="text-xs mt-1 text-gray-700 dark:text-gray-300">{label}</span>
                  </button>
                ))}
              </div>
              <div className="mb-2 px-2 py-1 text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase">Preferences</div>
              <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">
                Notification Settings
              </button>
              <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">
                Calendar Integrations
              </button>
              <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">
                Keyboard Shortcuts
              </button>
              <div className="border-t border-gray-100 dark:border-gray-600 my-2"></div>
              <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">
                Help & Support
              </button>
            </div>
          )}
        </div>

        {/* Enhanced View selector with dark mode */}
        <div className="relative z-[70]" ref={dropdownRef}>
          <button
            className="flex items-center px-3 md:px-5 py-2 rounded-xl bg-gradient-to-r from-blue-400/20 to-purple-400/20 dark:from-blue-600/30 dark:to-purple-600/30 text-blue-700 dark:text-blue-400 font-bold shadow border border-blue-200/50 dark:border-blue-600/50 hover:scale-105 transition-all duration-200 text-sm md:text-base"
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
            <div className="absolute right-0 mt-2 w-36 md:w-40 bg-white/95 dark:bg-gray-800/95 border border-blue-100 dark:border-gray-600 rounded-xl shadow-2xl z-[80] animate-slide-up backdrop-blur-md transition-colors duration-200">
              {VIEW_MODES.map(({ label, value }) => (
                <button
                  key={value}
                  className={`w-full text-left px-4 md:px-5 py-2.5 md:py-3 text-sm md:text-base font-bold rounded-xl transition-all duration-150 ${
                    viewMode === value
                      ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-600/20 dark:to-purple-600/20 text-blue-700 dark:text-blue-400'
                      : 'hover:bg-blue-50/80 dark:hover:bg-gray-700/80 text-gray-700 dark:text-gray-300'
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