"use client"
import { useCalendar } from "../context/CalendarContext"
import { getMonthCalendarDays, formatDate, isToday, isSameDay } from "../utils/dateUtils"
import { Plus } from "lucide-react"

export default function MonthView() {
  const { currentDate, selectedDate, events, categories, filterCategory, searchTerm, dispatch } = useCalendar()

  const calendarDays = getMonthCalendarDays(currentDate)
  const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

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

  const handleDayClick = (date) => {
    dispatch({ type: "SET_SELECTED_DATE", payload: date })
  }

  const handleEventClick = (event, e) => {
    e.stopPropagation()
    dispatch({ type: "SET_SELECTED_EVENT", payload: event })
    dispatch({ type: "TOGGLE_EVENT_MODAL" })
  }

  const handleAddEvent = (date, e) => {
    e.stopPropagation()
    dispatch({ type: "SET_SELECTED_DATE", payload: date })
    dispatch({ type: "SET_SELECTED_EVENT", payload: null })
    dispatch({ type: "TOGGLE_EVENT_MODAL" })
  }

  const getCategoryColor = (categoryId) => {
    const category = categories.find((c) => c.id === categoryId)
    return category ? category.color : "#6b7280"
  }

  const isOtherMonth = (date) => {
    return date.getMonth() !== currentDate.getMonth()
  }

  return (
    <div style={{ padding: "24px" }}>
      <div
        style={{
          background: "var(--bg-primary)",
          border: "1px solid var(--border-primary)",
          borderRadius: "8px",
          overflow: "hidden",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Week day headers */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            background: "var(--bg-secondary)",
            borderBottom: "1px solid var(--border-primary)",
          }}
        >
          {weekDays.map((day) => (
            <div
              key={day}
              style={{
                padding: "16px 8px",
                textAlign: "center",
                fontSize: "14px",
                fontWeight: "600",
                color: "var(--text-secondary)",
                borderRight: "1px solid var(--border-primary)",
              }}
            >
              <div className="hidden md:block">{day}</div>
              <div className="md:hidden">{day.slice(0, 3)}</div>
            </div>
          ))}
        </div>

        {/* Calendar days grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
          }}
        >
          {calendarDays.map((date, index) => {
            const dayEvents = getEventsForDay(date)
            const isCurrentDay = isToday(date)
            const isSelected = isSameDay(date, selectedDate)
            const isOtherMonthDay = isOtherMonth(date)

            const dayStyle = {
              minHeight: "120px",
              padding: "8px",
              borderRight: "1px solid var(--border-primary)",
              borderBottom: "1px solid var(--border-primary)",
              cursor: "pointer",
              background: "var(--bg-primary)",
              position: "relative",
            }

            if (isOtherMonthDay) {
              dayStyle.background = "var(--bg-secondary)"
              dayStyle.color = "var(--text-tertiary)"
            }

            if (isCurrentDay) {
              dayStyle.background = "var(--bg-secondary)"
              dayStyle.borderLeft = "3px solid #2f5249"
            }

            if (isSelected) {
              dayStyle.background = "var(--bg-tertiary)"
              dayStyle.borderLeft = "3px solid #437059"
            }

            return (
              <div key={index} style={dayStyle} onClick={() => handleDayClick(date)}>
                {/* Day header */}
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
                      fontSize: "14px",
                      fontWeight: "600",
                      color: isCurrentDay ? "white" : "var(--text-primary)",
                      background: isCurrentDay ? "#2f5249" : "transparent",
                      width: isCurrentDay ? "24px" : "auto",
                      height: isCurrentDay ? "24px" : "auto",
                      borderRadius: isCurrentDay ? "50%" : "0",
                      display: isCurrentDay ? "flex" : "block",
                      alignItems: isCurrentDay ? "center" : "normal",
                      justifyContent: isCurrentDay ? "center" : "normal",
                      fontSize: isCurrentDay ? "12px" : "14px",
                    }}
                  >
                    {date.getDate()}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", opacity: 0 }}>
                    {dayEvents.length > 3 && (
                      <span
                        style={{
                          fontSize: "10px",
                          background: "var(--border-primary)",
                          color: "var(--text-secondary)",
                          padding: "2px 6px",
                          borderRadius: "10px",
                        }}
                      >
                        +{dayEvents.length - 3}
                      </span>
                    )}
                    <button
                      onClick={(e) => handleAddEvent(date, e)}
                      style={{
                        width: "20px",
                        height: "20px",
                        background: "#2f5249",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      title="Add event"
                    >
                      <Plus style={{ width: "12px", height: "12px" }} />
                    </button>
                  </div>
                </div>

                {/* Events */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "2px",
                    maxHeight: "80px",
                    overflowY: "auto",
                  }}
                >
                  {dayEvents.slice(0, 3).map((event) => (
                    <div
                      key={event.id}
                      style={{
                        fontSize: "11px",
                        padding: "2px 6px",
                        borderRadius: "3px",
                        color: "white",
                        cursor: "pointer",
                        backgroundColor: getCategoryColor(event.category),
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                      onClick={(e) => handleEventClick(event, e)}
                      title={`${event.title} - ${formatDate(event.date, "h:mm A")}`}
                    >
                      {event.title}
                      {event.isRecurring && " ↻"}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
