"use client"
import { useCalendar } from "../context/CalendarContext"
import { formatDate, isToday } from "../utils/dateUtils"
import { TrendingUp, Calendar, Users, Clock } from "lucide-react"
import MiniCalendar from "./MiniCalendar"

export default function Sidebar() {
  const { categories, filterCategory, events, dispatch } = useCalendar()

  const todayEvents = events.filter((event) => isToday(event.date))
  const upcomingEvents = events
    .filter((event) => event.date > new Date())
    .sort((a, b) => a.date - b.date)
    .slice(0, 5)

  const getEventsByCategory = () => {
    const eventsByCategory = {}
    categories.forEach((category) => {
      eventsByCategory[category.id] = events.filter((event) => event.category === category.id).length
    })
    return eventsByCategory
  }

  const eventsByCategory = getEventsByCategory()

  return (
    <div style={{ padding: "24px", height: "100%", display: "flex", flexDirection: "column", gap: "32px" }}>
      {/* Categories Section */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "16px",
            fontWeight: "600",
            color: "var(--text-primary)",
          }}
        >
          <TrendingUp style={{ width: "20px", height: "20px", color: "var(--text-secondary)" }} />
          Categories
        </div>

        <MiniCalendar />

        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <button
            onClick={() => dispatch({ type: "SET_FILTER_CATEGORY", payload: "all" })}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "8px 12px",
              borderRadius: "6px",
              cursor: "pointer",
              border: "none",
              background: filterCategory === "all" ? "#97b067" : "transparent",
              color: filterCategory === "all" ? "#2f5249" : "var(--text-primary)",
              width: "100%",
              textAlign: "left",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1, minWidth: 0 }}>
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: "14px", fontWeight: "500" }}>All Events</span>
            </div>
            <span
              style={{
                fontSize: "12px",
                background: filterCategory === "all" ? "rgba(47, 82, 73, 0.2)" : "var(--bg-tertiary)",
                color: filterCategory === "all" ? "#2f5249" : "var(--text-secondary)",
                padding: "2px 6px",
                borderRadius: "10px",
                flexShrink: 0,
              }}
            >
              {events.length}
            </span>
          </button>

          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => dispatch({ type: "SET_FILTER_CATEGORY", payload: category.id })}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px 12px",
                borderRadius: "6px",
                cursor: "pointer",
                border: "none",
                background: filterCategory === category.id ? "#97b067" : "transparent",
                color: filterCategory === category.id ? "#2f5249" : "var(--text-primary)",
                width: "100%",
                textAlign: "left",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: category.color,
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: "14px", fontWeight: "500" }}>{category.name}</span>
              </div>
              <span
                style={{
                  fontSize: "12px",
                  background: filterCategory === category.id ? "rgba(47, 82, 73, 0.2)" : "var(--bg-tertiary)",
                  color: filterCategory === category.id ? "#2f5249" : "var(--text-secondary)",
                  padding: "2px 6px",
                  borderRadius: "10px",
                  flexShrink: 0,
                }}
              >
                {eventsByCategory[category.id] || 0}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Today's Events */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "16px",
            fontWeight: "600",
            color: "var(--text-primary)",
          }}
        >
          <Calendar style={{ width: "20px", height: "20px", color: "var(--text-secondary)" }} />
          Today's Events
        </div>

        {todayEvents.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {todayEvents.map((event) => (
              <div
                key={event.id}
                style={{
                  padding: "12px",
                  border: "1px solid var(--border-primary)",
                  borderRadius: "6px",
                  cursor: "pointer",
                  background: "var(--bg-primary)",
                }}
                onClick={() => {
                  dispatch({ type: "SET_SELECTED_EVENT", payload: event })
                  dispatch({ type: "TOGGLE_EVENT_MODAL" })
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      backgroundColor: categories.find((c) => c.id === event.category)?.color,
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        fontSize: "14px",
                        fontWeight: "500",
                        color: "var(--text-primary)",
                        margin: "0 0 2px 0",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {event.title}
                    </p>
                    <p
                      style={{
                        fontSize: "12px",
                        color: "var(--text-secondary)",
                        margin: 0,
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <Clock style={{ width: "12px", height: "12px" }} />
                      {formatDate(event.date, "h:mm A")}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "32px 16px", color: "var(--text-secondary)" }}>
            <Calendar style={{ width: "48px", height: "48px", color: "var(--text-tertiary)", margin: "0 auto 12px" }} />
            <p style={{ fontSize: "14px", margin: 0 }}>No events today</p>
          </div>
        )}
      </div>

      {/* Upcoming Events */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "16px",
            fontWeight: "600",
            color: "var(--text-primary)",
          }}
        >
          <Users style={{ width: "20px", height: "20px", color: "var(--text-secondary)" }} />
          Upcoming
        </div>

        {upcomingEvents.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                style={{
                  padding: "12px",
                  border: "1px solid var(--border-primary)",
                  borderRadius: "6px",
                  cursor: "pointer",
                  background: "var(--bg-primary)",
                }}
                onClick={() => {
                  dispatch({ type: "SET_SELECTED_EVENT", payload: event })
                  dispatch({ type: "TOGGLE_EVENT_MODAL" })
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      backgroundColor: categories.find((c) => c.id === event.category)?.color,
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        fontSize: "14px",
                        fontWeight: "500",
                        color: "var(--text-primary)",
                        margin: "0 0 2px 0",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {event.title}
                    </p>
                    <p
                      style={{
                        fontSize: "12px",
                        color: "var(--text-secondary)",
                        margin: 0,
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <Clock style={{ width: "12px", height: "12px" }} />
                      {formatDate(event.date, "MMM D, h:mm A")}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "32px 16px", color: "var(--text-secondary)" }}>
            <Users style={{ width: "48px", height: "48px", color: "var(--text-tertiary)", margin: "0 auto 12px" }} />
            <p style={{ fontSize: "14px", margin: 0 }}>No upcoming events</p>
          </div>
        )}
      </div>
    </div>
  )
}
