export default function MonthView(props) {
  const {
    calendarCells,
    // ...other props
  } = props
  
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="grid grid-cols-7 h-full">
        {/* Day headers */}
        {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
          <div key={day} className="border-b border-gray-200 py-2 text-xs font-medium text-gray-500 text-center">
            {day}
          </div>
        ))}
        
        {/* Calendar cells */}
        <div className="col-span-7 grid grid-cols-7 h-full">
          {calendarCells}
        </div>
      </div>
    </div>
  )
}
