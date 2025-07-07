"use client"

import { useState } from "react"
import { X, Download, Plus, Sun, Moon, Monitor } from "lucide-react"
import { useCalendar } from "../context/CalendarContext"
import { exportToICS } from "../utils/dateUtils"

export default function SettingsModal() {
  const { showSettingsModal, settings, categories, events, dispatch } = useCalendar()

  const [newCategory, setNewCategory] = useState({ name: "", color: "#2f5249" })

  const handleSettingChange = (key, value) => {
    dispatch({
      type: "UPDATE_SETTINGS",
      payload: { [key]: value },
    })
  }

  const handleAddCategory = () => {
    if (newCategory.name.trim()) {
      const category = {
        id: newCategory.name.toLowerCase().replace(/\s+/g, "-"),
        name: newCategory.name,
        color: newCategory.color,
      }
      dispatch({ type: "ADD_CATEGORY", payload: category })
      setNewCategory({ name: "", color: "#2f5249" })
    }
  }

  const handleExport = () => {
    const icsContent = exportToICS(events)
    const blob = new Blob([icsContent], { type: "text/calendar" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "calendar-events.ics"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleClose = () => {
    dispatch({ type: "TOGGLE_SETTINGS_MODAL" })
  }

  const themeOptions = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ]

  if (!showSettingsModal) return null

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
        padding: "16px",
      }}
      onClick={handleClose}
    >
      <div
        style={{
          background: "var(--bg-primary)",
          borderRadius: "12px",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.15)",
          maxWidth: "700px",
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          border: "1px solid var(--border-primary)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            padding: "24px 24px 0 24px",
            borderBottom: "1px solid var(--border-primary)",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingBottom: "24px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  background: "linear-gradient(135deg, #2f5249, #437059)",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                }}
              >
                <Monitor />
              </div>
              <div>
                <h2
                  style={{
                    fontSize: "20px",
                    fontWeight: "600",
                    color: "var(--text-primary)",
                    margin: "0 0 4px 0",
                  }}
                >
                  Settings
                </h2>
                <p style={{ fontSize: "14px", color: "var(--text-secondary)", margin: 0 }}>
                  Customize your calendar experience
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              style={{
                width: "32px",
                height: "32px",
                border: "none",
                background: "var(--bg-tertiary)",
                borderRadius: "6px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--text-secondary)",
              }}
            >
              <X />
            </button>
          </div>
        </div>

        <div style={{ padding: "0 24px 24px 24px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            {/* Theme Settings */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  color: "var(--text-primary)",
                  marginBottom: "8px",
                  paddingBottom: "8px",
                  borderBottom: "2px solid #97b067",
                }}
              >
                Appearance
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "var(--text-primary)",
                      marginBottom: "6px",
                    }}
                  >
                    Theme
                  </label>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, 1fr)",
                      gap: "12px",
                      marginTop: "8px",
                    }}
                  >
                    {themeOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleSettingChange("theme", option.value)}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: "8px",
                          padding: "16px 12px",
                          border: `2px solid ${settings.theme === option.value ? "#2f5249" : "var(--border-primary)"}`,
                          borderRadius: "12px",
                          background:
                            settings.theme === option.value
                              ? "linear-gradient(135deg, #97b067, #e3de61)"
                              : "var(--bg-secondary)",
                          cursor: "pointer",
                          fontSize: "14px",
                          fontWeight: "500",
                          color: settings.theme === option.value ? "#2f5249" : "var(--text-secondary)",
                        }}
                      >
                        <option.icon style={{ width: "24px", height: "24px" }} />
                        <span>{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* General Settings */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  color: "var(--text-primary)",
                  marginBottom: "8px",
                  paddingBottom: "8px",
                  borderBottom: "2px solid #97b067",
                }}
              >
                General
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "var(--text-primary)",
                      marginBottom: "6px",
                    }}
                  >
                    Week starts on
                  </label>
                  <select
                    value={settings.weekStartsOn}
                    onChange={(e) => handleSettingChange("weekStartsOn", Number.parseInt(e.target.value))}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      border: "1px solid var(--border-primary)",
                      borderRadius: "6px",
                      fontSize: "14px",
                      background: "var(--bg-primary)",
                      color: "var(--text-primary)",
                    }}
                  >
                    <option value={0}>Sunday</option>
                    <option value={1}>Monday</option>
                  </select>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "var(--text-primary)",
                      marginBottom: "6px",
                    }}
                  >
                    Time format
                  </label>
                  <select
                    value={settings.timeFormat}
                    onChange={(e) => handleSettingChange("timeFormat", e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      border: "1px solid var(--border-primary)",
                      borderRadius: "6px",
                      fontSize: "14px",
                      background: "var(--bg-primary)",
                      color: "var(--text-primary)",
                    }}
                  >
                    <option value="12">12-hour (AM/PM)</option>
                    <option value="24">24-hour</option>
                  </select>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "12px",
                    background: "var(--bg-secondary)",
                    borderRadius: "8px",
                    border: "1px solid var(--border-primary)",
                  }}
                >
                  <input
                    type="checkbox"
                    id="notifications"
                    checked={settings.notifications}
                    onChange={(e) => handleSettingChange("notifications", e.target.checked)}
                    style={{ width: "18px", height: "18px", accentColor: "#2f5249" }}
                  />
                  <label
                    htmlFor="notifications"
                    style={{
                      fontSize: "14px",
                      color: "var(--text-primary)",
                      cursor: "pointer",
                      fontWeight: "500",
                    }}
                  >
                    Enable notifications
                  </label>
                </div>
              </div>
            </div>

            {/* Categories */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  color: "var(--text-primary)",
                  marginBottom: "8px",
                  paddingBottom: "8px",
                  borderBottom: "2px solid #97b067",
                }}
              >
                Categories
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    maxHeight: "200px",
                    overflowY: "auto",
                    padding: "16px",
                    background: "var(--bg-secondary)",
                    borderRadius: "8px",
                    border: "1px solid var(--border-primary)",
                  }}
                >
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "8px 12px",
                        background: "var(--bg-primary)",
                        borderRadius: "6px",
                        border: "1px solid var(--border-primary)",
                      }}
                    >
                      <div
                        style={{
                          width: "16px",
                          height: "16px",
                          borderRadius: "50%",
                          backgroundColor: category.color,
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          flex: 1,
                          fontSize: "14px",
                          color: "var(--text-primary)",
                          fontWeight: "500",
                        }}
                      >
                        {category.name}
                      </span>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "16px",
                    background: "var(--bg-secondary)",
                    borderRadius: "8px",
                    border: "1px solid var(--border-primary)",
                  }}
                >
                  <input
                    type="text"
                    placeholder="Category name"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory((prev) => ({ ...prev, name: e.target.value }))}
                    style={{
                      flex: 1,
                      padding: "10px 12px",
                      border: "1px solid var(--border-primary)",
                      borderRadius: "6px",
                      fontSize: "14px",
                      background: "var(--bg-primary)",
                      color: "var(--text-primary)",
                    }}
                  />
                  <input
                    type="color"
                    value={newCategory.color}
                    onChange={(e) => setNewCategory((prev) => ({ ...prev, color: e.target.value }))}
                    style={{
                      width: "44px",
                      height: "44px",
                      border: "1px solid var(--border-primary)",
                      borderRadius: "6px",
                      cursor: "pointer",
                      background: "var(--bg-primary)",
                    }}
                  />
                  <button
                    onClick={handleAddCategory}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "10px 16px",
                      background: "#2f5249",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "14px",
                      fontWeight: "500",
                      cursor: "pointer",
                    }}
                  >
                    <Plus />
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* Import/Export */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  color: "var(--text-primary)",
                  marginBottom: "8px",
                  paddingBottom: "8px",
                  borderBottom: "2px solid #97b067",
                }}
              >
                Import/Export
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                  <button
                    onClick={handleExport}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "10px 16px",
                      background: "var(--bg-tertiary)",
                      color: "var(--text-secondary)",
                      border: "1px solid var(--border-primary)",
                      borderRadius: "6px",
                      fontSize: "14px",
                      fontWeight: "500",
                      cursor: "pointer",
                    }}
                  >
                    <Download />
                    Export Calendar
                  </button>
                </div>
                <p
                  style={{
                    fontSize: "14px",
                    color: "var(--text-secondary)",
                    padding: "12px",
                    background: "var(--bg-secondary)",
                    borderRadius: "6px",
                    borderLeft: "4px solid #97b067",
                  }}
                >
                  Export your events to ICS format or import from other calendar applications.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
