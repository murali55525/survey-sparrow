import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { getDaysInMonth, getFirstDayOfWeek } from '../../utils/dateUtils';
import ViewSelector from '../ViewSelector';

export default function YearView({ viewYear, today, setViewMonth, setViewMode, events = {}, viewMode, setViewYear, onDateClick, selectedDate }) {
  // Soft, elegant themes
  const themes = {
    gentle: {
      months: [
        { bg: 'from-blue-100 to-blue-200', light: 'from-blue-50 to-blue-100', accent: 'bg-blue-400', text: 'text-blue-700', border: 'border-blue-200' },
        { bg: 'from-emerald-100 to-emerald-200', light: 'from-emerald-50 to-emerald-100', accent: 'bg-emerald-400', text: 'text-emerald-700', border: 'border-emerald-200' },
        { bg: 'from-amber-100 to-amber-200', light: 'from-amber-50 to-amber-100', accent: 'bg-amber-400', text: 'text-amber-700', border: 'border-amber-200' },
        { bg: 'from-pink-100 to-pink-200', light: 'from-pink-50 to-pink-100', accent: 'bg-pink-400', text: 'text-pink-700', border: 'border-pink-200' },
        { bg: 'from-purple-100 to-purple-200', light: 'from-purple-50 to-purple-100', accent: 'bg-purple-400', text: 'text-purple-700', border: 'border-purple-200' },
        { bg: 'from-orange-100 to-orange-200', light: 'from-orange-50 to-orange-100', accent: 'bg-orange-400', text: 'text-orange-700', border: 'border-orange-200' },
        { bg: 'from-cyan-100 to-cyan-200', light: 'from-cyan-50 to-cyan-100', accent: 'bg-cyan-400', text: 'text-cyan-700', border: 'border-cyan-200' },
        { bg: 'from-red-100 to-red-200', light: 'from-red-50 to-red-100', accent: 'bg-red-400', text: 'text-red-700', border: 'border-red-200' },
        { bg: 'from-teal-100 to-teal-200', light: 'from-teal-50 to-teal-100', accent: 'bg-teal-400', text: 'text-teal-700', border: 'border-teal-200' },
        { bg: 'from-indigo-100 to-indigo-200', light: 'from-indigo-50 to-indigo-100', accent: 'bg-indigo-400', text: 'text-indigo-700', border: 'border-indigo-200' },
        { bg: 'from-lime-100 to-lime-200', light: 'from-lime-50 to-lime-100', accent: 'bg-lime-400', text: 'text-lime-700', border: 'border-lime-200' },
        { bg: 'from-rose-100 to-rose-200', light: 'from-rose-50 to-rose-100', accent: 'bg-rose-400', text: 'text-rose-700', border: 'border-rose-200' }
      ]
    }
  };

  // Get event statistics for each month (simplified)
  const getEventStats = (year, month) => {
    const monthEvents = Object.keys(events).filter(dateKey => {
      const eventDate = new Date(dateKey.split('T')[0]);
      return eventDate.getFullYear() === year && eventDate.getMonth() === month;
    });
    
    const totalEvents = monthEvents.reduce((sum, dateKey) => sum + events[dateKey].length, 0);
    return { totalEvents };
  };

  // Helper to check if a month is the current month
  const isCurrentMonth = (month) => {
    return (
      today.getFullYear() === viewYear &&
      today.getMonth() === month
    );
  };

  // Enhanced month view with colorful design and animations
  const generateMonthView = (month) => {
    const colorSet = themes.colorful.months[month];
    const { totalEvents } = getEventStats(viewYear, month);
    const isCurrentMonthHighlight = isCurrentMonth(month);
    
    return (
      <div
        key={`month-${month}`}
        className={`relative cursor-pointer transform transition-all duration-300 hover:scale-105 hover:z-10 ${
          isCurrentMonthHighlight ? 'ring-4 ring-yellow-400 ring-opacity-60 scale-105' : ''
        }`}
        onClick={() => {
          setViewMonth(month);
          setViewMode('month');
        }}
      >
        {/* Animated glow effect */}
        <div className={`absolute -inset-1 bg-gradient-to-r ${colorSet.bg} rounded-2xl blur opacity-20 transition-opacity duration-300 group-hover:opacity-40`}></div>
        
        {/* Main card with enhanced styling */}
        <div className={`relative bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 transition-all duration-300 ${colorSet.shadow} hover:shadow-xl`}>
          {/* Colorful header */}
          <div className={`relative bg-gradient-to-r ${colorSet.bg} px-4 py-3`}>
            <div className="flex items-center justify-between">
              <h3 className="text-white font-bold text-sm tracking-wide">
                {new Date(viewYear, month).toLocaleString('default', { month: 'long' })}
              </h3>
              {totalEvents > 0 && (
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-2 py-1 animate-pulse">
                  <span className="text-white text-xs font-medium">{totalEvents}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Enhanced calendar grid */}
          <div className={`p-3 bg-gradient-to-br ${colorSet.light}`}>
            {/* Weekday headers with colors */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                <div key={day + i} className={`text-center text-[10px] font-semibold ${
                  i === 0 || i === 6 ? 'text-red-500' : colorSet.text
                }`}>
                  {day}
                </div>
              ))}
            </div>
            
            {/* Enhanced days grid */}
            <div className="grid grid-cols-7 gap-1">
              {(() => {
                const days = [];
                const firstDay = getFirstDayOfWeek(viewYear, month);
                const daysInMonth = getDaysInMonth(viewYear, month);
                
                // Empty cells for previous month
                for (let i = 0; i < firstDay; i++) {
                  days.push(<div key={`empty-${i}`} className="h-6" />);
                }
                
                // Current month days with colorful styling
                for (let day = 1; day <= daysInMonth; day++) {
                  const date = new Date(viewYear, month, day);
                  const dateStr = date.toISOString().split('T')[0];
                  const hasEvents = events[dateStr] && events[dateStr].length > 0;
                  const isToday = date.toDateString() === today.toDateString();
                  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                  
                  days.push(
                    <div
                      key={day}
                      className={`relative h-6 w-6 flex items-center justify-center text-[11px] font-medium rounded-lg transition-all duration-200 ${
                        isToday
                          ? `${colorSet.accent} text-white shadow-lg ring-2 ring-white animate-pulse`
                          : isWeekend
                            ? 'text-red-400 hover:bg-red-50'
                            : `${colorSet.text} hover:bg-white/70`
                      }`}
                    >
                      {day}
                      
                      {/* Enhanced event indicators */}
                      {hasEvents && !isToday && (
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-0.5">
                          <div className={`w-1.5 h-1.5 ${colorSet.accent} rounded-full animate-bounce`}></div>
                          {events[dateStr].length > 1 && (
                            <div className={`w-1.5 h-1.5 ${colorSet.accent} rounded-full animate-bounce`} style={{ animationDelay: '0.1s' }}></div>
                          )}
                        </div>
                      )}
                      
                      {/* Today indicator */}
                      {isToday && (
                        <div className="absolute -top-1 -right-1">
                          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
                        </div>
                      )}
                    </div>
                  );
                }
                
                return days;
              })()}
            </div>
          </div>
          
          {/* Interactive footer with stats */}
          {totalEvents > 0 && (
            <div className={`bg-gradient-to-r ${colorSet.light} px-3 py-2 border-t border-white/50`}>
              <div className="flex items-center justify-center space-x-2 text-xs">
                <div className={`w-2 h-2 ${colorSet.accent} rounded-full animate-pulse`}></div>
                <span className={colorSet.text}>{totalEvents} events</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Handler for "Today" button
  const handleGoToToday = () => {
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
    setViewMode('month');
  };

  return (
    <div className="w-full h-full overflow-y-auto bg-gradient-to-br from-gray-50 via-white to-blue-50 relative">
      {/* Cosmic floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-blue-200/10 to-purple-200/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-40 left-20 w-80 h-80 bg-gradient-to-br from-pink-200/10 to-indigo-200/10 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-br from-green-200/10 to-teal-200/10 rounded-full blur-3xl animate-pulse animation-delay-4000"></div>
        <div className="absolute top-32 left-1/4 w-48 h-48 bg-gradient-to-br from-amber-200/10 to-orange-200/10 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
        <div className="absolute bottom-20 right-1/3 w-56 h-56 bg-gradient-to-br from-violet-200/10 to-rose-200/10 rounded-full blur-3xl animate-pulse animation-delay-3000"></div>
      </div>

      {/* Ultra-futuristic floating header */}
      <div className="sticky top-0 z-30 px-6 pt-6 pb-4">
        <div className="bg-white/10 backdrop-blur-3xl rounded-[2rem] p-8 shadow-[0_25px_60px_rgba(8,_112,_184,_0.8)] border border-white/30 relative overflow-hidden">
          {/* Holographic overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-gradient-x"></div>
          
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center space-x-8">
              <div className="relative group">
                <h1 className="text-5xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-2xl">
                  {viewYear}
                </h1>
                <div className="absolute -bottom-2 left-0 w-full h-2 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full transform origin-left group-hover:scale-x-100 scale-x-0 transition-transform duration-700"></div>
                
                {/* Floating decorative elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-bounce shadow-2xl"></div>
                <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-gradient-to-r from-green-400 to-teal-500 rounded-full animate-pulse shadow-xl"></div>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <ViewSelector currentView={viewMode} setViewMode={setViewMode} />
              
              <button
                className="group relative px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold shadow-2xl transform transition-all duration-300 hover:scale-110 hover:shadow-emerald-500/25 overflow-hidden"
                onClick={handleGoToToday}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <span className="relative z-10 flex items-center gap-2">
                  <span className="text-xl animate-bounce">✨</span>
                  Today
                </span>
              </button>
              
              <div className="flex bg-white/20 backdrop-blur-xl rounded-2xl shadow-lg overflow-hidden p-1">
                <button
                  onClick={() => setViewYear(viewYear - 1)}
                  className="p-4 text-gray-700 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white transition-all duration-300 group rounded-xl"
                >
                  <ChevronLeft className="w-6 h-6 transform group-hover:scale-110 transition-transform duration-200" />
                </button>
                <button
                  onClick={() => setViewYear(viewYear + 1)}
                  className="p-4 text-gray-700 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white transition-all duration-300 group rounded-xl"
                >
                  <ChevronRight className="w-6 h-6 transform group-hover:scale-110 transition-transform duration-200" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Clean months grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-6 px-6 pb-12">
        {Array.from({ length: 12 }, (_, month) => {
          const colorSet = themes.gentle.months[month];
          const { totalEvents } = getEventStats(viewYear, month);
          const isCurrentMonthHighlight = isCurrentMonth(month);
          const monthName = new Date(viewYear, month).toLocaleString('default', { month: 'long' });
          
          return (
            <div
              key={`month-${month}`}
              className={`group relative cursor-pointer transform transition-all duration-300 hover:scale-105 ${
                isCurrentMonthHighlight ? 'ring-2 ring-blue-400 ring-opacity-50' : ''
              }`}
              onClick={() => {
                setViewMonth(month);
                setViewMode('month');
              }}
            >              
              {/* Soft card design */}
              <div className={`relative bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border ${colorSet.border} min-h-[280px] w-full`}>
                
                {/* Gentle header */}
                <div className={`bg-gradient-to-r ${colorSet.bg} px-4 py-3`}>
                  <div className="flex items-center justify-between">
                    <h3 className="text-gray-800 font-semibold text-lg">
                      {monthName}
                    </h3>
                    {totalEvents > 0 && (
                      <div className="bg-white/70 rounded-full px-3 py-1">
                        <span className="text-gray-700 text-sm font-medium">{totalEvents}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Calendar grid */}
                <div className="p-4">
                  {/* Weekday headers */}
                  <div className="grid grid-cols-7 gap-1 mb-3">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                      <div 
                        key={day + i} 
                        className={`text-center text-xs font-medium ${
                          i === 0 || i === 6 ? 'text-red-500' : 'text-gray-600'
                        }`}
                      >
                        <div className="w-8 h-8 flex items-center justify-center">
                          {day}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Days grid */}
                  <div className="grid grid-cols-7 gap-1">
                    {(() => {
                      const days = [];
                      const firstDay = getFirstDayOfWeek(viewYear, month);
                      const daysInMonth = getDaysInMonth(viewYear, month);
                      
                      // Empty cells
                      for (let i = 0; i < firstDay; i++) {
                        days.push(<div key={`empty-${i}`} className="h-8 w-8" />);
                      }
                      
                      // Date cells
                      for (let day = 1; day <= daysInMonth; day++) {
                        const date = new Date(viewYear, month, day);
                        const dateStr = date.toISOString().split('T')[0];
                        const hasEvents = events[dateStr] && events[dateStr].length > 0;
                        const isToday = date.toDateString() === today.toDateString();
                        const isSelected = selectedDate === dateStr;
                        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                        
                        days.push(
                          <div
                            key={day}
                            className={`relative h-8 w-8 flex items-center justify-center text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer hover:scale-110 ${
                              isToday
                                ? 'bg-blue-500 text-white shadow-sm'
                                : isSelected
                                  ? 'bg-purple-500 text-white shadow-sm'
                                  : hasEvents
                                    ? `${colorSet.accent} text-white shadow-sm`
                                    : isWeekend
                                      ? 'text-red-500 hover:bg-red-50'
                                      : 'text-gray-700 hover:bg-gray-100'
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onDateClick) {
                                onDateClick(dateStr);
                              }
                            }}
                          >
                            {day}
                            
                            {/* Simple event indicator */}
                            {hasEvents && !isToday && !isSelected && (
                              <div className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2">
                                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                              </div>
                            )}
                            
                            {/* Today indicator */}
                            {isToday && (
                              <div className="absolute -top-1 -right-1">
                                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                              </div>
                            )}
                            
                            {/* Selected indicator */}
                            {isSelected && !isToday && (
                              <div className="absolute -top-1 -right-1">
                                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                              </div>
                            )}
                          </div>
                        );
                      }
                      
                      return days;
                    })()}
                  </div>
                </div>
                
                {/* Simple footer */}
                {totalEvents > 0 && (
                  <div className="bg-gray-50 px-4 py-2 border-t border-gray-100">
                    <div className="flex items-center justify-center space-x-2 text-sm">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <span className="text-gray-600">{totalEvents} events</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Simple stats card */}
      <div className="fixed bottom-6 right-6">
        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">
              {Object.values(events).flat().length}
            </div>
            <div className="text-sm text-gray-600">Total Events</div>
          </div>
        </div>
      </div>
    </div>
  );
}