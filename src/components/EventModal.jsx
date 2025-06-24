import { useState } from 'react'

// Add the helper locally:
const formatTime = (hours, minutes = 0) => {
  return `${hours % 12 || 12}:${minutes.toString().padStart(2, '0')} ${hours >= 12 ? 'PM' : 'AM'}`
}

// Available event colors for customization 
const eventColors = [
  { name: 'Blue', value: '#3788d8', textColor: 'white' },
  { name: 'Green', value: '#42b983', textColor: 'white' },
  { name: 'Red', value: '#ff5252', textColor: 'white' },
  { name: 'Orange', value: '#fa8c16', textColor: 'white' },
  { name: 'Cyan', value: '#17a2b8', textColor: 'white' },
  { name: 'Purple', value: '#8e44ad', textColor: 'white' }
];

export default function EventModal(props) {
  const { 
    modalOpen, 
    setModalOpen, 
    selectedDate, 
    selectedTime, 
    title, 
    setTitle, 
    handleAddEvent,
    isTaskMode,
    setIsTaskMode,
    handleAddTask
  } = props

  // Additional state for enhanced features
  const [description, setDescription] = useState('')
  const [isAllDay, setIsAllDay] = useState(!selectedTime)
  const [location, setLocation] = useState('')
  const [selectedColor, setSelectedColor] = useState(eventColors[0].value)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [endTime, setEndTime] = useState(
    selectedTime 
      ? `${String(parseInt(selectedTime.split(':')[0]) + 1).padStart(2, '0')}:00`
      : '01:00'
  )

  const handleCloseModal = () => setModalOpen(false)

  const handleSubmit = () => {
    if (!title.trim()) return;
    
    handleAddEvent({
      title,
      description,
      isAllDay,
      location,
      color: selectedColor,
      endTime
    });
    
    // Reset state after adding event
    setDescription('');
    setIsAllDay(false);
    setLocation('');
    setSelectedColor(eventColors[0].value);
  }

  return (
    <>
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 rounded-2xl shadow-lg w-full max-w-md animate-fadeIn overflow-hidden">
            <div className="p-4 border-b border-gray-100/80">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-700">
                  {isTaskMode ? 'Add Task' : 'Add Event'}
                </h2>
                <button
                  className="text-gray-400 bg-gray-50/80 p-1.5 rounded-lg"
                  onClick={handleCloseModal}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-5">
              {/* Toggle between Event and Task */}
              <div className="flex mb-4 bg-gray-50 rounded-xl p-1">
                <button 
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium ${!isTaskMode ? 'bg-blue-400 text-white shadow-sm' : 'text-gray-600'}`}
                  onClick={() => setIsTaskMode(false)}
                >
                  Event
                </button>
                <button 
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium ${isTaskMode ? 'bg-green-400 text-white shadow-sm' : 'text-gray-600'}`}
                  onClick={() => setIsTaskMode(true)}
                >
                  Task
                </button>
              </div>
            
              <input
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl mb-4 bg-white/80 shadow-sm focus:outline-none focus:border-blue-300"
                placeholder={isTaskMode ? "Task name" : "Event title"}
                value={title}
                onChange={e => setTitle(e.target.value)}
                autoFocus
              />
              
              {/* Date display with appropriate icon */}
              <div className="flex items-center mb-4 p-3 bg-gray-50/70 rounded-xl">
                <svg className={`w-5 h-5 mr-2 ${isTaskMode ? 'text-green-400' : 'text-blue-400'}`} viewBox="0 0 24 24">
                  <path fill="currentColor" d="M19 19H5V8h14m-3-7v2H8V2H6v2H5c-1.11 0-2 .89-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2h-1V2m-1 11h-5v5h5v-5z"></path>
                </svg>
                <span className="text-sm text-gray-700">
                  {new Date(selectedDate).toLocaleDateString('en-US', { 
                    weekday: 'short',
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                  {selectedTime && !isTaskMode && (
                    <span className="ml-2 bg-blue-100/50 text-blue-700 px-2 py-0.5 rounded-md text-xs">
                      {formatTime(parseInt(selectedTime.split(':')[0]))}
                    </span>
                  )}
                </span>
              </div>
              
              {/* Task-specific fields (if needed) */}
              {isTaskMode && (
                <div className="mb-4 p-3 bg-gray-50/70 rounded-xl">
                  <div className="flex items-center text-sm text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 text-green-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Task for {new Date(selectedDate).toLocaleDateString('default', { month: 'short', day: 'numeric' })}</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-end gap-2 p-4 border-t border-gray-100/80 bg-gray-50/80">
              <button
                className="px-4 py-2 rounded-xl text-sm border border-gray-200 bg-white/80 text-gray-700 shadow-sm"
                onClick={handleCloseModal}
              >
                Cancel
              </button>
              <button
                className={`px-4 py-2 rounded-xl text-sm text-white shadow-sm ${isTaskMode ? 'bg-green-400' : 'bg-blue-400'}`}
                onClick={isTaskMode ? handleAddTask : handleAddEvent}
              >
                {isTaskMode ? 'Add Task' : 'Save Event'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}