"use client"

import { useState } from "react"
import { Plus, Clock, Zap, Copy, Download, Settings } from "lucide-react"
import { useCalendar } from "../context/CalendarContext"

export default function QuickActions() {
  const { templates, dispatch, exportCalendarData, createBackup } = useCalendar()
  const [showTemplates, setShowTemplates] = useState(false)

  const handleQuickEvent = (template) => {
    const now = new Date()
    const eventDate = new Date(now.getTime() + 60 * 60 * 1000) // 1 hour from now

    const quickEvent = {
      title: template.name,
      date: eventDate,
      category: template.category,
      reminder: template.reminder,
      duration: template.duration,
      description: `Quick event created from ${template.name} template`,
    }

    dispatch({ type: "ADD_EVENT", payload: quickEvent })
    dispatch({
      type: "ADD_NOTIFICATION",
      payload: {
        title: "Quick Event Created",
        message: `${template.name} has been scheduled`,
        type: "success",
      },
    })
  }

  const handleExportData = () => {
    const data = exportCalendarData()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `calendar-backup-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleCreateBackup = () => {
    const backup = createBackup()
    dispatch({
      type: "ADD_NOTIFICATION",
      payload: {
        title: "Backup Created",
        message: `Calendar backup saved successfully`,
        type: "success",
      },
    })
  }

  return (
    <div
      style={{
        background: "var(--bg-primary)",
        border: "1px solid var(--border-primary)",
        borderRadius: "12px",
        padding: "20px",
        marginBottom: "20px",
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
        <h3
          style={{
            fontSize: "18px",
            fontWeight: "600",
            color: "var(--text-primary)",
            margin: 0,
          }}
        >
          Quick Actions
        </h3>
        <button
          onClick={() => setShowTemplates(!showTemplates)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 16px",
            background: "#97b067",
            color: "#2f5249",
            border: "none",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "500",
            cursor: "pointer",
          }}
        >
          <Zap />
          Templates
        </button>
      </div>

      {showTemplates && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "12px",
            marginBottom: "20px",
          }}
        >
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => handleQuickEvent(template)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "16px",
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-primary)",
                borderRadius: "8px",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  background: "#97b067",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#2f5249",
                }}
              >
                <Clock />
              </div>
              <div>
                <h4
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "var(--text-primary)",
                    margin: "0 0 4px 0",
                  }}
                >
                  {template.name}
                </h4>
                <p
                  style={{
                    fontSize: "12px",
                    color: "var(--text-secondary)",
                    margin: 0,
                  }}
                >
                  {template.duration}min • {template.category}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <button
          onClick={() => dispatch({ type: "TOGGLE_EVENT_MODAL" })}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 16px",
            background: "#2f5249",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "500",
            cursor: "pointer",
          }}
        >
          <Plus />
          New Event
        </button>

        <button
          onClick={handleExportData}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 16px",
            background: "var(--bg-tertiary)",
            color: "var(--text-secondary)",
            border: "1px solid var(--border-primary)",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "500",
            cursor: "pointer",
          }}
        >
          <Download />
          Export
        </button>

        <button
          onClick={handleCreateBackup}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 16px",
            background: "var(--bg-tertiary)",
            color: "var(--text-secondary)",
            border: "1px solid var(--border-primary)",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "500",
            cursor: "pointer",
          }}
        >
          <Copy />
          Backup
        </button>

        <button
          onClick={() => dispatch({ type: "TOGGLE_SETTINGS_MODAL" })}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 16px",
            background: "var(--bg-tertiary)",
            color: "var(--text-secondary)",
            border: "1px solid var(--border-primary)",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "500",
            cursor: "pointer",
          }}
        >
          <Settings />
          Settings
        </button>
      </div>
    </div>
  )
}
