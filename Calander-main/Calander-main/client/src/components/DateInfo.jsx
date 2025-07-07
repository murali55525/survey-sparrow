"use client"

import { Clock, Calendar, Sun, Plus, TrendingUp } from "lucide-react"
import { useEvents } from "../context/EventContext"
import { getDayOfYear, getWeekNumber, getQuarter, formatDate, getRelativeTime } from "../utils/dateUtils"

const DateInfo = ({ selectedDate, onAddEvent }) => {
  const { getEventsForDate } = useEvents()

  if (!selectedDate) return null

  const dayOfYear = getDayOfYear(selectedDate)
  const weekNumber = getWeekNumber(selectedDate)
  const quarter = getQuarter(selectedDate)
  const eventsCount = getEventsForDate(selectedDate).length
  const isToday = selectedDate.toDateString() === new Date().toDateString()
  const relativeTime = getRelativeTime(selectedDate)

  // Calculate progress through the year
  const yearProgress = (dayOfYear / 365) * 100

  return (
    <div className="glass-card rounded-2xl p-6 bounce-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-800 flex items-center">
          <div className="w-2 h-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full mr-3"></div>
          Selected Date
        </h3>
        <button
          onClick={onAddEvent}
          className="p-2 hover:bg-emerald-100 rounded-lg transition-colors duration-200 group"
          title="Add event for this date"
        >
          <Plus className="w-4 h-4 text-emerald-600 group-hover:text-emerald-700" />
        </button>
      </div>

      <div className="space-y-4">
        {/* Main Date Display */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100/50">
          <div className="flex items-center mb-2">
            <Calendar className="w-4 h-4 text-blue-600 mr-2" />
            <span className="text-sm font-medium text-blue-800">{isToday ? "Today" : "Selected Date"}</span>
          </div>
          <p className="text-slate-700 font-semibold">{formatDate(selectedDate)}</p>
          {!isToday && <p className="text-sm text-slate-500 mt-1">{relativeTime}</p>}
        </div>

        {/* Date Statistics Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-100/50">
            <div className="flex items-center mb-1">
              <Sun className="w-3 h-3 text-emerald-600 mr-1" />
              <span className="text-xs font-medium text-emerald-800">Day of Year</span>
            </div>
            <p className="text-sm font-bold text-emerald-700">{dayOfYear}</p>
          </div>

          <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100/50">
            <div className="flex items-center mb-1">
              <Clock className="w-3 h-3 text-purple-600 mr-1" />
              <span className="text-xs font-medium text-purple-800">Week #</span>
            </div>
            <p className="text-sm font-bold text-purple-700">{weekNumber}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-100/50">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-orange-800">Quarter</span>
              <span className="text-sm font-bold text-orange-700">Q{quarter}</span>
            </div>
          </div>

          <div className="p-3 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg border border-cyan-100/50">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-cyan-800">Events</span>
              <span className="text-sm font-bold text-cyan-700">{eventsCount}</span>
            </div>
          </div>
        </div>

        {/* Year Progress */}
        <div className="p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100/50">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <TrendingUp className="w-3 h-3 text-indigo-600 mr-1" />
              <span className="text-sm font-medium text-indigo-800">Year Progress</span>
            </div>
            <span className="text-sm font-bold text-indigo-700">{Math.round(yearProgress)}%</span>
          </div>
          <div className="w-full bg-indigo-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${yearProgress}%` }}
            />
          </div>
        </div>

        {/* Day Type Indicator */}
        <div className="p-3 bg-gradient-to-r from-slate-50 to-gray-50 rounded-lg border border-slate-100/50">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-800">Day Type</span>
            <div className="flex items-center space-x-2">
              {selectedDate.getDay() === 0 || selectedDate.getDay() === 6 ? (
                <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                  Weekend
                </span>
              ) : (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">Weekday</span>
              )}
              {isToday && (
                <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                  Today
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DateInfo
