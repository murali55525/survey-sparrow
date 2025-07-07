"use client"

import { useState } from "react"
import { History, Undo, Trash2, Calendar, Plus, Edit } from "lucide-react"
import { useCalendar } from "../context/CalendarContext"
import { formatDate } from "../utils/dateUtils"

export default function EventHistory() {
  const { eventHistory, dispatch } = useCalendar()
  const [showHistory, setShowHistory] = useState(false)

  const getActionIcon = (action) => {
    switch (action) {
      case "created":
        return <Plus style={{ width: "16px", height: "16px", color: "#10b981" }} />
      case "updated":
        return <Edit style={{ width: "16px", height: "16px", color: "#3b82f6" }} />
      case "deleted":
        return <Trash2 style={{ width: "16px", height: "16px", color: "#ef4444" }} />
      default:
        return <Calendar style={{ width: "16px", height: "16px", color: "#6b7280" }} />
    }
  }

  const getActionText = (action) => {
    switch (action) {
      case "created":
        return "Created"
      case "updated":
        return "Updated"
      case "deleted":
        return "Deleted"
      default:
        return "Modified"
    }
  }

  const handleRestoreEvent = (historyItem) => {
    if (historyItem.action === "deleted") {
      dispatch({ type: "RESTORE_EVENT", payload: historyItem.event })
      dispatch({
        type: "ADD_NOTIFICATION",
        payload: {
          title: "Event Restored",
          message: `${historyItem.event.title} has been restored`,
          type: "success",
        },
      })
    }
  }

  if (!showHistory) {
    return (
      <button
        onClick={() => setShowHistory(true)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "8px 16px",
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-primary)",
          borderRadius: "8px",
          color: "var(--text-secondary)",
          fontSize: "14px",
          cursor: "pointer",
        }}
      >
        <History />
        History ({eventHistory.length})
      </button>
    )
  }

  return (
    <div
      style={{
        position: "fixed",
        right: "20px",
        top: "100px",
        width: "350px",
        maxHeight: "500px",
        background: "var(--bg-primary)",
        border: "1px solid var(--border-primary)",
        borderRadius: "12px",
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
        zIndex: 40,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 20px",
          borderBottom: "1px solid var(--border-primary)",
          background: "var(--bg-secondary)",
        }}
      >
        <h3
          style={{
            fontSize: "16px",
            fontWeight: "600",
            color: "var(--text-primary)",
            margin: 0,
          }}
        >
          Event History
        </h3>
        <button
          onClick={() => setShowHistory(false)}
          style={{
            width: "24px",
            height: "24px",
            border: "none",
            background: "transparent",
            color: "var(--text-secondary)",
            fontSize: "18px",
            cursor: "pointer",
            borderRadius: "4px",
          }}
        >
          ×
        </button>
      </div>

      <div style={{ maxHeight: "400px", overflowY: "auto", padding: "12px" }}>
        {eventHistory.length === 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "40px 20px",
              color: "var(--text-tertiary)",
            }}
          >
            <History style={{ width: "48px", height: "48px", marginBottom: "12px" }} />
            <p style={{ margin: 0, fontSize: "14px" }}>No history available</p>
          </div>
        ) : (
          eventHistory
            .slice()
            .reverse()
            .map((item, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px",
                  borderRadius: "8px",
                  marginBottom: "8px",
                }}
              >
                <div style={{ flexShrink: 0 }}>{getActionIcon(item.action)}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "4px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "var(--text-secondary)",
                        textTransform: "uppercase",
                      }}
                    >
                      {getActionText(item.action)}
                    </span>
                    <span
                      style={{
                        fontSize: "14px",
                        fontWeight: "500",
                        color: "var(--text-primary)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {item.event.title}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      fontSize: "12px",
                      color: "var(--text-tertiary)",
                    }}
                  >
                    <span>{formatDate(item.timestamp, "MMM D, h:mm A")}</span>
                    <span>{item.event.category}</span>
                  </div>
                </div>
                {item.action === "deleted" && (
                  <button
                    onClick={() => handleRestoreEvent(item)}
                    style={{
                      width: "32px",
                      height: "32px",
                      border: "none",
                      background: "#97b067",
                      color: "#2f5249",
                      borderRadius: "6px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    title="Restore event"
                  >
                    <Undo style={{ width: "14px", height: "14px" }} />
                  </button>
                )}
              </div>
            ))
        )}
      </div>
    </div>
  )
}
