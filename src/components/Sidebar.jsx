import React from 'react'
import { getDaysInMonth, getFirstDayOfWeek, getDateStr } from '../utils/dateUtils'

export default function Sidebar({ 
  sidebarOpen, 
  setSidebarOpen, 
  viewYear, 
  viewMonth, 
  dayViewDate, 
  handleDayClick, 
  handlePrevMonth, 
  handleNextMonth, 
  handleOpenModal,
  events,
  today,
  tasks,
  handleToggleTaskCompletion,
  handleDeleteTask,
  setEvents, // <-- make sure setEvents is received as a prop
}) {
  // Define utility functions locally if they're not being properly imported or passed as props
  const getLocalDateStr = (day) => `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  
  // Check if a date is today
  const isCurrentDate = (day) => 
    day === today.getDate() &&
    viewMonth === today.getMonth() &&
    viewYear === today.getFullYear()

  // Generate mini calendar days - enhanced styling
  const generateMiniCalendarDays = () => {
    const days = []
    const miniFirstDay = getFirstDayOfWeek(viewYear, viewMonth)
    const miniDaysInMonth = getDaysInMonth(viewYear, viewMonth)
    
    for (let i = 0; i < miniFirstDay; i++) {
      days.push(<div key={`mini-empty-${i}`} className="h-9 w-9" />)
    }
    
    for (let day = 1; day <= miniDaysInMonth; day++) {
      const dateStr = getLocalDateStr(day)
      const isToday = isCurrentDate(day)
      const hasEvents = events[dateStr] && events[dateStr].length > 0
      
      days.push(
        <div 
          key={`mini-${day}`} 
          className={`group relative flex items-center justify-center h-9 w-9 text-sm font-semibold rounded-2xl cursor-pointer transition-all duration-300 transform hover:scale-110 hover:z-10 ${
            isToday 
              ? 'bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-600 text-white shadow-2xl ring-4 ring-blue-200/50 animate-pulse-gentle font-black' 
              : hasEvents
                ? 'bg-gradient-to-br from-blue-50 to-indigo-100 text-blue-800 hover:from-blue-100 hover:to-indigo-200 font-bold shadow-lg hover:shadow-xl border border-blue-200'
                : 'text-gray-700 hover:bg-gradient-to-br hover:from-gray-50 hover:to-gray-100 hover:shadow-lg hover:text-gray-900'
          }
          ${dayViewDate === dateStr ? 'ring-3 ring-purple-400 ring-opacity-60 bg-gradient-to-br from-purple-100 to-pink-100' : ''}`}
          onClick={() => handleDayClick(dateStr)}
        >
          <span className="relative z-10 transform group-hover:scale-110 transition-transform duration-200">{day}</span>
          
          {/* Enhanced today indicator with multiple layers */}
          {isToday && (
            <div className="absolute -top-1 -right-1">
              <div className="relative">
                <div className="w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-ping opacity-75"></div>
                <div className="absolute inset-0 w-4 h-4 bg-gradient-to-r from-yellow-300 to-orange-400 rounded-full animate-pulse"></div>
                <div className="absolute inset-1 w-2 h-2 bg-white rounded-full animate-bounce"></div>
              </div>
            </div>
          )}
          
          {/* Enhanced event indicator with glow effect */}
          {hasEvents && !isToday && (
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-1">
              <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full shadow-lg animate-pulse"></div>
              {events[dateStr].length > 1 && (
                <div className="w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-md animate-pulse" style={{ animationDelay: '0.3s' }}></div>
              )}
            </div>
          )}
          
          {/* Selected date indicator */}
          {dayViewDate === dateStr && !isToday && (
            <div className="absolute -top-1 -left-1">
              <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full animate-pulse shadow-lg"></div>
            </div>
          )}
          
          {/* Hover glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
        </div>
      )
    }
    
    return days
  }

  // Format time utility function if needed
  const formatTime = (hours, minutes = 0) => {
    return `${hours % 12 || 12}:${minutes.toString().padStart(2, '0')} ${hours >= 12 ? 'PM' : 'AM'}`
  }

  // Add state for new event creation with enhanced features
  const [showCreateEvent, setShowCreateEvent] = React.useState(false);
  const [eventName, setEventName] = React.useState('');
  const [eventDate, setEventDate] = React.useState('');
  const [eventTime, setEventTime] = React.useState('');
  const [eventEndTime, setEventEndTime] = React.useState('');
  const [eventDescription, setEventDescription] = React.useState('');
  const [eventColor, setEventColor] = React.useState('blue');
  const [eventCategory, setEventCategory] = React.useState('personal');
  const [eventLocation, setEventLocation] = React.useState('');
  const [eventPriority, setEventPriority] = React.useState('medium');
  const [isAllDay, setIsAllDay] = React.useState(false);
  const [eventReminder, setEventReminder] = React.useState('15');
  const [eventRecurring, setEventRecurring] = React.useState('none');
  const [attendees, setAttendees] = React.useState('');
  const [eventUrl, setEventUrl] = React.useState('');
  const [currentStep, setCurrentStep] = React.useState(1);
  const [isFormValid, setIsFormValid] = React.useState(false);

  // State for editing
  const [editIdx, setEditIdx] = React.useState(null);
  const [editDate, setEditDate] = React.useState('');
  const [editTime, setEditTime] = React.useState('');

  // Helper for today's date in YYYY-MM-DD
  const getTodayStr = () => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  };

  // Enhanced color options with names and accessibility
  const EVENT_COLORS = [
    { name: 'blue', hex: '#3B82F6', bg: 'bg-blue-500', label: 'Ocean Blue' },
    { name: 'green', hex: '#10B981', bg: 'bg-green-500', label: 'Forest Green' },
    { name: 'purple', hex: '#8B5CF6', bg: 'bg-purple-500', label: 'Royal Purple' },
    { name: 'orange', hex: '#F59E0B', bg: 'bg-orange-500', label: 'Sunset Orange' },
    { name: 'red', hex: '#EF4444', bg: 'bg-red-500', label: 'Ruby Red' },
    { name: 'teal', hex: '#14B8A6', bg: 'bg-teal-500', label: 'Teal Ocean' },
    { name: 'pink', hex: '#EC4899', bg: 'bg-pink-500', label: 'Cherry Blossom' },
    { name: 'indigo', hex: '#6366F1', bg: 'bg-indigo-500', label: 'Deep Indigo' },
    { name: 'emerald', hex: '#059669', bg: 'bg-emerald-500', label: 'Emerald' },
    { name: 'amber', hex: '#D97706', bg: 'bg-amber-500', label: 'Golden Amber' },
    { name: 'cyan', hex: '#06B6D4', bg: 'bg-cyan-500', label: 'Sky Cyan' },
    { name: 'lime', hex: '#84CC16', bg: 'bg-lime-500', label: 'Fresh Lime' }
  ];

  const EVENT_CATEGORIES = [
    { value: 'work', label: 'Work', icon: '💼', color: 'bg-blue-100 text-blue-800' },
    { value: 'personal', label: 'Personal', icon: '👤', color: 'bg-green-100 text-green-800' },
    { value: 'health', label: 'Health', icon: '🏥', color: 'bg-red-100 text-red-800' },
    { value: 'travel', label: 'Travel', icon: '✈️', color: 'bg-purple-100 text-purple-800' },
    { value: 'social', label: 'Social', icon: '👥', color: 'bg-pink-100 text-pink-800' },
    { value: 'education', label: 'Education', icon: '📚', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'finance', label: 'Finance', icon: '💰', color: 'bg-green-100 text-green-800' },
    { value: 'family', label: 'Family', icon: '👨‍👩‍👧‍👦', color: 'bg-orange-100 text-orange-800' }
  ];

  const PRIORITY_LEVELS = [
    { value: 'low', label: 'Low Priority', icon: '⬇️', color: 'text-gray-500', bg: 'bg-gray-100' },
    { value: 'medium', label: 'Medium Priority', icon: '➡️', color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { value: 'high', label: 'High Priority', icon: '⬆️', color: 'text-orange-600', bg: 'bg-orange-100' },
    { value: 'urgent', label: 'Urgent', icon: '🔥', color: 'text-red-600', bg: 'bg-red-100' }
  ];

  const REMINDER_OPTIONS = [
    { value: 'none', label: 'No reminder' },
    { value: '5', label: '5 minutes before' },
    { value: '15', label: '15 minutes before' },
    { value: '30', label: '30 minutes before' },
    { value: '60', label: '1 hour before' },
    { value: '1440', label: '1 day before' },
    { value: '10080', label: '1 week before' }
  ];

  const RECURRING_OPTIONS = [
    { value: 'none', label: 'Does not repeat' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' }
  ];

  // Add advanced options at the top (after other useState)
  const [eventTimeZone, setEventTimeZone] = React.useState('local');
  const [eventDuration, setEventDuration] = React.useState(60);
  const [eventBufferTime, setEventBufferTime] = React.useState(0);
  const [eventBookingSettings, setEventBookingSettings] = React.useState({
    allowBooking: false,
    maxAttendees: 1,
    requireApproval: false,
    bookingDeadline: 24
  });
  const [eventNotifications, setEventNotifications] = React.useState({
    email: true,
    sms: false,
    push: true
  });

  // Enhanced time zones
  const TIME_ZONES = [
    { value: 'local', label: 'Local Time', offset: 'Auto' },
    { value: 'UTC', label: 'UTC', offset: '+00:00' },
    { value: 'America/New_York', label: 'Eastern Time (ET)', offset: '-05:00' },
    { value: 'Europe/London', label: 'GMT', offset: '+00:00' },
    { value: 'Asia/Kolkata', label: 'India Standard Time (IST)', offset: '+05:30' },
    { value: 'Asia/Tokyo', label: 'Japan Standard Time (JST)', offset: '+09:00' },
    { value: 'Australia/Sydney', label: 'Australian Eastern Time', offset: '+10:00' }
  ];

  // Duration and buffer options
  const DURATION_OPTIONS = [
    { value: 15, label: '15 minutes' },
    { value: 30, label: '30 minutes' },
    { value: 45, label: '45 minutes' },
    { value: 60, label: '1 hour' },
    { value: 90, label: '1.5 hours' },
    { value: 120, label: '2 hours' },
    { value: 180, label: '3 hours' },
    { value: 240, label: '4 hours' },
    { value: 480, label: '8 hours (Full day)' },
    { value: 'custom', label: 'Custom duration' }
  ];
  const BUFFER_TIME_OPTIONS = [
    { value: 0, label: 'No buffer' },
    { value: 5, label: '5 minutes' },
    { value: 10, label: '10 minutes' },
    { value: 15, label: '15 minutes' },
    { value: 30, label: '30 minutes' },
    { value: 60, label: '1 hour' }
  ];

  // Enhanced color picker with categories
  const ENHANCED_EVENT_COLORS = [
    { name: 'blue', hex: '#3B82F6', bg: 'bg-blue-500', label: 'Ocean Blue', category: 'Primary' },
    { name: 'green', hex: '#10B981', bg: 'bg-green-500', label: 'Forest Green', category: 'Primary' },
    { name: 'purple', hex: '#8B5CF6', bg: 'bg-purple-500', label: 'Royal Purple', category: 'Primary' },
    { name: 'orange', hex: '#F59E0B', bg: 'bg-orange-500', label: 'Sunset Orange', category: 'Primary' },
    { name: 'red', hex: '#EF4444', bg: 'bg-red-500', label: 'Ruby Red', category: 'Primary' },
    { name: 'teal', hex: '#14B8A6', bg: 'bg-teal-500', label: 'Teal Ocean', category: 'Primary' },
    { name: 'pink', hex: '#EC4899', bg: 'bg-pink-500', label: 'Cherry Blossom', category: 'Secondary' },
    { name: 'indigo', hex: '#6366F1', bg: 'bg-indigo-500', label: 'Deep Indigo', category: 'Secondary' },
    { name: 'emerald', hex: '#059669', bg: 'bg-emerald-500', label: 'Emerald', category: 'Secondary' },
    { name: 'amber', hex: '#D97706', bg: 'bg-amber-500', label: 'Golden Amber', category: 'Secondary' },
    { name: 'cyan', hex: '#06B6D4', bg: 'bg-cyan-500', label: 'Sky Cyan', category: 'Secondary' },
    { name: 'lime', hex: '#84CC16', bg: 'bg-lime-500', label: 'Fresh Lime', category: 'Secondary' },
    { name: 'rose', hex: '#F43F5E', bg: 'bg-rose-500', label: 'Rose Garden', category: 'Accent' },
    { name: 'violet', hex: '#7C3AED', bg: 'bg-violet-500', label: 'Mystic Violet', category: 'Accent' },
    { name: 'sky', hex: '#0EA5E9', bg: 'bg-sky-500', label: 'Azure Sky', category: 'Accent' },
    { name: 'slate', hex: '#64748B', bg: 'bg-slate-500', label: 'Storm Slate', category: 'Neutral' },
    { name: 'gray', hex: '#6B7280', bg: 'bg-gray-500', label: 'Modern Gray', category: 'Neutral' },
    { name: 'stone', hex: '#78716C', bg: 'bg-stone-500', label: 'Natural Stone', category: 'Neutral' }
  ];

  // Form validation
  React.useEffect(() => {
    const isValid = eventName.trim() && eventDate && (!isAllDay ? eventTime : true);
    setIsFormValid(isValid);
  }, [eventName, eventDate, eventTime, isAllDay]);

  // Reset form
  const resetForm = () => {
    setEventName('');
    setEventDate('');
    setEventTime('');
    setEventEndTime('');
    setEventDescription('');
    setEventColor('blue');
    setEventCategory('personal');
    setEventLocation('');
    setEventPriority('medium');
    setIsAllDay(false);
    setEventReminder('15');
    setEventRecurring('none');
    setAttendees('');
    setEventUrl('');
    setCurrentStep(1);
    setEditIdx(null);
    setEditDate('');
    setEditTime('');
  };

  // Enhanced save handler (support both create and edit)
  const handleSaveEvent = () => {
    if (!isFormValid) return;

    if (typeof setEvents === 'function') {
      setEvents(prev => {
        const dateKey = eventDate;
        const timeKey = eventTime ? `${eventDate}T${eventTime}` : dateKey;
        const eventObj = { 
          title: eventName,
          time: isAllDay ? '' : eventTime,
          endTime: isAllDay ? '' : eventEndTime,
          description: eventDescription,
          color: eventColor,
          category: eventCategory,
          location: eventLocation,
          priority: eventPriority,
          isAllDay,
          reminder: eventReminder,
          recurring: eventRecurring,
          attendees: attendees.split(',').map(email => email.trim()).filter(Boolean),
          url: eventUrl,
          createdAt: new Date().toISOString(),
        };

        let newPrev = { ...prev };

        // If editing, remove the old event from both dateKey and timeKey arrays
        if (editIdx !== null && editDate) {
          // Remove from dateKey
          newPrev[editDate] = (newPrev[editDate] || []).filter((_, i) => i !== editIdx);
          // Remove from old timeKey if time existed
          if (editTime) {
            const oldTimeKey = `${editDate}T${editTime}`;
            newPrev[oldTimeKey] = (newPrev[oldTimeKey] || []).filter((_, i) => i !== editIdx);
          }
        }

        // Add the event to the new dateKey and timeKey
        return {
          ...newPrev,
          [dateKey]: [...(newPrev[dateKey] || []), eventObj],
          [timeKey]: [...(newPrev[timeKey] || []), eventObj],
        };
      });
    }

    setShowCreateEvent(false);
    resetForm();
  };

  // Enhanced handler for editing event (opens the modal in edit mode)
  const handleEditEvent = (dateKey, idx) => {
    const event = events[dateKey][idx];
    setEventName(event.title);
    setEventDate(dateKey);
    setEventTime(event.time || '');
    setEventEndTime(event.endTime || '');
    setEventDescription(event.description || '');
    setEventColor(event.color || 'blue');
    setEventCategory(event.category || 'personal');
    setEventLocation(event.location || '');
    setEventPriority(event.priority || 'medium');
    setIsAllDay(event.isAllDay || false);
    setEventReminder(event.reminder || '15');
    setEventRecurring(event.recurring || 'none');
    setAttendees(event.attendees ? event.attendees.join(', ') : '');
    setEventUrl(event.url || '');
    setEditIdx(idx);
    setEditDate(dateKey);
    setEditTime(event.time);
    setCurrentStep(1);
    setShowCreateEvent(true);
  };

  // Handler for deleting event
  const handleDeleteEvent = (dateKey, idx) => {
    if (typeof setEvents === 'function') {
      setEvents(prev => {
        const timeKey = `${dateKey}T${(prev[dateKey][idx] && prev[dateKey][idx].time) || ''}`;
        const newPrev = { ...prev };
        newPrev[dateKey] = (newPrev[dateKey] || []).filter((_, i) => i !== idx);
        if (newPrev[timeKey]) {
          newPrev[timeKey] = newPrev[timeKey].filter((_, i) => i !== idx);
        }
        return newPrev;
      });
    }
  };

  // --- NEW: Collapsible advanced section state ---
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  return (
    <div 
      className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                 fixed md:static top-0 left-0 z-50 h-full
                 w-64 sm:w-72 md:w-60 lg:w-64 flex flex-col shrink-0
                 bg-white/95 md:bg-white/90 backdrop-blur-2xl transition-all duration-500 md:translate-x-0
                 shadow-2xl md:shadow-xl rounded-r-3xl border border-white/50 overflow-hidden`}
    >
      <div className="flex-1 overflow-y-auto p-2 sm:p-4 md:p-3 lg:p-4">
        {/* Compact header */}
        <div className="flex items-center mb-4 sm:mb-6 md:mb-4 lg:mb-6 p-2 sm:p-3 md:p-2 lg:p-3 bg-gradient-to-r from-blue-50/80 to-purple-50/80 rounded-xl border border-white/50 shadow-lg backdrop-blur-sm">
          <div className="relative">
            <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-6 md:h-6 lg:w-7 lg:h-7 mr-2 text-blue-500" viewBox="0 0 24 24">
              <path fill="currentColor" d="M20 3h-1V2h-2v1H7V2H5v1H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"></path>
              <path fill="#FFFFFF" d="M4 10h16v11H4z"></path>
            </svg>
            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
          </div>
          <h1 className="text-lg sm:text-xl md:text-lg lg:text-xl text-gray-800 font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Calendar</h1>
        </div>
        
        {/* Compact create button */}
        <button 
          className="group mb-4 sm:mb-6 md:mb-4 lg:mb-6 flex items-center justify-center px-3 py-2 sm:px-4 sm:py-3 md:px-3 md:py-2 lg:px-4 lg:py-3 rounded-xl shadow-lg border border-white/50 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-xs sm:text-sm md:text-xs lg:text-sm transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:from-blue-600 hover:to-purple-700 relative overflow-hidden w-full"
          onClick={() => {
            setShowCreateEvent(true);
            setEventDate(getTodayStr());
            setEventTime('');
            setEventName('');
            setEventDescription('');
            setEventColor('blue');
            setEventCategory('personal');
            setEventLocation('');
            setEventPriority('medium');
            setIsAllDay(false);
            setEventReminder('15');
            setEventRecurring('none');
            setAttendees('');
            setEventUrl('');
            setCurrentStep(1);
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:w-5 sm:h-5 md:w-4 md:h-4 lg:w-5 lg:h-5 mr-2 relative z-10" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path>
          </svg>
          <span className="relative z-10">Create Event</span>
        </button>

        {/* Enhanced Create Event Modal - make more compact */}
        {showCreateEvent && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-2 sm:p-4">
            <div className="bg-white/98 backdrop-blur-3xl rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-sm sm:max-w-lg md:max-w-xl lg:max-w-2xl border border-white/30 max-h-[95vh] sm:max-h-[98vh] overflow-y-auto flex flex-col">
              {/* Compact Modal Header */}
              <div className="relative p-3 sm:p-4 md:p-6 border-b border-white/20 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-t-2xl sm:rounded-t-3xl">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center">
                      <span className="text-white text-lg sm:text-xl">
                        {editIdx !== null ? '✏️' : '✨'}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {editIdx !== null ? 'Edit Event' : 'Create New Event'}
                      </h2>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1">
                        Step {currentStep} of 3 • Fill in the details below
                      </p>
                    </div>
                  </div>
                  <button
                    className="p-1.5 sm:p-2 rounded-full bg-white/20 hover:bg-white/40 transition-colors"
                    onClick={() => {
                      setShowCreateEvent(false);
                      resetForm();
                    }}
                    aria-label="Close"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                {/* Compact progress bar */}
                <div className="mt-3 sm:mt-4 w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-1.5 sm:h-2 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${(currentStep / 3) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Compact Modal Body */}
              <div className="flex-1 overflow-y-auto relative z-10">
                {/* Step 1: Basic Information - make more compact */}
                {currentStep === 1 && (
                  <div className="p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4 md:space-y-6">
                    <div className="text-center mb-3 sm:mb-4 md:mb-6">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1 sm:mb-2">📝 Basic Information</h3>
                      <p className="text-xs sm:text-sm text-gray-600">Let's start with the essential details</p>
                    </div>

                    {/* Compact Event Name */}
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                        Event Title *
                      </label>
                      <input
                        type="text"
                        className="w-full bg-white/70 border-2 border-gray-200/80 rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-3 md:px-3 md:py-2 lg:px-4 lg:py-3 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 shadow-sm text-sm sm:text-base"
                        value={eventName}
                        onChange={e => setEventName(e.target.value)}
                        placeholder="e.g., Team Meeting"
                        autoFocus
                      />
                    </div>

                    {/* Compact All Day Toggle */}
                    <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 md:p-4 bg-blue-50/50 rounded-lg sm:rounded-xl">
                      <input
                        type="checkbox"
                        id="allDay"
                        checked={isAllDay}
                        onChange={e => setIsAllDay(e.target.checked)}
                        className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="allDay" className="text-xs sm:text-sm font-medium text-gray-700">
                        All day event
                      </label>
                    </div>

                    {/* Compact Date and Time */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                          📅 Date *
                        </label>
                        <input
                          type="date"
                          className="w-full bg-white/70 border-2 border-gray-200/80 rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-3 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
                          value={eventDate}
                          min={getTodayStr()}
                          onChange={e => setEventDate(e.target.value)}
                        />
                      </div>
                      {!isAllDay && (
                        <div>
                          <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                            🕐 Start Time
                          </label>
                          <input
                            type="time"
                            className="w-full bg-white/70 border-2 border-gray-200/80 rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-3 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
                            value={eventTime}
                            onChange={e => setEventTime(e.target.value)}
                          />
                        </div>
                      )}
                    </div>

                    {/* Compact End Time */}
                    {!isAllDay && eventTime && (
                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                          🕐 End Time
                        </label>
                        <input
                          type="time"
                          className="w-full bg-white/70 border-2 border-gray-200/80 rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-3 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
                          value={eventEndTime}
                          onChange={e => setEventEndTime(e.target.value)}
                          min={eventTime}
                        />
                      </div>
                    )}

                    {/* Compact Category and Priority */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                          🏷️ Category
                        </label>
                        <select 
                          className="w-full bg-white/70 border-2 border-gray-200/80 rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-3 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
                          value={eventCategory}
                          onChange={e => setEventCategory(e.target.value)}
                        >
                          {EVENT_CATEGORIES.map(cat => (
                            <option key={cat.value} value={cat.value}>
                              {cat.icon} {cat.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                          ⚡ Priority
                        </label>
                        <select 
                          className="w-full bg-white/70 border-2 border-gray-200/80 rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-3 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
                          value={eventPriority}
                          onChange={e => setEventPriority(e.target.value)}
                        >
                          {PRIORITY_LEVELS.map(priority => (
                            <option key={priority.value} value={priority.value}>
                              {priority.icon} {priority.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Compact Advanced Section Toggle */}
                    <div className="mt-2 sm:mt-4">
                      <button
                        type="button"
                        className="flex items-center gap-1 sm:gap-2 text-blue-600 font-semibold text-xs sm:text-sm hover:underline focus:outline-none"
                        onClick={() => setShowAdvanced(v => !v)}
                        aria-expanded={showAdvanced}
                        aria-controls="advanced-event-features"
                      >
                        {showAdvanced ? (
                          <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg>
                        ) : (
                          <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                        )}
                        {showAdvanced ? "Hide Advanced Features" : "Show Advanced Features"}
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2: Details & Customization (BASIC) */}
                {currentStep === 2 && (
                  <div className="p-3 sm:p-4 md:p-6 space-y-6">
                    <div className="text-center mb-3 sm:mb-4 md:mb-6">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1 sm:mb-2">🎨 Details & Customization</h3>
                      <p className="text-xs sm:text-sm text-gray-600">Add more details and customize your event</p>
                    </div>

                    {/* Location */}
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                        📍 Location
                      </label>
                      <input
                        type="text"
                        className="w-full bg-white/70 border-2 border-gray-200/80 rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-3 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                        value={eventLocation}
                        onChange={e => setEventLocation(e.target.value)}
                        placeholder="e.g., Conference Room A, Online, Home"
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                        📄 Description
                      </label>
                      <textarea
                        className="w-full bg-white/70 border-2 border-gray-200/80 rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-3 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 resize-none"
                        rows="4"
                        value={eventDescription}
                        onChange={e => setEventDescription(e.target.value)}
                        placeholder="Add more details about this event..."
                      />
                    </div>

                    {/* Event URL */}
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                        🔗 Event URL
                      </label>
                      <input
                        type="url"
                        className="w-full bg-white/70 border-2 border-gray-200/80 rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-3 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                        value={eventUrl}
                        onChange={e => setEventUrl(e.target.value)}
                        placeholder="https://zoom.us/j/1234567890"
                      />
                    </div>

                    {/* Color Picker (keep basic, move advanced below) */}
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-3">
                        🎨 Event Color
                      </label>
                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                        {ENHANCED_EVENT_COLORS.filter(color => color.category === 'Primary').map(color => (
                          <button
                            key={color.name}
                            type="button"
                            onClick={() => setEventColor(color.name)}
                            className={`relative group flex flex-col items-center p-2 rounded-lg transition-all duration-200 transform hover:scale-105 ${
                              eventColor === color.name ? 'ring-3 ring-offset-1 ring-blue-400 scale-105' : 'hover:shadow-lg'
                            }`}
                            style={{ backgroundColor: `${color.hex}15` }}
                            aria-label={`Select ${color.label}`}
                          >
                            <div 
                              className={`w-6 h-6 rounded-full mb-1 shadow-md ${color.bg}`}
                            />
                            <span className="text-[10px] font-medium text-gray-700 text-center leading-tight">{color.label}</span>
                            {eventColor === color.name && (
                              <div className="absolute -top-1 -right-1">
                                <svg className="w-3 h-3 text-white bg-blue-500 rounded-full p-0.5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* --- Collapsible Advanced Section --- */}
                    {showAdvanced && (
                      <div id="advanced-event-features" className="mt-4 sm:mt-6 md:mt-4 lg:mt-6 border-t border-gray-200 pt-4 sm:pt-6 space-y-6">
                        {/* Duration and Time Zone */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                              ⏱️ Duration
                            </label>
                            <select 
                              className="w-full bg-white/70 border-2 border-gray-200/80 rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-3 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                              value={eventDuration}
                              onChange={e => setEventDuration(e.target.value)}
                            >
                              {DURATION_OPTIONS.map(option => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                              🌍 Time Zone
                            </label>
                            <select 
                              className="w-full bg-white/70 border-2 border-gray-200/80 rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-3 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                              value={eventTimeZone}
                              onChange={e => setEventTimeZone(e.target.value)}
                            >
                              {TIME_ZONES.map(tz => (
                                <option key={tz.value} value={tz.value}>
                                  {tz.label} ({tz.offset})
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Buffer Time */}
                        <div>
                          <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                            ⏰ Buffer Time
                          </label>
                          <select 
                            className="w-full bg-white/70 border-2 border-gray-200/80 rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-3 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                            value={eventBufferTime}
                            onChange={e => setEventBufferTime(e.target.value)}
                          >
                            {BUFFER_TIME_OPTIONS.map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                          <p className="text-xs text-gray-500 mt-1">Add extra time before/after the event</p>
                        </div>

                        {/* Enhanced Color Picker with Categories (Secondary/Accent/Neutral) */}
                        <div>
                          <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-3">
                            🎨 More Colors
                          </label>
                          {['Secondary', 'Accent', 'Neutral'].map(category => (
                            <div key={category} className="mb-4">
                              <h4 className="text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">{category} Colors</h4>
                              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                                {ENHANCED_EVENT_COLORS.filter(color => color.category === category).map(color => (
                                  <button
                                    key={color.name}
                                    type="button"
                                    onClick={() => setEventColor(color.name)}
                                    className={`relative group flex flex-col items-center p-2 rounded-lg transition-all duration-200 transform hover:scale-105 ${
                                      eventColor === color.name ? 'ring-3 ring-offset-1 ring-blue-400 scale-105' : 'hover:shadow-lg'
                                    }`}
                                    style={{ backgroundColor: `${color.hex}15` }}
                                    aria-label={`Select ${color.label}`}
                                  >
                                    <div 
                                      className={`w-6 h-6 rounded-full mb-1 shadow-md ${color.bg}`}
                                    />
                                    <span className="text-[10px] font-medium text-gray-700 text-center leading-tight">{color.label}</span>
                                    {eventColor === color.name && (
                                      <div className="absolute -top-1 -right-1">
                                        <svg className="w-3 h-3 text-white bg-blue-500 rounded-full p-0.5" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                      </div>
                                    )}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 3: Advanced Settings & Booking */}
                {currentStep === 3 && (
                  <div className="p-3 sm:p-4 md:p-6 space-y-6">
                    {/* --- Only show this step if advanced is open --- */}
                    {!showAdvanced ? (
                      <div className="text-center text-gray-500 text-sm">
                        To access advanced settings (reminders, booking, notifications), click "Show Advanced Features" in previous steps.
                      </div>
                    ) : (
                      <>
                        {/* Booking Settings */}
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200">
                          <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            📅 Booking Settings
                            <input
                              type="checkbox"
                              id="allowBooking"
                              checked={eventBookingSettings.allowBooking}
                              onChange={e => setEventBookingSettings(prev => ({ ...prev, allowBooking: e.target.checked }))}
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label htmlFor="allowBooking" className="text-sm font-medium text-gray-700">
                              Allow others to book this event
                            </label>
                          </h4>
                          {eventBookingSettings.allowBooking && (
                            <div className="space-y-3">
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-xs font-semibold text-gray-700 mb-1">Max Attendees</label>
                                  <input
                                    type="number"
                                    min="1"
                                    max="100"
                                    value={eventBookingSettings.maxAttendees}
                                    onChange={e => setEventBookingSettings(prev => ({ ...prev, maxAttendees: parseInt(e.target.value) }))}
                                    className="w-full bg-white/70 border border-gray-200 rounded-lg px-3 py-2 text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-semibold text-gray-700 mb-1">Booking Deadline (hours)</label>
                                  <input
                                    type="number"
                                    min="1"
                                    max="168"
                                    value={eventBookingSettings.bookingDeadline}
                                    onChange={e => setEventBookingSettings(prev => ({ ...prev, bookingDeadline: parseInt(e.target.value) }))}
                                    className="w-full bg-white/70 border border-gray-200 rounded-lg px-3 py-2 text-sm"
                                  />
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  id="requireApproval"
                                  checked={eventBookingSettings.requireApproval}
                                  onChange={e => setEventBookingSettings(prev => ({ ...prev, requireApproval: e.target.checked }))}
                                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <label htmlFor="requireApproval" className="text-xs font-medium text-gray-700">
                                  Require approval for bookings
                                </label>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Notification Settings */}
                        <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-4 border border-green-200">
                          <h4 className="font-semibold text-gray-800 mb-3">🔔 Notification Preferences</h4>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                id="emailNotif"
                                checked={eventNotifications.email}
                                onChange={e => setEventNotifications(prev => ({ ...prev, email: e.target.checked }))}
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                              />
                              <label htmlFor="emailNotif" className="text-sm font-medium text-gray-700">📧 Email notifications</label>
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                id="smsNotif"
                                checked={eventNotifications.sms}
                                onChange={e => setEventNotifications(prev => ({ ...prev, sms: e.target.checked }))}
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                              />
                              <label htmlFor="smsNotif" className="text-sm font-medium text-gray-700">📱 SMS notifications</label>
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                id="pushNotif"
                                checked={eventNotifications.push}
                                onChange={e => setEventNotifications(prev => ({ ...prev, push: e.target.checked }))}
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                              />
                              <label htmlFor="pushNotif" className="text-sm font-medium text-gray-700">🔔 Push notifications</label>
                            </div>
                          </div>
                        </div>

                        {/* Attendees */}
                        <div>
                          <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                            👥 Attendees (Email addresses)
                          </label>
                          <input
                            type="text"
                            className="w-full bg-white/70 border-2 border-gray-200/80 rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-3 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                            value={attendees}
                            onChange={e => setAttendees(e.target.value)}
                            placeholder="john@example.com, jane@example.com"
                          />
                          <p className="text-xs text-gray-500 mt-1">Separate multiple emails with commas</p>
                        </div>

                        {/* Enhanced Event Preview */}
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200">
                          <h4 className="font-semibold text-gray-800 mb-3">📋 Event Preview</h4>
                          <div className="space-y-2 text-sm break-words">
                            <div><span className="font-medium">Title:</span> {eventName || 'Untitled Event'}</div>
                            <div><span className="font-medium">Date:</span> {eventDate || 'No date selected'}</div>
                            {!isAllDay && eventTime && (
                              <div>
                                <span className="font-medium">Time:</span> {eventTime} 
                                {eventEndTime && ` - ${eventEndTime}`}
                                {eventDuration && ` (${eventDuration} min)`}
                                <span className="text-xs text-gray-500 ml-2">({TIME_ZONES.find(tz => tz.value === eventTimeZone)?.label})</span>
                              </div>
                            )}
                            <div><span className="font-medium">Category:</span> {EVENT_CATEGORIES.find(cat => cat.value === eventCategory)?.label}</div>
                            <div><span className="font-medium">Priority:</span> {PRIORITY_LEVELS.find(p => p.value === eventPriority)?.label}</div>
                            {eventLocation && <div><span className="font-medium">Location:</span> {eventLocation}</div>}
                            {eventBookingSettings.allowBooking && (
                              <div className="bg-green-100 p-2 rounded-lg mt-2">
                                <span className="font-medium text-green-800">📅 Booking Enabled:</span>
                                <span className="text-green-700 text-xs ml-1">
                                  Max {eventBookingSettings.maxAttendees} attendees, 
                                  {eventBookingSettings.requireApproval ? ' requires approval' : ' auto-accept'}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
              
              {/* Compact Modal Footer */}
              <div className="p-3 sm:p-4 md:p-6 border-t border-white/20 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-b-2xl sm:rounded-b-3xl">
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  {currentStep > 1 && (
                    <button
                      type="button"
                      className="flex-1 py-2 sm:py-3 bg-gray-200 text-gray-700 rounded-lg sm:rounded-xl font-semibold transition-all duration-300 hover:bg-gray-300 text-sm sm:text-base"
                      onClick={() => setCurrentStep(currentStep - 1)}
                    >
                      ← Previous
                    </button>
                  )}
                  {currentStep < 3 ? (
                    <button
                      type="button"
                      className="flex-1 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg sm:rounded-xl font-bold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm sm:text-base"
                      onClick={() => setCurrentStep(currentStep + 1)}
                      disabled={!isFormValid}
                    >
                      Next Step →
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="flex-1 py-2 sm:py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg sm:rounded-xl font-bold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm sm:text-base"
                      onClick={handleSaveEvent}
                      disabled={!isFormValid}
                    >
                      {editIdx !== null ? '✨ Update Event' : '🚀 Create Event'}
                    </button>
                  )}
                  <button
                    type="button"
                    className="py-2 sm:py-3 px-3 sm:px-6 bg-gray-100 text-gray-700 rounded-lg sm:rounded-xl font-semibold transition-all duration-300 hover:bg-gray-200 text-sm sm:text-base"
                    onClick={() => {
                      setShowCreateEvent(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Compact mini calendar */}
        <div className="mb-4 sm:mb-6 md:mb-4 lg:mb-6 bg-gradient-to-br from-white/80 to-gray-50/80 p-3 sm:p-4 md:p-3 lg:p-4 rounded-2xl shadow-xl border border-white/50 backdrop-blur-lg">
          <div className="flex justify-between items-center mb-3 sm:mb-4 md:mb-3 lg:mb-4">
            <h2 className="text-sm sm:text-base md:text-sm lg:text-base font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {new Date(viewYear, viewMonth).toLocaleString('default', { month: 'long' })} {viewYear}
            </h2>
            <div className="flex gap-1 bg-white/60 rounded-xl p-0.5">
              <button 
                className="group p-1.5 sm:p-2 md:p-1.5 lg:p-2 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 rounded-lg transition-all duration-300 hover:shadow-lg" 
                onClick={handlePrevMonth}
                aria-label="Previous month"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3 sm:w-4 sm:h-4 md:w-3 md:h-3 lg:w-4 lg:h-4 text-gray-600 group-hover:text-white transition-colors duration-300">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
              <button 
                className="group p-1.5 sm:p-2 md:p-1.5 lg:p-2 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 rounded-lg transition-all duration-300 hover:shadow-lg"
                onClick={handleNextMonth}
                aria-label="Next month"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3 sm:w-4 sm:h-4 md:w-3 md:h-3 lg:w-4 lg:h-4 text-gray-600 group-hover:text-white transition-colors duration-300">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Compact mini calendar grid */}
          <div className="w-full">
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
                <div key={day + idx} className="text-center text-[10px] sm:text-xs md:text-[10px] lg:text-xs font-bold text-gray-500 h-4 sm:h-5 md:h-4 lg:h-5 flex items-center justify-center">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {generateMiniCalendarDays().map((day, idx) => (
                <div key={idx} className="h-6 sm:h-7 md:h-6 lg:h-7 w-6 sm:w-7 md:w-6 lg:w-7 text-xs sm:text-sm md:text-xs lg:text-sm">
                  {day}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* My Calendars section - matte styling */}
        <div className="mb-4 bg-white/70 p-3 rounded-xl shadow-sm">
          <h3 className="text-sm font-medium text-gray-700 mb-3">My calendars</h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-700">Calendar</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-700">Tasks</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-700">Reminders</span>
            </div>
          </div>
        </div>

        {/* Tasks section */}
        <div className="mb-4 bg-white/70 p-4 rounded-xl shadow-sm border border-gray-100/80">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-700">My Tasks</h3>
            <button
              className="p-1.5 bg-green-50 text-green-500 rounded-lg"
              onClick={() => handleOpenModal(new Date().toISOString().split('T')[0], '', true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </button>
          </div>
          
          <div className="space-y-2 max-h-[200px] overflow-y-auto">
            {Object.keys(tasks || {}).length === 0 ? (
              <div className="text-xs text-gray-400 italic p-2">No tasks yet</div>
            ) : (
              Object.entries(tasks).map(([dateKey, tasksList]) => (
                tasksList.map(task => (
                  <div 
                    key={task.id} 
                    className="flex items-center justify-between p-2 bg-green-50/80 rounded-lg text-xs"
                  >
                    <div className="flex items-center">
                      <button
                        className={`w-5 h-5 rounded-full border ${task.completed ? 'bg-green-400 border-green-500' : 'border-gray-300'} mr-2 flex items-center justify-center`}
                        onClick={() => handleToggleTaskCompletion(dateKey, task.id)}
                      >
                        {task.completed && (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-3 h-3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        )}
                      </button>
                      <span className={task.completed ? 'line-through text-gray-500' : 'text-gray-700'}>
                        {task.title}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-400 mr-2 text-[10px]">
                        {new Date(dateKey).toLocaleDateString('default', { month: 'short', day: 'numeric' })}
                      </span>
                      <button
                        onClick={() => handleDeleteTask(dateKey, task.id)}
                        className="text-gray-400 bg-gray-100/60 p-1 rounded-lg"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
              ))
              )).flat()
            )}
          </div>
        </div>

        {/* Upcoming Events section */}
        <div className="mt-4 border-t border-gray-100 pt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Upcoming events</h3>
          <div className="text-xs space-y-2 max-h-[180px] overflow-auto">
            {Object.entries(events || {})
              .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
              .map(([date, dateEvents]) =>
                dateEvents.map((event, idx) => (
                  <div key={`${date}-${idx}`} className="p-2 bg-gray-50 text-gray-700 rounded border-l-4 border-blue-400 flex items-center justify-between">
                    <div>
                      <div className="font-medium">{event.title}</div>
                      <div className="text-gray-500">
                        {new Date(date.split('T')[0]).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        {event.time && ` • ${event.time}`}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-2">
                      <button
                        className="text-blue-500 hover:text-blue-700"
                        onClick={() => handleEditEvent(date, idx)}
                        title="Edit"
                      >✏️</button>
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDeleteEvent(date, idx)}
                        title="Delete"
                      >🗑️</button>
                    </div>
                  </div>
                ))
              )
              .flat()
            }
          </div>
        </div>

        {/* Keyboard shortcuts section */}
        <div className="mt-4 border-t border-gray-100 pt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Keyboard shortcuts</h3>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-600">Today</span>
              <span className="text-gray-500 font-mono">T</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Day view</span>
              <span className="text-gray-500 font-mono">1</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Week view</span>
              <span className="text-gray-500 font-mono">2</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Month view</span>
              <span className="text-gray-500 font-mono">3</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Create event</span>
              <span className="text-gray-500 font-mono">C</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}