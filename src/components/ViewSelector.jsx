import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export default function ViewSelector({ currentView, setViewMode }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Google Calendar view options
  const viewOptions = [
    { id: 'day', label: 'Day' },
    { id: 'week', label: 'Week' },
    { id: 'month', label: 'Month' },
    { id: 'year', label: 'Year' }
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Get current view label
  const currentViewLabel = viewOptions.find(option => option.id === currentView)?.label || 'Month';

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Enhanced Google Calendar oval button with gradient */}
      <button 
        className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full flex items-center gap-2 text-sm font-semibold shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-300/50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="capitalize">{currentViewLabel}</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {/* Enhanced dropdown menu with glassmorphism */}
      {isOpen && (
        <div className="absolute mt-2 py-2 bg-white/90 backdrop-blur-md rounded-xl shadow-2xl border border-gray-200/50 z-20 min-w-[140px] transform animate-in slide-in-from-top-2 duration-200">
          {viewOptions.map((option) => (
            <button
              key={option.id}
              className={`w-full text-left px-4 py-3 text-sm transition-all duration-200 flex items-center space-x-2 ${
                currentView === option.id 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold' 
                  : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50'
              }`}
              onClick={() => {
                setViewMode(option.id);
                setIsOpen(false);
              }}
            >
              <span className="text-lg">
                {option.id === 'day' && '📋'}
                {option.id === 'week' && '📊'}
                {option.id === 'month' && '📅'}
                {option.id === 'year' && '🗓️'}
              </span>
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

