"use client"

import { useState } from "react"
import { Clock, MapPin, Edit3, Trash2, Calendar, Tag } from "lucide-react"
import { useEvents } from "../context/EventContext"

const EventList = ({ selectedDate, onEditEvent }) => {
  const { getEventsForDate, deleteEvent, getUpcomingEvents } = useEvents()
  const [showAll, setShowAll] = useState(false)

  const selectedDateEvents = getEventsForDate(selectedDate)
  const upcomingEvents = getUpcomingEvents(10)

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

  const getPriorityColor = (priority) => {
    const colors = {
      low: "text-green-600",
      medium: "text-yellow-600",
      high: "text-red-600",
    }
    return colors[priority] || "text-gray-600"
  }

  const formatEventTime = (date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  const formatEventDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  const handleDeleteEvent = (eventId, eventTitle) => {
    if (window.confirm(`Are you sure you want to delete "${eventTitle}"?`)) {
      deleteEvent(eventId)
    }
  }

  const EventCard = ({ event, showDate = false }) => (
    <div
      className={`p-4 rounded-xl bg-gradient-to-r ${getCategoryBg(event.category)} border border-white/50 hover:shadow-lg transition-all duration-300 group`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${getCategoryColor(event.category)}`}></div>
            <h4 className="font-semibold text-slate-800 group-hover:text-slate-900">{event.title}</h4>
            <span className={`text-xs font-medium ${getPriorityColor(event.priority)}`}>
              {event.priority.toUpperCase()}
            </span>
          </div>

          {event.description && <p className="text-sm text-slate-600 mb-2 line-clamp-2">{event.description}</p>}

          <div className="flex items-center space-x-4 text-xs text-slate-500">
            {showDate && (
              <div className="flex items-center">
                <Calendar className="w-3 h-3 mr-1" />
                {formatEventDate(event.date)}
              </div>
            )}
            <div className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {formatEventTime(event.date)}
            </div>
            {event.location && (
              <div className="flex items-center">
                <MapPin className="w-3 h-3 mr-1" />
                {event.location}
              </div>
            )}
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
    <div className="space-y-6">
      {/* Selected Date Events */}
      <div className="glass-card rounded-2xl p-6 fade-in" style={{ animationDelay: "0.3s" }}>
        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
          <div className="w-2 h-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full mr-3"></div>
          Events for {selectedDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        </h3>

        {selectedDateEvents.length > 0 ? (
          <div className="space-y-3">
            {selectedDateEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No events for this date</p>
            <button
              onClick={() => onEditEvent(null)}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2"
            >
              Add an event
            </button>
          </div>
        )}
      </div>

      {/* Upcoming Events */}
      <div className="glass-card rounded-2xl p-6 fade-in" style={{ animationDelay: "0.4s" }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800 flex items-center">
            <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full mr-3"></div>
            Upcoming Events
          </h3>
          {upcomingEvents.length > 5 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              {showAll ? "Show Less" : "Show All"}
            </button>
          )}
        </div>

        {upcomingEvents.length > 0 ? (
          <div className="space-y-3">
            {(showAll ? upcomingEvents : upcomingEvents.slice(0, 5)).map((event) => (
              <EventCard key={event.id} event={event} showDate={true} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Tag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No upcoming events</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default EventList
