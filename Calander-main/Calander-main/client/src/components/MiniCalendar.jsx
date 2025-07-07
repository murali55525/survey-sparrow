"use client"

import { ChevronLeft, ChevronRight, Calendar } from "lucide-react"
import { useCalendar } from "../context/CalendarContext"
import {
  getDaysInMonth,
  getFirstDayOfMonth,
  isSameDay,
  isToday,
  formatMonthYear,
  addMonths,
  subMonths,
} from "../utils/dateUtils"

export default function MiniCalendar() {
  const { currentDate, selectedDate, events, dispatch } = useCalendar()

  const daysInMonth = getDaysInMonth(currentDate)
  const firstDayOfMonth = getFirstDayOfMonth(currentDate)

  const calendarDays = []

  // Previous month's trailing days
  const prevMonth = subMonths(currentDate, 1)
  const daysInPrevMonth = getDaysInMonth(prevMonth)

  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i
    const date = new Date(prevMonth.getFullYear(), prevMonth.getMonth(), day)
    calendarDays.push({
      date,
      day,
      isCurrentMonth: false,
      isToday: isToday(date),
      isSelected: selectedDate && isSameDay(date, selectedDate),
      hasEvents: events.some((event) => isSameDay(event.date, date)),
    })
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    calendarDays.push({
      date,
      day,
      isCurrentMonth: true,
      isToday: isToday(date),
      isSelected: selectedDate && isSameDay(date, selectedDate),
      hasEvents: events.some((event) => isSameDay(event.date, date)),
    })
  }

  // Next month's leading days
  const nextMonth = addMonths(currentDate, 1)
  const remainingDays = 42 - calendarDays.length

  for (let day = 1; day <= remainingDays; day++) {
    const date = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), day)
    calendarDays.push({
      date,
      day,
      isCurrentMonth: false,
      isToday: isToday(date),
      isSelected: selectedDate && isSameDay(date, selectedDate),
      hasEvents: events.some((event) => isSameDay(event.date, date)),
    })
  }

  const handleDateClick = (date) => {
    dispatch({ type: "SET_SELECTED_DATE", payload: date })
    dispatch({ type: "SET_CURRENT_DATE", payload: date })
  }

  const handlePrevMonth = () => {
    dispatch({ type: "SET_CURRENT_DATE", payload: subMonths(currentDate, 1) })
  }

  const handleNextMonth = () => {
    dispatch({ type: "SET_CURRENT_DATE", payload: addMonths(currentDate, 1) })
  }

  const weekDays = ["S", "M", "T", "W", "T", "F", "S"]

  return (
    <div
      style={{
        background: "var(--bg-primary)",
        border: "1px solid var(--border-primary)",
        borderRadius: "12px",
        padding: "16px",
        marginBottom: "16px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <button
          onClick={handlePrevMonth}
          style={{
            width: "32px",
            height: "32px",
            border: "none",
            background: "var(--bg-secondary)",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "var(--text-secondary)",
          }}
        >
          <ChevronLeft style={{ width: "16px", height: "16px" }} />
        </button>
        <h3
          style={{
            fontSize: "16px",
            fontWeight: "600",
            color: "var(--text-primary)",
            margin: 0,
          }}
        >
          {formatMonthYear(currentDate)}
        </h3>
        <button
          onClick={handleNextMonth}
          style={{
            width: "32px",
            height: "32px",
            border: "none",
            background: "var(--bg-secondary)",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "var(--text-secondary)",
          }}
        >
          <ChevronRight style={{ width: "16px", height: "16px" }} />
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "4px",
          marginBottom: "8px",
        }}
      >
        {weekDays.map((day, index) => (
          <div
            key={index}
            style={{
              textAlign: "center",
              fontSize: "12px",
              fontWeight: "600",
              color: "var(--text-secondary)",
              padding: "8px 4px",
            }}
          >
            {day}
          </div>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "2px",
        }}
      >
        {calendarDays.map((calendarDay, index) => {
          const { date, day, isCurrentMonth, isToday: isDayToday, isSelected, hasEvents } = calendarDay

          const buttonStyle = {
            position: "relative",
            width: "100%",
            aspectRatio: "1",
            border: "none",
            background: "transparent",
            borderRadius: "6px",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "2px",
            fontSize: "12px",
            lineHeight: 1,
          }

          if (!isCurrentMonth) {
            buttonStyle.opacity = 0.3
          }

          if (isDayToday) {
            buttonStyle.background = "#2f5249"
            buttonStyle.color = "white"
          }

          if (isSelected) {
            buttonStyle.background = "#97b067"
            buttonStyle.color = "#2f5249"
            buttonStyle.fontWeight = "600"
          }

          if (hasEvents) {
            buttonStyle.fontWeight = "600"
          }

          return (
            <button key={index} onClick={() => handleDateClick(date)} style={buttonStyle}>
              <span>{day}</span>
              {hasEvents && (
                <div
                  style={{
                    width: "4px",
                    height: "4px",
                    background: "currentColor",
                    borderRadius: "50%",
                    opacity: 0.7,
                  }}
                />
              )}
            </button>
          )
        })}
      </div>

      <div
        style={{
          marginTop: "16px",
          paddingTop: "16px",
          borderTop: "1px solid var(--border-primary)",
        }}
      >
        <button
          onClick={() => {
            const today = new Date()
            dispatch({ type: "SET_CURRENT_DATE", payload: today })
            dispatch({ type: "SET_SELECTED_DATE", payload: today })
          }}
          style={{
            width: "100%",
            padding: "8px 12px",
            border: "1px solid var(--border-primary)",
            background: "var(--bg-secondary)",
            color: "var(--text-secondary)",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: "500",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
          }}
        >
          <Calendar style={{ width: "16px", height: "16px" }} />
          Today
        </button>
      </div>
    </div>
  )
}
