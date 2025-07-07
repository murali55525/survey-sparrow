"use client"
import { X, Bell, CheckCircle, AlertCircle, Info } from "lucide-react"
import { useCalendar } from "../context/CalendarContext"

export default function NotificationCenter() {
  const { notifications, dispatch } = useCalendar()

  const handleDismiss = (id) => {
    dispatch({ type: "REMOVE_NOTIFICATION", payload: id })
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle style={{ width: "20px", height: "20px", color: "#10b981" }} />
      case "error":
        return <AlertCircle style={{ width: "20px", height: "20px", color: "#ef4444" }} />
      case "reminder":
        return <Bell style={{ width: "20px", height: "20px", color: "#3b82f6" }} />
      default:
        return <Info style={{ width: "20px", height: "20px", color: "#3b82f6" }} />
    }
  }

  if (notifications.length === 0) return null

  return (
    <div
      style={{
        position: "fixed",
        top: "24px",
        right: "24px",
        zIndex: 60,
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        maxWidth: "400px",
      }}
    >
      {notifications.map((notification) => (
        <div
          key={notification.id}
          style={{
            background: "var(--bg-primary)",
            border: "1px solid var(--border-primary)",
            borderRadius: "8px",
            padding: "16px",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            animation: "slideInRight 0.3s ease-out",
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <div style={{ flexShrink: 0, marginTop: "2px" }}>{getNotificationIcon(notification.type)}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h4
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "var(--text-primary)",
                  margin: "0 0 4px 0",
                }}
              >
                {notification.title}
              </h4>
              <p
                style={{
                  fontSize: "13px",
                  color: "var(--text-secondary)",
                  margin: 0,
                  lineHeight: 1.4,
                }}
              >
                {notification.message}
              </p>
            </div>
            <button
              onClick={() => handleDismiss(notification.id)}
              style={{
                width: "20px",
                height: "20px",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "4px",
                flexShrink: 0,
                color: "#94a3b8",
              }}
            >
              <X style={{ width: "14px", height: "14px" }} />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
