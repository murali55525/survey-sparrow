"use client"
import { Calendar, ChevronLeft, ChevronRight, Plus, Search, Settings, Bell, Upload } from "lucide-react"
import { useCalendar } from "../context/CalendarContext"
import { formatDate, addMonths, addWeeks, addDays } from "../utils/dateUtils"
import { useState, useEffect } from "react"

export default function Header() {
  const { view, currentDate, searchTerm, dispatch, notifications } = useCalendar()
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const handlePrevious = () => {
    let newDate
    switch (view) {
      case "month":
        newDate = addMonths(currentDate, -1)
        break
      case "week":
        newDate = addWeeks(currentDate, -1)
        break
      case "day":
        newDate = addDays(currentDate, -1)
        break
      default:
        newDate = currentDate
    }
    dispatch({ type: "SET_CURRENT_DATE", payload: newDate })
  }

  const handleNext = () => {
    let newDate
    switch (view) {
      case "month":
        newDate = addMonths(currentDate, 1)
        break
      case "week":
        newDate = addWeeks(currentDate, 1)
        break
      case "day":
        newDate = addDays(currentDate, 1)
        break
      default:
        newDate = currentDate
    }
    dispatch({ type: "SET_CURRENT_DATE", payload: newDate })
  }

  const handleToday = () => {
    const today = new Date()
    dispatch({ type: "SET_CURRENT_DATE", payload: today })
    dispatch({ type: "SET_SELECTED_DATE", payload: today })
  }

  const getDateTitle = () => {
    switch (view) {
      case "month":
        return formatDate(currentDate, "MMMM YYYY")
      case "week":
        return `Week of ${formatDate(currentDate, "MMM D, YYYY")}`
      case "day":
        return formatDate(currentDate, "dddd, MMMM D, YYYY")
      case "agenda":
        return "Agenda View"
      default:
        return formatDate(currentDate, "MMMM YYYY")
    }
  }

  const requestNotificationPermission = async () => {
    if ("Notification" in window && Notification.permission === "default") {
      await Notification.requestPermission()
    }
  }

  return (
    <div
      style={{
        padding: "16px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "24px",
        flexWrap: "wrap",
        background: "var(--bg-primary)",
        borderBottom: "1px solid var(--border-primary)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "24px", flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              background: "linear-gradient(135deg, #2f5249, #437059)",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
            }}
          >
            <Calendar />
          </div>
          <div>
            <h1 style={{ fontSize: "20px", fontWeight: "700", color: "var(--text-primary)", margin: 0 }}>
              ProCalendar
            </h1>
            <p style={{ fontSize: "12px", color: "var(--text-secondary)", margin: 0 }}>Professional Calendar Suite</p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            onClick={handleToday}
            style={{
              padding: "8px 16px",
              border: "1px solid var(--border-primary)",
              background: "var(--bg-primary)",
              color: "var(--text-secondary)",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: "500",
              cursor: "pointer",
            }}
          >
            Today
          </button>
          <button
            onClick={handlePrevious}
            style={{
              padding: "8px",
              border: "1px solid var(--border-primary)",
              background: "var(--bg-primary)",
              borderRadius: "6px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ChevronLeft />
          </button>
          <button
            onClick={handleNext}
            style={{
              padding: "8px",
              border: "1px solid var(--border-primary)",
              background: "var(--bg-primary)",
              borderRadius: "6px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ChevronRight />
          </button>
          <div style={{ fontSize: "18px", fontWeight: "600", color: "var(--text-primary)", marginLeft: "12px" }}>
            {getDateTitle()}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "16px", flexShrink: 0 }}>
        <div style={{ position: "relative" }}>
          <Search
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--text-tertiary)",
              width: "16px",
              height: "16px",
            }}
          />
          {/* <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => dispatch({ type: "SET_SEARCH_TERM", payload: e.target.value })}
            style={{
              width: "300px",
              padding: "8px 12px 8px 36px",
              border: "1px solid var(--border-primary)",
              borderRadius: "6px",
              fontSize: "14px",
              background: "var(--bg-primary)",
              color: "var(--text-primary)",
            }}
          /> */}
        </div>

        <div
          style={{
            display: "flex",
            background: "var(--bg-tertiary)",
            borderRadius: "6px",
            padding: "2px",
          }}
        >
          {["month", "week", "day", "agenda"].map((viewType) => (
            <button
              key={viewType}
              onClick={() => dispatch({ type: "SET_VIEW", payload: viewType })}
              style={{
                padding: "6px 12px",
                border: "none",
                background: view === viewType ? "var(--bg-primary)" : "transparent",
                color: view === viewType ? "var(--text-primary)" : "var(--text-secondary)",
                fontSize: "14px",
                fontWeight: "500",
                borderRadius: "4px",
                cursor: "pointer",
                boxShadow: view === viewType ? "0 1px 2px rgba(0, 0, 0, 0.1)" : "none",
              }}
            >
              {viewType.charAt(0).toUpperCase() + viewType.slice(1)}
            </button>
          ))}
        </div>

        <button
          onClick={requestNotificationPermission}
          style={{
            padding: "8px",
            border: "1px solid var(--border-primary)",
            background: "var(--bg-primary)",
            borderRadius: "6px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
          title="Enable notifications"
        >
          <Bell />
          {notifications.length > 0 && (
            <span
              style={{
                position: "absolute",
                top: "-4px",
                right: "-4px",
                background: "#ef4444",
                color: "white",
                fontSize: "10px",
                borderRadius: "50%",
                width: "16px",
                height: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {notifications.length}
            </span>
          )}
        </button>

        <button
          onClick={() => dispatch({ type: "TOGGLE_EVENT_MODAL" })}
          style={{
            background: "#2f5249",
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: "6px",
            fontSize: "14px",
            fontWeight: "500",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <Plus />
          Create Event
        </button>

        <button
          onClick={() => dispatch({ type: "TOGGLE_SETTINGS_MODAL" })}
          style={{
            padding: "8px",
            border: "1px solid var(--border-primary)",
            background: "var(--bg-primary)",
            borderRadius: "6px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Settings />
        </button>

        <button
          onClick={() => dispatch({ type: "TOGGLE_IMPORT_MODAL" })}
          style={{
            padding: "8px",
            border: "1px solid var(--border-primary)",
            background: "var(--bg-primary)",
            borderRadius: "6px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          title="Import/Export"
        >
          <Upload />
        </button>
      </div>
    </div>
  )
}
