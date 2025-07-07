"use client"

import React from "react"
import { useCalendar } from "../context/CalendarContext"
import { formatDate, isToday, isSameDay, getEventPosition } from "../utils/dateUtils"
import { MapPin } from "lucide-react"

export default function DayView() {
  const { currentDate, events, categories, filterCategory, searchTerm, dispatch } = useCalendar()

  const timeSlots = Array.from({ length: 24 }, (_, i) => i)

  const getEventsForDay = () => {
    let dayEvents = events.filter((event) => isSameDay(event.date, currentDate))

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

  const dayEvents = getEventsForDay()

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
      {/* Day header */}
      <div style={{ marginBottom: "24px", textAlign: "center" }}>
        <h2
          style={{
            fontSize: "24px",
            fontWeight: "700",
            color: "var(--text-primary)",
            marginBottom: "8px",
          }}
        >
          {formatDate(currentDate, "dddd, MMMM D, YYYY")}
        </h2>
        {isToday(currentDate) && <p style={{ color: "#2f5249", fontWeight: "500" }}>Today</p>}
      </div>

      {/* Events summary */}
      <div
        style={{
          marginBottom: "24px",
          padding: "16px",
          background: "var(--bg-secondary)",
          borderRadius: "8px",
          border: "1px solid var(--border-primary)",
        }}
      >
        <h3
          style={{
            fontWeight: "600",
            color: "var(--text-primary)",
            marginBottom: "8px",
          }}
        >
          {dayEvents.length} event{dayEvents.length !== 1 ? "s" : ""} today
        </h3>
        {dayEvents.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {dayEvents.slice(0, 3).map((event) => (
              <div
                key={event.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "14px",
                }}
              >
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: getCategoryColor(event.category),
                  }}
                />
                <span>{formatDate(event.date, "h:mm A")}</span>
                <span>{event.title}</span>
              </div>
            ))}
            {dayEvents.length > 3 && (
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "4px" }}>
                +{dayEvents.length - 3} more events
              </p>
            )}
          </div>
        )}
      </div>

      {/* Time grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "80px 1fr",
          gap: 0,
          border: "1px solid var(--border-primary)",
          borderRadius: "8px",
          overflow: "hidden",
          background: "var(--bg-primary)",
        }}
      >
        {timeSlots.map((hour) => (
          <React.Fragment key={hour}>
            <div
              style={{
                padding: "12px 8px",
                textAlign: "right",
                fontSize: "12px",
                color: "var(--text-secondary)",
                borderBottom: "1px solid var(--border-primary)",
                background: "var(--bg-secondary)",
                minHeight: "60px",
              }}
            >
              {hour === 0 ? "12 AM" : hour < 12 ? `${hour} AM` : hour === 12 ? "12 PM" : `${hour - 12} PM`}
            </div>
            <div
              style={{
                position: "relative",
                borderBottom: "1px solid var(--border-primary)",
                background: "var(--bg-primary)",
                minHeight: "60px",
                padding: "4px 8px",
              }}
            >
              {dayEvents
                .filter((event) => event.date.getHours() === hour)
                .map((event) => {
                  const position = getEventPosition(event)
                  return (
                    <div
                      key={event.id}
                      style={{
                        position: "absolute",
                        left: "8px",
                        right: "8px",
                        borderRadius: "6px",
                        padding: "8px 12px",
                        cursor: "pointer",
                        color: "white",
                        fontWeight: "500",
                        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                        backgroundColor: getCategoryColor(event.category),
                        top: `${position.top}%`,
                        height: `${Math.max(position.height, 15)}%`,
                      }}
                      onClick={() => handleEventClick(event)}
                    >
                      <div
                        style={{
                          fontWeight: "600",
                          marginBottom: "4px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {event.title}
                      </div>
                      <div
                        style={{
                          fontSize: "11px",
                          opacity: "0.9",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <span>{formatDate(event.date, "h:mm A")}</span>
                        {event.location && (
                          <>
                            <MapPin style={{ width: "10px", height: "10px" }} />
                            <span>{event.location}</span>
                          </>
                        )}
                      </div>
                      {event.description && (
                        <div
                          style={{
                            fontSize: "11px",
                            opacity: "0.8",
                            marginTop: "4px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {event.description}
                        </div>
                      )}
                    </div>
                  )
                })}
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}
