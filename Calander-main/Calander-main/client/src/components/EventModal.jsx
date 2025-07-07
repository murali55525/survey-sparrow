"use client"

import { useState, useEffect } from "react"
import { X, Calendar, Clock, Tag, MapPin, Bell, Trash2, Save } from "lucide-react"
import { useCalendar } from "../context/CalendarContext"
import { formatDate, getTimeSlots } from "../utils/dateUtils"

export default function EventModal() {
  const { showEventModal, selectedEvent, selectedDate, categories, dispatch, canDeleteEvent, isEventTimeInPast } =
    useCalendar()

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "09:00",
    endTime: "10:00",
    category: "personal",
    location: "",
    attendees: "",
    reminder: "15",
    recurring: "none",
    allDay: false,
    priority: "medium",
  })

  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (selectedEvent) {
      setFormData({
        title: selectedEvent.title || "",
        description: selectedEvent.description || "",
        date: formatDate(selectedEvent.date, "YYYY-MM-DD"),
        time: formatDate(selectedEvent.date, "HH:mm"),
        endTime: selectedEvent.endDate ? formatDate(selectedEvent.endDate, "HH:mm") : "10:00",
        category: selectedEvent.category || "personal",
        location: selectedEvent.location || "",
        attendees: selectedEvent.attendees || "",
        reminder: selectedEvent.reminder || "15",
        recurring: selectedEvent.recurring || "none",
        allDay: selectedEvent.allDay || false,
        priority: selectedEvent.priority || "medium",
      })
    } else if (selectedDate) {
      setFormData((prev) => ({
        ...prev,
        date: formatDate(selectedDate, "YYYY-MM-DD"),
      }))
    }
  }, [selectedEvent, selectedDate])

  const timeSlots = getTimeSlots()

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    }

    if (!formData.date) {
      newErrors.date = "Date is required"
    }

    if (!formData.allDay && formData.time >= formData.endTime) {
      newErrors.endTime = "End time must be after start time"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    if (!validateForm()) {
      setIsLoading(false)
      return
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const eventDate = new Date(`${formData.date}T${formData.time}`)
    const endDate = new Date(`${formData.date}T${formData.endTime}`)

    const eventData = {
      id: selectedEvent?.id || Date.now().toString(),
      title: formData.title,
      description: formData.description,
      date: eventDate,
      endDate: formData.allDay ? null : endDate,
      category: formData.category,
      location: formData.location,
      attendees: formData.attendees,
      reminder: formData.reminder,
      recurring: formData.recurring,
      allDay: formData.allDay,
      priority: formData.priority,
      duration: formData.allDay ? null : (endDate - eventDate) / (1000 * 60),
    }

    if (selectedEvent) {
      dispatch({ type: "UPDATE_EVENT", payload: eventData })
    } else {
      dispatch({ type: "ADD_EVENT", payload: eventData })
    }

    setIsLoading(false)
    handleClose()
  }

  const handleDelete = async () => {
    if (!selectedEvent) return

    if (window.confirm("Are you sure you want to delete this event?")) {
      setIsLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 500))
      dispatch({ type: "DELETE_EVENT", payload: selectedEvent.id })
      setIsLoading(false)
      handleClose()
    }
  }

  const handleClose = () => {
    dispatch({ type: "TOGGLE_EVENT_MODAL" })
    dispatch({ type: "SET_SELECTED_EVENT", payload: null })
    setFormData({
      title: "",
      description: "",
      date: "",
      time: "09:00",
      endTime: "10:00",
      category: "personal",
      location: "",
      attendees: "",
      reminder: "15",
      recurring: "none",
      allDay: false,
      priority: "medium",
    })
    setErrors({})
  }

  if (!showEventModal) return null

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
          maxWidth: "600px",
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          border: "1px solid var(--border-primary)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
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
                <Calendar />
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
                  {selectedEvent ? "Edit Event" : "Create New Event"}
                </h2>
                <p style={{ fontSize: "14px", color: "var(--text-secondary)", margin: 0 }}>
                  Fill in the details for your event
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

        {/* Form */}
        <div style={{ padding: "0 24px 24px 24px" }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* Title */}
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "var(--text-primary)",
                  marginBottom: "6px",
                }}
              >
                Event Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: `1px solid ${errors.title ? "#ef4444" : "var(--border-primary)"}`,
                  borderRadius: "6px",
                  fontSize: "14px",
                  background: "var(--bg-primary)",
                  color: "var(--text-primary)",
                }}
                placeholder="Enter event title..."
              />
              {errors.title && <p style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>{errors.title}</p>}
            </div>

            {/* Description */}
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "var(--text-primary)",
                  marginBottom: "6px",
                }}
              >
                <Tag style={{ width: "16px", height: "16px", color: "var(--text-secondary)" }} />
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "1px solid var(--border-primary)",
                  borderRadius: "6px",
                  fontSize: "14px",
                  background: "var(--bg-primary)",
                  color: "var(--text-primary)",
                  resize: "vertical",
                  minHeight: "80px",
                }}
                placeholder="Add event description..."
              />
            </div>

            {/* Date and All Day */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "var(--text-primary)",
                    marginBottom: "6px",
                  }}
                >
                  <Calendar style={{ width: "16px", height: "16px", color: "var(--text-secondary)" }} />
                  Date *
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: `1px solid ${errors.date ? "#ef4444" : "var(--border-primary)"}`,
                    borderRadius: "6px",
                    fontSize: "14px",
                    background: "var(--bg-primary)",
                    color: "var(--text-primary)",
                  }}
                />
                {errors.date && <p style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>{errors.date}</p>}
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "var(--text-primary)",
                    marginBottom: "6px",
                  }}
                >
                  All Day Event
                </label>
                <div style={{ display: "flex", alignItems: "center", height: "48px" }}>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                      gap: "8px",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={formData.allDay}
                      onChange={(e) => setFormData((prev) => ({ ...prev, allDay: e.target.checked }))}
                      style={{ width: "16px", height: "16px", accentColor: "#2f5249" }}
                    />
                    <span style={{ fontSize: "14px", color: "var(--text-primary)", fontWeight: "500" }}>
                      This is an all-day event
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Time Selection */}
            {!formData.allDay && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div style={{ marginBottom: "20px" }}>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "var(--text-primary)",
                      marginBottom: "6px",
                    }}
                  >
                    <Clock style={{ width: "16px", height: "16px", color: "var(--text-secondary)" }} />
                    Start Time
                  </label>
                  <select
                    value={formData.time}
                    onChange={(e) => setFormData((prev) => ({ ...prev, time: e.target.value }))}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      border: `1px solid ${errors.time ? "#ef4444" : "var(--border-primary)"}`,
                      borderRadius: "6px",
                      fontSize: "14px",
                      background: "var(--bg-primary)",
                      color: "var(--text-primary)",
                    }}
                  >
                    {timeSlots.map((slot) => (
                      <option key={slot.time} value={slot.time}>
                        {slot.display}
                      </option>
                    ))}
                  </select>
                  {errors.time && <p style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>{errors.time}</p>}
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "var(--text-primary)",
                      marginBottom: "6px",
                    }}
                  >
                    End Time
                  </label>
                  <select
                    value={formData.endTime}
                    onChange={(e) => setFormData((prev) => ({ ...prev, endTime: e.target.value }))}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      border: `1px solid ${errors.endTime ? "#ef4444" : "var(--border-primary)"}`,
                      borderRadius: "6px",
                      fontSize: "14px",
                      background: "var(--bg-primary)",
                      color: "var(--text-primary)",
                    }}
                  >
                    {timeSlots.map((slot) => (
                      <option key={slot.time} value={slot.time}>
                        {slot.display}
                      </option>
                    ))}
                  </select>
                  {errors.endTime && (
                    <p style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>{errors.endTime}</p>
                  )}
                </div>
              </div>
            )}

            {/* Category and Priority */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "var(--text-primary)",
                    marginBottom: "6px",
                  }}
                >
                  <Tag style={{ width: "16px", height: "16px", color: "var(--text-secondary)" }} />
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
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
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "var(--text-primary)",
                    marginBottom: "6px",
                  }}
                >
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData((prev) => ({ ...prev, priority: e.target.value }))}
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
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            {/* Location and Reminder */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "var(--text-primary)",
                    marginBottom: "6px",
                  }}
                >
                  <MapPin style={{ width: "16px", height: "16px", color: "var(--text-secondary)" }} />
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid var(--border-primary)",
                    borderRadius: "6px",
                    fontSize: "14px",
                    background: "var(--bg-primary)",
                    color: "var(--text-primary)",
                  }}
                  placeholder="Enter location..."
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "var(--text-primary)",
                    marginBottom: "6px",
                  }}
                >
                  <Bell style={{ width: "16px", height: "16px", color: "var(--text-secondary)" }} />
                  Reminder
                </label>
                <select
                  value={formData.reminder}
                  onChange={(e) => setFormData((prev) => ({ ...prev, reminder: e.target.value }))}
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
                  <option value="none">No reminder</option>
                  <option value="5">5 minutes before</option>
                  <option value="15">15 minutes before</option>
                  <option value="30">30 minutes before</option>
                  <option value="60">1 hour before</option>
                  <option value="1440">1 day before</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingTop: "24px",
                borderTop: "1px solid var(--border-primary)",
                marginTop: "24px",
              }}
            >
              <div style={{ display: "flex" }}>
                {selectedEvent && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isLoading}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "8px 16px",
                      background: "#ef4444",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "14px",
                      fontWeight: "500",
                      cursor: isLoading ? "not-allowed" : "pointer",
                      opacity: isLoading ? 0.7 : 1,
                    }}
                  >
                    <Trash2 />
                    Delete Event
                  </button>
                )}
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isLoading}
                  style={{
                    padding: "8px 16px",
                    background: "var(--bg-tertiary)",
                    color: "var(--text-secondary)",
                    border: "1px solid var(--border-primary)",
                    borderRadius: "6px",
                    fontSize: "14px",
                    fontWeight: "500",
                    cursor: isLoading ? "not-allowed" : "pointer",
                    opacity: isLoading ? 0.7 : 1,
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "8px 16px",
                    background: "#2f5249",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    fontSize: "14px",
                    fontWeight: "500",
                    cursor: isLoading ? "not-allowed" : "pointer",
                    opacity: isLoading ? 0.7 : 1,
                  }}
                >
                  {isLoading ? (
                    <>
                      <div
                        style={{
                          width: "16px",
                          height: "16px",
                          border: "2px solid rgba(255, 255, 255, 0.3)",
                          borderTop: "2px solid white",
                          borderRadius: "50%",
                          animation: "spin 1s linear infinite",
                        }}
                      />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save />
                      {selectedEvent ? "Update Event" : "Create Event"}
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
