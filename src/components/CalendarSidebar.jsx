import React, { useState } from 'react';
import { Calendar, Clock, Users, Star, Settings, Bell, Plus, ChevronRight, Sparkles } from 'lucide-react';

export default function CalendarSidebar({ 
  sidebarOpen, 
  setSidebarOpen, 
  today, 
  setViewMode, 
  viewMode,
  setDayViewDate,
  dayViewDate 
}) {
  const [activeSection, setActiveSection] = useState('calendar');

  // Quick actions for different calendar views
  const quickActions = [
    { 
      label: 'Today', 
      icon: Calendar, 
      action: () => {
        setDayViewDate(today);
        setViewMode('day');
      },
      gradient: 'from-blue-500 to-cyan-500',
      description: 'View today\'s schedule'
    },
    { 
      label: 'This Week', 
      icon: Clock, 
      action: () => setViewMode('week'),
      gradient: 'from-purple-500 to-pink-500',
      description: 'See weekly overview'
    },
    { 
      label: 'This Month', 
      icon: Users, 
      action: () => setViewMode('month'),
      gradient: 'from-green-500 to-teal-500',
      description: 'Monthly calendar view'
    },
    { 
      label: 'This Year', 
      icon: Star, 
      action: () => setViewMode('year'),
      gradient: 'from-orange-500 to-red-500',
      description: 'Annual overview'
    }
  ];

  // Upcoming events (mock data)
  const upcomingEvents = [
    { title: 'Team Meeting', time: '2:00 PM', type: 'work', color: 'blue' },
    { title: 'Doctor Appointment', time: '4:30 PM', type: 'health', color: 'green' },
    { title: 'Birthday Party', time: '7:00 PM', type: 'personal', color: 'purple' }
  ];

  // Calendar categories
  const calendarCategories = [
    { name: 'Work', color: 'blue', count: 12, active: true },
    { name: 'Personal', color: 'green', count: 8, active: true },
    { name: 'Health', color: 'purple', count: 3, active: false },
    { name: 'Travel', color: 'orange', count: 2, active: true }
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Enhanced sidebar */}
      <div className={`fixed md:relative inset-y-0 left-0 z-50 w-11/12 max-w-xs sm:max-w-sm md:w-80 bg-white/10 backdrop-blur-2xl border-r border-white/20 transform transition-all duration-300 ease-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      } flex flex-col overflow-hidden`}>
        
        {/* Gradient background overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5"></div>
        
        {/* Header with enhanced styling */}
        <div className="relative z-10 p-6 border-b border-white/20 bg-white/5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Calendar
            </h2>
            <button 
              className="md:hidden p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors duration-200"
              onClick={() => setSidebarOpen(false)}
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          
          {/* Today's date display */}
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-4 border border-white/20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">{today.getDate()}</span>
              </div>
              <div>
                <div className="text-lg font-bold text-gray-800">
                  {today.toLocaleDateString('en-US', { weekday: 'long' })}
                </div>
                <div className="text-sm text-gray-600">
                  {today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced quick actions */}
        <div className="relative z-10 p-6 border-b border-white/20">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, index) => (
              <button
                key={action.label}
                onClick={action.action}
                className={`group relative p-4 rounded-xl bg-gradient-to-r ${action.gradient} text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl overflow-hidden`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <action.icon className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform duration-200" />
                  <div className="text-sm font-bold">{action.label}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Enhanced upcoming events */}
        <div className="relative z-10 p-6 border-b border-white/20">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-orange-500" />
            Upcoming Events
          </h3>
          <div className="space-y-3">
            {upcomingEvents.map((event, index) => (
              <div 
                key={index}
                className="group p-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-all duration-200 cursor-pointer"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full bg-${event.color}-500 animate-pulse`}></div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-800 group-hover:text-gray-900">
                      {event.title}
                    </div>
                    <div className="text-xs text-gray-600">{event.time}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors duration-200" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced calendar categories */}
        <div className="relative z-10 flex-1 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-500" />
            Calendar Categories
          </h3>
          <div className="space-y-2">
            {calendarCategories.map((category, index) => (
              <div 
                key={category.name}
                className="group flex items-center gap-3 p-3 rounded-xl hover:bg-white/20 transition-all duration-200 cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative">
                  <div className={`w-4 h-4 rounded-full bg-${category.color}-500 ${category.active ? 'animate-pulse' : 'opacity-50'}`}></div>
                  {category.active && (
                    <div className={`absolute inset-0 w-4 h-4 rounded-full bg-${category.color}-500 animate-ping opacity-30`}></div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-gray-800">{category.name}</div>
                  <div className="text-xs text-gray-600">{category.count} events</div>
                </div>
                <div className={`text-xs px-2 py-1 rounded-full ${
                  category.active 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {category.active ? 'Active' : 'Hidden'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced add event button */}
        <div className="relative z-10 p-6 border-t border-white/20">
          <button className="group w-full p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-bold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10 flex items-center justify-center gap-2">
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              Create New Event
            </div>
          </button>
        </div>
      </div>
    </>
  );
}
