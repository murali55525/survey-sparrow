"use client"

import React from "react"
import { useCalendar } from "../context/CalendarContext"
import { getWeekDays, startOfWeek, formatDate, isToday, isSameDay, getEventPosition } from "../utils/dateUtils"

export default function WeekView() {
  const { currentDate, selectedDate, events, categories, filterCategory, searchTerm, dispatch } = useCalendar()

  const weekStart = startOfWeek(currentDate)
  const weekDays = getWeekDays(weekStart)
  const timeSlots = Array.from({ length: 24 }, (_, i) => i)

  const getEventsForDay = (date) => {
    let dayEvents = events.filter((event) => isSameDay(event.date, date))

    if (filterCategory !== "all") {
      dayEvents = dayEvents.filter((event) => event.category === filterCategory)
    }

    if (searchTerm) {
      dayEvents = dayEvents.filter(
        (event) =>
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (event.description && event.description.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    return dayEvents.sort((a, b) => a.date - b.date)
  }

  const handleEventClick = (event) => {
    dispatch({ type: "SET_SELECTED_EVENT", payload: event })
    dispatch({ type: "TOGGLE_EVENT_MODAL" })
  }

  const getCategoryColor = (categoryId) => {
    const category = categories.find((c) => c.id === categoryId)
    return category ? category.color : "#6b7280"
  }

  return (
    <div style={{ padding: "24px" }}>
      {/* Week header */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "80px repeat(7, 1fr)",
          gap: "1px",
          background: "#e5e7eb",
          borderRadius: "8px 8px 0 0",
          overflow: "hidden",
          marginBottom: "4px",
        }}
      >
        <div
          style={{
            background: "var(--bg-secondary)",
            padding: "16px 8px",
            textAlign: "center",
            fontWeight: "600",
            color: "var(--text-secondary)",
          }}
        ></div>
        {weekDays.map((day) => (
          <div
            key={day.toISOString()}
            style={{
              background: "var(--bg-secondary)",
              padding: "16px 8px",
              textAlign: "center",
              borderRight: "1px solid var(--border-primary)",
            }}
          >
            <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px" }}>
              {formatDate(day, "ddd")}
            </div>
            <div
              style={{
                fontSize: "16px",
                fontWeight: "600",
                color: isToday(day) ? "#2f5249" : "var(--text-primary)",
              }}
            >
              {day.getDate()}
            </div>
          </div>
        ))}
      </div>

      {/* Time grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "80px repeat(7, 1fr)",
          gap: "1px",
          background: "#e5e7eb",
          borderRadius: "0 0 8px 8px",
          overflow: "hidden",
          minHeight: "1440px",
        }}
      >
        {timeSlots.map((hour) => (
          <React.Fragment key={hour}>
            <div
              style={{
                background: "var(--bg-primary)",
                borderRight: "1px solid var(--border-primary)",
                padding: "8px",
                textAlign: "right",
                fontSize: "12px",
                color: "var(--text-secondary)",
                minHeight: "60px",
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "flex-end",
                paddingTop: "8px",
              }}
            >
              {hour === 0 ? "12 AM" : hour < 12 ? `${hour} AM` : hour === 12 ? "12 PM" : `${hour - 12} PM`}
            </div>
            {weekDays.map((day) => {
              const dayEvents = getEventsForDay(day).filter((event) => {
                const eventHour = event.date.getHours()
                return eventHour === hour
              })

              return (
                <div
                  key={`${day.toISOString()}-${hour}`}
                  style={{
                    background: "var(--bg-primary)",
                    position: "relative",
                    minHeight: "60px",
                    borderRight: "1px solid var(--border-primary)",
                  }}
                >
                  {dayEvents.map((event) => {
                    const position = getEventPosition(event)
                    return (
                      <div
                        key={event.id}
                        style={{
                          position: "absolute",
                          left: "4px",
                          right: "4px",
                          borderRadius: "4px",
                          padding: "4px 8px",
                          fontSize: "12px",
                          cursor: "pointer",
                          zIndex: 10,
                          minHeight: "20px",
                          fontWeight: "500",
                          color: "white",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          backgroundColor: getCategoryColor(event.category),
                          top: `${position.top}%`,
                          height: `${Math.max(position.height, 10)}%`,
                        }}
                        onClick={() => handleEventClick(event)}
                        title={`${event.title} - ${formatDate(event.date, "h:mm A")}`}
                      >
                        <div
                          style={{
                            fontWeight: "600",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {event.title}
                        </div>
                        <div style={{ fontSize: "10px", opacity: "0.9" }}>{formatDate(event.date, "h:mm A")}</div>
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}
