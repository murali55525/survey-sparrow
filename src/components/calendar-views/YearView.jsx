import React, { useState } from 'react';
import { getDaysInMonth, getFirstDayOfWeek } from '../../utils/dateUtils';

export default function YearView({ viewYear, today, setViewMonth, setViewMode, events = {} }) {
  const [selectedTheme, setSelectedTheme] = useState('basic');

  // Simplified theme with no gradients or colors
  const themes = {
    basic: {
      months: Array(12).fill({
        bg: 'bg-white',
        light: 'bg-white',
        accent: 'bg-gray-300',
        text: 'text-gray-700'
      })
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

  // Generate the month view - removed all hover effects and colors
  const generateMonthView = (month) => {
    const colorSet = themes.basic.months[0];
    const { totalEvents } = getEventStats(viewYear, month);
    
    return (
      <div
        key={`month-${month}`}
        className="relative cursor-pointer"
        onClick={() => {
          setViewMonth(month);
          setViewMode('month');
        }}
      >
        {/* Main card */}
        <div className="relative bg-white rounded shadow-sm overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="relative bg-white px-3 py-2 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-700 font-bold text-sm">
                {new Date(viewYear, month).toLocaleString('default', { month: 'long' })}
              </h3>
              {totalEvents > 0 && (
                <div className="bg-gray-100 rounded-full px-1.5 py-0.5">
                  <span className="text-gray-700 text-xs">{totalEvents}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Calendar grid */}
          <div className="p-2 bg-white">
            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-0.5 mb-1">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                <div key={day} className="text-center text-[9px] font-medium text-gray-500">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Days grid */}
            <div className="grid grid-cols-7 gap-0.5">
              {(() => {
                const days = [];
                const firstDay = getFirstDayOfWeek(viewYear, month);
                const daysInMonth = getDaysInMonth(viewYear, month);
                
                // Empty cells for previous month
                for (let i = 0; i < firstDay; i++) {
                  days.push(<div key={`empty-${i}`} className="h-5" />);
                }
                
                // Current month days - white background with minimal styling
                for (let day = 1; day <= daysInMonth; day++) {
                  const date = new Date(viewYear, month, day);
                  const dateStr = date.toISOString().split('T')[0];
                  const hasEvents = events[dateStr] && events[dateStr].length > 0;
                  const isToday = date.toDateString() === today.toDateString();
                  
                  days.push(
                    <div
                      key={day}
                      className={`relative h-5 w-5 flex items-center justify-center text-[10px] ${
                        isToday
                          ? 'border border-gray-400 rounded-full'
                          : ''
                      }`}
                    >
                      {day}
                      
                      {/* Event indicator - subtle gray */}
                      {hasEvents && (
                        <div className="absolute -bottom-0.5 w-1 h-1 bg-gray-400 rounded-full"></div>
                      )}
                    </div>
                  );
                }
                
                return days;
              })()}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full overflow-y-auto pb-6 bg-white">
      {/* Theme selector - removed */}
      
      {/* Year header */}
      <div className="text-center mb-5 pt-4">
        <h1 className="text-3xl font-bold text-gray-700">
          {viewYear}
        </h1>
      </div>
      
      {/* Months grid - ensure it scrolls properly */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 px-4 overflow-y-auto">
        {Array.from({ length: 12 }, (_, month) => generateMonthView(month))}
      </div>
    </div>
  );
}