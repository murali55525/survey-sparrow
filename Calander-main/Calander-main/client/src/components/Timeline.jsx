"use client"
import { Clock, Plus, Edit3, Trash2, MapPin } from "lucide-react"
import { useEvents } from "../context/EventContext"
import { getHoursArray, formatTime, sortEventsByTime } from "../utils/dateUtils"

const Timeline = ({ selectedDate, onAddEvent, onEditEvent }) => {
  const { getEventsForDate, deleteEvent } = useEvents()

  const hours = getHoursArray()
  const events = sortEventsByTime(getEventsForDate(selectedDate))

  const getCategoryColor = (category) => {
    const colors = {
      personal: "from-blue-500 to-blue-600",
      work: "from-green-500 to-green-600",
      health: "from-red-500 to-red-600",
      social: "from-purple-500 to-purple-600",
      travel: "from-orange-500 to-orange-600",
      education: "from-indigo-500 to-indigo-600",
    }
    return colors[category] || "from-gray-500 to-gray-600"
  }

  const getCategoryBg = (category) => {
    const colors = {
      personal: "from-blue-50 to-blue-100",
      work: "from-green-50 to-green-100",
      health: "from-red-50 to-red-100",
      social: "from-purple-50 to-purple-100",
      travel: "from-orange-50 to-orange-100",
      education: "from-indigo-50 to-indigo-100",
    }
    return colors[category] || "from-gray-50 to-gray-100"
  }

  const getEventsForHour = (hour) => {
    return events.filter((event) => {
      const eventHour = new Date(event.date).getHours()
      return eventHour === hour
    })
  }

  const handleDeleteEvent = (eventId, eventTitle) => {
    if (window.confirm(`Are you sure you want to delete "${eventTitle}"?`)) {
      deleteEvent(eventId)
    }
  }

  const handleAddEventAtTime = (hour) => {
    const eventDate = new Date(selectedDate)
    eventDate.setHours(hour, 0, 0, 0)
    onAddEvent(eventDate)
  }

  const isCurrentHour = (hour) => {
    const now = new Date()
    if (selectedDate.toDateString() !== now.toDateString()) return false
    return now.getHours() === hour
  }

  const isPastHour = (hour) => {
    const now = new Date()
    if (selectedDate.toDateString() !== now.toDateString()) return false
    return now.getHours() > hour
  }

  const EventCard = ({ event }) => (
    <div
      className={`p-3 rounded-lg bg-gradient-to-r ${getCategoryBg(
        event.category,
      )} border border-white/50 group hover:shadow-md transition-all duration-200`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${getCategoryColor(event.category)}`} />
            <h4 className="font-semibold text-slate-800 truncate">{event.title}</h4>
            <span className="text-xs text-slate-500">{formatTime(event.date)}</span>
          </div>

          {event.description && <p className="text-sm text-slate-600 mb-2 line-clamp-2">{event.description}</p>}

          <div className="flex items-center space-x-3 text-xs text-slate-500">
            {event.location && (
              <div className="flex items-center">
                <MapPin className="w-3 h-3 mr-1" />
                {event.location}
              </div>
            )}
            <div className="flex items-center">
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  event.priority === "high"
                    ? "bg-red-100 text-red-700"
                    : event.priority === "medium"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                }`}
              >
                {event.priority}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => onEditEvent(event)}
            className="p-1.5 hover:bg-white/50 rounded-lg transition-colors duration-200"
            title="Edit event"
          >
            <Edit3 className="w-3 h-3 text-slate-600" />
          </button>
          <button
            onClick={() => handleDeleteEvent(event.id, event.title)}
            className="p-1.5 hover:bg-red-100 rounded-lg transition-colors duration-200"
            title="Delete event"
          >
            <Trash2 className="w-3 h-3 text-red-600" />
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-800 flex items-center">
          <Clock className="w-5 h-5 mr-3 text-blue-600" />
          Daily Timeline
        </h3>
        <div className="text-sm text-slate-500">
          {selectedDate.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </div>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {hours.map((hourData) => {
          const hourEvents = getEventsForHour(hourData.hour)
          const isCurrent = isCurrentHour(hourData.hour)
          const isPast = isPastHour(hourData.hour)

          return (
            <div
              key={hourData.hour}
              className={`relative flex items-start space-x-4 p-3 rounded-lg transition-all duration-200 group ${
                isCurrent
                  ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200"
                  : isPast
                    ? "bg-gray-50/50"
                    : "hover:bg-slate-50"
              }`}
            >
              {/* Time Column */}
              <div className="flex-shrink-0 w-20 text-right">
                <div
                  className={`text-sm font-medium ${
                    isCurrent ? "text-blue-600" : isPast ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  {hourData.display}
                </div>
                {isCurrent && <div className="text-xs text-blue-500 font-medium">Now</div>}
              </div>

              {/* Timeline Line */}
              <div className="flex-shrink-0 flex flex-col items-center">
                <div
                  className={`w-3 h-3 rounded-full ${
                    isCurrent
                      ? "bg-blue-500 ring-4 ring-blue-200"
                      : hourEvents.length > 0
                        ? "bg-emerald-500"
                        : isPast
                          ? "bg-slate-300"
                          : "bg-slate-200"
                  }`}
                />
                {hourData.hour < 23 && <div className={`w-px h-12 ${isPast ? "bg-slate-200" : "bg-slate-300"}`} />}
              </div>

              {/* Events Column */}
              <div className="flex-1 min-w-0">
                {hourEvents.length > 0 ? (
                  <div className="space-y-2">
                    {hourEvents.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">No events</span>
                    <button
                      onClick={() => handleAddEventAtTime(hourData.hour)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-blue-100 rounded-lg transition-all duration-200"
                      title={`Add event at ${hourData.display}`}
                    >
                      <Plus className="w-3 h-3 text-blue-600" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Timeline Summary */}
      <div className="mt-6 pt-4 border-t border-slate-200/50">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
            <div className="text-lg font-bold text-blue-600">{events.length}</div>
            <div className="text-xs text-blue-800">Total Events</div>
          </div>
          <div className="p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg">
            <div className="text-lg font-bold text-emerald-600">
              {events.filter((e) => new Date(e.date) > new Date()).length}
            </div>
            <div className="text-xs text-emerald-800">Upcoming</div>
          </div>
          <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
            <div className="text-lg font-bold text-purple-600">
              {events.filter((e) => e.priority === "high").length}
            </div>
            <div className="text-xs text-purple-800">High Priority</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Timeline
