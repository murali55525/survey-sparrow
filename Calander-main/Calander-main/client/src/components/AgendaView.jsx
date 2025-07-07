"use client"

import { useState } from "react"
import { Calendar, Clock, MapPin, Users, Tag, ChevronRight } from "lucide-react"
import { useCalendar } from "../context/CalendarContext"
import { formatDate, isSameDay } from "../utils/dateUtils"

export default function AgendaView() {
  const { events, categories, filterCategory, searchTerm, selectedDate, dispatch } = useCalendar()
  const [timeframe, setTimeframe] = useState("week") // week, month, all

  const getFilteredEvents = () => {
    let filtered = [...events]

    // Filter by category
    if (filterCategory !== "all") {
      filtered = filtered.filter((event) => event.category === filterCategory)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (event.description && event.description.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    // Filter by timeframe
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    switch (timeframe) {
      case "week":
        const weekStart = new Date(today.getTime() - today.getDay() * 24 * 60 * 60 * 1000)
        const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000)
        filtered = filtered.filter((event) => {
          const eventDate = new Date(event.date)
          return eventDate >= weekStart && eventDate < weekEnd
        })
        break
      case "month":
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
        const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)
        filtered = filtered.filter((event) => {
          const eventDate = new Date(event.date)
          return eventDate >= monthStart && eventDate <= monthEnd
        })
        break
      default:
        // Show all events
        break
    }

    return filtered.sort((a, b) => new Date(a.date) - new Date(b.date))
  }

  const groupEventsByDate = (events) => {
    const grouped = {}
    events.forEach((event) => {
      const dateKey = formatDate(event.date, "YYYY-MM-DD")
      if (!grouped[dateKey]) {
        grouped[dateKey] = []
      }
      grouped[dateKey].push(event)
    })
    return grouped
  }

  const getCategoryColor = (categoryId) => {
    const category = categories.find((c) => c.id === categoryId)
    return category ? category.color : "#6b7280"
  }

  const handleEventClick = (event) => {
    dispatch({ type: "SET_SELECTED_EVENT", payload: event })
    dispatch({ type: "TOGGLE_EVENT_MODAL" })
  }

  const filteredEvents = getFilteredEvents()
  const groupedEvents = groupEventsByDate(filteredEvents)

  const isToday = (dateString) => {
    const today = new Date()
    const eventDate = new Date(dateString)
    return isSameDay(today, eventDate)
  }

  const isPast = (dateString) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const eventDate = new Date(dateString)
    eventDate.setHours(0, 0, 0, 0)
    return eventDate < today
  }

  const getTimeframeTitle = () => {
    switch (timeframe) {
      case "week":
        return "This Week"
      case "month":
        return "This Month"
      default:
        return "All Events"
    }
  }

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
          paddingBottom: "16px",
          borderBottom: "2px solid var(--border-primary)",
        }}
      >
        <h2
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            fontSize: "28px",
            fontWeight: "700",
            color: "var(--text-primary)",
            margin: 0,
          }}
        >
          <Calendar style={{ width: "24px", height: "24px" }} />
          Agenda View - {getTimeframeTitle()}
        </h2>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            style={{
              padding: "8px 12px",
              border: "1px solid var(--border-primary)",
              borderRadius: "8px",
              background: "var(--bg-primary)",
              color: "var(--text-primary)",
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="all">All Events</option>
          </select>

          <button
            onClick={() => dispatch({ type: "TOGGLE_EVENT_MODAL" })}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 20px",
              background: "#2f5249",
              color: "white",
              border: "none",
              borderRadius: "10px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Add Event
          </button>
        </div>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "16px",
          marginBottom: "32px",
        }}
      >
        <div
          style={{
            padding: "20px",
            background: "linear-gradient(135deg, #97b067, #e3de61)",
            borderRadius: "12px",
            textAlign: "center",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div
            style={{
              fontSize: "32px",
              fontWeight: "700",
              color: "#2f5249",
              marginBottom: "4px",
            }}
          >
            {filteredEvents.length}
          </div>
          <div
            style={{
              fontSize: "14px",
              fontWeight: "500",
              color: "#2f5249",
              opacity: 0.8,
            }}
          >
            Total Events
          </div>
        </div>
        <div
          style={{
            padding: "20px",
            background: "linear-gradient(135deg, #97b067, #e3de61)",
            borderRadius: "12px",
            textAlign: "center",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div
            style={{
              fontSize: "32px",
              fontWeight: "700",
              color: "#2f5249",
              marginBottom: "4px",
            }}
          >
            {Object.keys(groupedEvents).filter((date) => isToday(date)).length > 0
              ? groupedEvents[Object.keys(groupedEvents).find((date) => isToday(date))]?.length || 0
              : 0}
          </div>
          <div
            style={{
              fontSize: "14px",
              fontWeight: "500",
              color: "#2f5249",
              opacity: 0.8,
            }}
          >
            Today
          </div>
        </div>
        <div
          style={{
            padding: "20px",
            background: "linear-gradient(135deg, #97b067, #e3de61)",
            borderRadius: "12px",
            textAlign: "center",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div
            style={{
              fontSize: "32px",
              fontWeight: "700",
              color: "#2f5249",
              marginBottom: "4px",
            }}
          >
            {filteredEvents.filter((e) => new Date(e.date) > new Date()).length}
          </div>
          <div
            style={{
              fontSize: "14px",
              fontWeight: "500",
              color: "#2f5249",
              opacity: 0.8,
            }}
          >
            Upcoming
          </div>
        </div>
      </div>

      {/* Events List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {Object.keys(groupedEvents).length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              background: "var(--bg-primary)",
              borderRadius: "16px",
              border: "2px dashed var(--border-primary)",
            }}
          >
            <Calendar style={{ width: "64px", height: "64px", color: "#cbd5e1", margin: "0 auto 16px" }} />
            <h3 style={{ fontSize: "24px", fontWeight: "600", color: "var(--text-primary)", margin: "0 0 8px 0" }}>
              No events found
            </h3>
            <p style={{ color: "var(--text-secondary)", marginBottom: "24px", fontSize: "16px" }}>
              No events match your current filters. Try adjusting your search or filters.
            </p>
            <button
              onClick={() => dispatch({ type: "TOGGLE_EVENT_MODAL" })}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 20px",
                background: "#2f5249",
                color: "white",
                border: "none",
                borderRadius: "10px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Create Your First Event
            </button>
          </div>
        ) : (
          Object.entries(groupedEvents).map(([date, dayEvents]) => (
            <div
              key={date}
              style={{
                background: "var(--bg-primary)",
                borderRadius: "16px",
                border: "1px solid var(--border-primary)",
                overflow: "hidden",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                opacity: isPast(date) ? 0.7 : 1,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "20px 24px",
                  background: "linear-gradient(135deg, var(--bg-secondary), var(--bg-tertiary))",
                  borderBottom: "1px solid var(--border-primary)",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <div style={{ fontSize: "18px", fontWeight: "600", color: "var(--text-primary)" }}>
                    {formatDate(new Date(date), "dddd")}
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      color: "var(--text-secondary)",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    {formatDate(new Date(date), "MMM D, YYYY")}
                    {isToday(date) && (
                      <span
                        style={{
                          background: "#2f5249",
                          color: "white",
                          padding: "4px 8px",
                          borderRadius: "12px",
                          fontSize: "11px",
                          fontWeight: "600",
                          textTransform: "uppercase",
                        }}
                      >
                        Today
                      </span>
                    )}
                  </div>
                </div>
                <div
                  style={{
                    background: "#97b067",
                    color: "#2f5249",
                    padding: "6px 12px",
                    borderRadius: "20px",
                    fontSize: "13px",
                    fontWeight: "600",
                  }}
                >
                  {dayEvents.length} events
                </div>
              </div>

              <div style={{ padding: "8px" }}>
                {dayEvents.map((event) => (
                  <div
                    key={event.id}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "16px",
                      padding: "16px",
                      borderRadius: "12px",
                      marginBottom: "8px",
                      cursor: "pointer",
                      border: "1px solid transparent",
                    }}
                    onClick={() => handleEventClick(event)}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        fontSize: "13px",
                        fontWeight: "600",
                        color: "#2f5249",
                        background: "#97b067",
                        padding: "8px 12px",
                        borderRadius: "8px",
                        minWidth: "100px",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Clock style={{ width: "14px", height: "14px" }} />
                      {event.allDay ? "All Day" : formatDate(event.date, "h:mm A")}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          marginBottom: "8px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            flex: 1,
                          }}
                        >
                          <div
                            style={{
                              width: "8px",
                              height: "8px",
                              borderRadius: "50%",
                              backgroundColor: getCategoryColor(event.category),
                              flexShrink: 0,
                            }}
                          />
                          <h4
                            style={{
                              fontSize: "16px",
                              fontWeight: "600",
                              color: "var(--text-primary)",
                              margin: 0,
                              flex: 1,
                            }}
                          >
                            {event.title}
                          </h4>
                          {event.priority === "high" && (
                            <span
                              style={{
                                padding: "2px 8px",
                                borderRadius: "12px",
                                fontSize: "10px",
                                fontWeight: "600",
                                textTransform: "uppercase",
                                background: "#fee2e2",
                                color: "#dc2626",
                              }}
                            >
                              High Priority
                            </span>
                          )}
                        </div>
                        <ChevronRight style={{ width: "16px", height: "16px", color: "#9ca3af" }} />
                      </div>

                      {event.description && (
                        <p
                          style={{
                            color: "var(--text-secondary)",
                            fontSize: "14px",
                            margin: "0 0 12px 0",
                            lineHeight: 1.5,
                          }}
                        >
                          {event.description}
                        </p>
                      )}

                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "16px",
                          marginTop: "8px",
                        }}
                      >
                        {event.location && (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                              fontSize: "13px",
                              color: "var(--text-secondary)",
                            }}
                          >
                            <MapPin style={{ width: "14px", height: "14px", color: "var(--text-tertiary)" }} />
                            <span>{event.location}</span>
                          </div>
                        )}
                        {event.attendees && (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                              fontSize: "13px",
                              color: "var(--text-secondary)",
                            }}
                          >
                            <Users style={{ width: "14px", height: "14px", color: "var(--text-tertiary)" }} />
                            <span>{event.attendees.split(",").length} attendees</span>
                          </div>
                        )}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            fontSize: "13px",
                            color: "var(--text-secondary)",
                          }}
                        >
                          <Tag style={{ width: "14px", height: "14px", color: "var(--text-tertiary)" }} />
                          <span style={{ textTransform: "capitalize" }}>
                            {categories.find((c) => c.id === event.category)?.name || event.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
