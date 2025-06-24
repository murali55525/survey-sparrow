export default function CalendarCell({ day, dateStr, events, isToday, handleDayClick, handleOpenModal }) {
  // Get events for this day
  const dayEvents = events.filter(e => e.date === dateStr);

  return (
    <div
      className={`border border-gray-100 h-full transition-all p-1 ${
        isToday ? 'bg-blue-50/10' : 'hover:bg-gray-50/30'
      }`}
      onClick={() => handleDayClick(dateStr)}
    >
      {/* Date number with Google-style indicator for today */}
      <div className="flex justify-between items-center mb-1">
        <div className={`
          flex items-center justify-center w-8 h-8 rounded-full 
          ${isToday ? 'bg-blue-500 text-white' : 'text-gray-700'}
        `}>
          {day}
        </div>
        
        {/* Add event button - only shows on hover */}
        <button
          className="w-8 h-8 flex items-center justify-center text-gray-400 hover:bg-gray-100 rounded-full opacity-0 group-hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation();
            handleOpenModal(dateStr);
          }}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6z" />
          </svg>
        </button>
      </div>
      
      {/* Event pills - Google Calendar style */}
      <div className="space-y-1 overflow-y-auto max-h-[calc(100%-32px)]">
        {dayEvents.map((event, idx) => (
          <div 
            key={idx}
            className={`
              px-2 py-1 rounded text-xs truncate flex items-center
              ${event.color || 'bg-blue-100 text-blue-800'}
            `}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`w-2 h-2 rounded-full ${event.dotColor || 'bg-blue-500'} mr-1.5`} />
            <span className="truncate">{event.title}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
