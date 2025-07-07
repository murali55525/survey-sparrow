"use client"

import { createContext, useContext, useReducer, useEffect } from "react"
import { generateRecurringEvents } from "../utils/dateUtils"

const CalendarContext = createContext()

const initialState = {
  events: [],
  view: "month", // month, week, day, agenda
  currentDate: new Date(),
  selectedDate: new Date(),
  selectedEvent: null,
  showEventModal: false,
  showSettingsModal: false,
  showImportModal: false,
  searchTerm: "",
  filterCategory: "all",
  categories: [
    { id: "personal", name: "Personal", color: "#3b82f6" },
    { id: "work", name: "Work", color: "#10b981" },
    { id: "health", name: "Health", color: "#ef4444" },
    { id: "social", name: "Social", color: "#8b5cf6" },
    { id: "travel", name: "Travel", color: "#f59e0b" },
    { id: "education", name: "Education", color: "#6366f1" },
  ],
  settings: {
    weekStartsOn: 0, // 0 = Sunday, 1 = Monday
    timeFormat: "12", // 12 or 24
    notifications: true,
    theme: "light",
    defaultView: "month",
    autoSave: true,
    showWeekends: true,
    compactMode: false,
    language: "en",
  },
  notifications: [],
  templates: [
    { id: "meeting", name: "Team Meeting", duration: 60, category: "work", reminder: "15" },
    { id: "lunch", name: "Lunch Break", duration: 60, category: "personal", reminder: "5" },
    { id: "workout", name: "Workout Session", duration: 90, category: "health", reminder: "30" },
    { id: "standup", name: "Daily Standup", duration: 30, category: "work", reminder: "10" },
  ],
  tags: ["important", "urgent", "optional", "follow-up", "deadline"],
  eventHistory: [],
  isLoading: false,
  selectedEvents: [], // For bulk operations
  searchResults: null,
  calendarSettings: {
    showMiniCalendar: true,
    showEventPreview: true,
    defaultEventDuration: 60,
    workingHours: { start: "09:00", end: "17:00" },
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  },
}

// Enhanced localStorage utilities with better error handling
const STORAGE_KEYS = {
  EVENTS: "calendar_events_v2",
  SETTINGS: "calendar_settings_v2",
  CATEGORIES: "calendar_categories_v2",
  TEMPLATES: "calendar_templates_v2",
  TAGS: "calendar_tags_v2",
  HISTORY: "calendar_history_v2",
  BACKUP: "calendar_backup_v2",
}

const storageUtils = {
  save: (key, data) => {
    try {
      const serializedData = JSON.stringify(data, (key, value) => {
        if (value instanceof Date) {
          return { __type: "Date", value: value.toISOString() }
        }
        return value
      })
      localStorage.setItem(key, serializedData)
      return true
    } catch (error) {
      console.error(`Error saving ${key}:`, error)
      return false
    }
  },

  load: (key) => {
    try {
      const item = localStorage.getItem(key)
      if (!item) return null

      return JSON.parse(item, (key, value) => {
        if (value && typeof value === "object" && value.__type === "Date") {
          return new Date(value.value)
        }
        return value
      })
    } catch (error) {
      console.error(`Error loading ${key}:`, error)
      return null
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error(`Error removing ${key}:`, error)
      return false
    }
  },

  clear: () => {
    try {
      Object.values(STORAGE_KEYS).forEach((key) => {
        localStorage.removeItem(key)
      })
      return true
    } catch (error) {
      console.error("Error clearing storage:", error)
      return false
    }
  },
}

function calendarReducer(state, action) {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload }

    case "SET_VIEW":
      return { ...state, view: action.payload }

    case "SET_CURRENT_DATE":
      return { ...state, currentDate: action.payload }

    case "SET_SELECTED_DATE":
      return { ...state, selectedDate: action.payload }

    case "SET_EVENTS":
      return { ...state, events: action.payload }

    case "ADD_EVENT":
      const newEvents = [...state.events]
      const eventToAdd = {
        ...action.payload,
        id: action.payload.id || `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      if (eventToAdd.recurring && eventToAdd.recurring !== "none") {
        const recurringEvents = generateRecurringEvents(
          eventToAdd,
          new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
        )
        newEvents.push(...recurringEvents)
      } else {
        newEvents.push(eventToAdd)
      }

      // Add to history
      const newHistory = [
        ...state.eventHistory,
        {
          id: `history_${Date.now()}`,
          action: "created",
          event: eventToAdd,
          timestamp: new Date(),
        },
      ]

      return {
        ...state,
        events: newEvents,
        eventHistory: newHistory.slice(-100), // Keep last 100 actions
      }

    case "UPDATE_EVENT":
      const updatedEvent = {
        ...action.payload,
        updatedAt: new Date(),
      }

      const updatedEvents = state.events.map((event) => (event.id === action.payload.id ? updatedEvent : event))

      const updateHistory = [
        ...state.eventHistory,
        {
          id: `history_${Date.now()}`,
          action: "updated",
          event: updatedEvent,
          timestamp: new Date(),
        },
      ]

      return {
        ...state,
        events: updatedEvents,
        eventHistory: updateHistory.slice(-100),
      }

    case "DELETE_EVENT":
      const eventToDelete = state.events.find((e) => e.id === action.payload)
      const filteredEvents = state.events.filter((event) => event.id !== action.payload)

      const deleteHistory = [
        ...state.eventHistory,
        {
          id: `history_${Date.now()}`,
          action: "deleted",
          event: eventToDelete,
          timestamp: new Date(),
        },
      ]

      return {
        ...state,
        events: filteredEvents,
        eventHistory: deleteHistory.slice(-100),
      }

    case "DUPLICATE_EVENT":
      const originalEvent = state.events.find((e) => e.id === action.payload)
      if (!originalEvent) return state

      const duplicatedEvent = {
        ...originalEvent,
        id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: `${originalEvent.title} (Copy)`,
        date: new Date(originalEvent.date.getTime() + 24 * 60 * 60 * 1000), // Next day
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      return {
        ...state,
        events: [...state.events, duplicatedEvent],
      }

    case "BULK_DELETE_EVENTS":
      const remainingEvents = state.events.filter((event) => !action.payload.includes(event.id))
      return { ...state, events: remainingEvents }

    case "BULK_UPDATE_CATEGORY":
      const bulkUpdatedEvents = state.events.map((event) =>
        action.payload.eventIds.includes(event.id) ? { ...event, category: action.payload.categoryId } : event,
      )
      return { ...state, events: bulkUpdatedEvents }

    case "SET_SELECTED_EVENT":
      return { ...state, selectedEvent: action.payload }

    case "SET_SELECTED_EVENTS":
      return { ...state, selectedEvents: action.payload }

    case "TOGGLE_EVENT_SELECTION":
      const eventId = action.payload
      const isSelected = state.selectedEvents.includes(eventId)
      const newSelection = isSelected
        ? state.selectedEvents.filter((id) => id !== eventId)
        : [...state.selectedEvents, eventId]
      return { ...state, selectedEvents: newSelection }

    case "CLEAR_SELECTION":
      return { ...state, selectedEvents: [] }

    case "TOGGLE_EVENT_MODAL":
      return { ...state, showEventModal: !state.showEventModal }

    case "TOGGLE_SETTINGS_MODAL":
      return { ...state, showSettingsModal: !state.showSettingsModal }

    case "TOGGLE_IMPORT_MODAL":
      return { ...state, showImportModal: !state.showImportModal }

    case "SET_SEARCH_TERM":
      return { ...state, searchTerm: action.payload }

    case "SET_SEARCH_RESULTS":
      return { ...state, searchResults: action.payload }

    case "CLEAR_SEARCH":
      return { ...state, searchTerm: "", searchResults: null }

    case "SET_FILTER_CATEGORY":
      return { ...state, filterCategory: action.payload }

    case "ADD_CATEGORY":
      return {
        ...state,
        categories: [...state.categories, action.payload],
      }

    case "UPDATE_CATEGORY":
      return {
        ...state,
        categories: state.categories.map((cat) => (cat.id === action.payload.id ? action.payload : cat)),
      }

    case "DELETE_CATEGORY":
      return {
        ...state,
        categories: state.categories.filter((cat) => cat.id !== action.payload),
        events: state.events.map((event) =>
          event.category === action.payload ? { ...event, category: "personal" } : event,
        ),
      }

    case "SET_CATEGORIES":
      return { ...state, categories: action.payload }

    case "ADD_TEMPLATE":
      return {
        ...state,
        templates: [...state.templates, action.payload],
      }

    case "UPDATE_TEMPLATE":
      return {
        ...state,
        templates: state.templates.map((t) => (t.id === action.payload.id ? action.payload : t)),
      }

    case "DELETE_TEMPLATE":
      return {
        ...state,
        templates: state.templates.filter((t) => t.id !== action.payload),
      }

    case "SET_TEMPLATES":
      return { ...state, templates: action.payload }

    case "ADD_TAG":
      return {
        ...state,
        tags: [...state.tags, action.payload],
      }

    case "SET_TAGS":
      return { ...state, tags: action.payload }

    case "UPDATE_SETTINGS":
      return {
        ...state,
        settings: { ...state.settings, ...action.payload },
      }

    case "UPDATE_CALENDAR_SETTINGS":
      return {
        ...state,
        calendarSettings: { ...state.calendarSettings, ...action.payload },
      }

    case "ADD_NOTIFICATION":
      return {
        ...state,
        notifications: [...state.notifications, { ...action.payload, id: Date.now() }],
      }

    case "REMOVE_NOTIFICATION":
      return {
        ...state,
        notifications: state.notifications.filter((n) => n.id !== action.payload),
      }

    case "CLEAR_ALL_NOTIFICATIONS":
      return {
        ...state,
        notifications: [],
      }

    case "IMPORT_EVENTS":
      return {
        ...state,
        events: [...state.events, ...action.payload],
      }

    case "SET_HISTORY":
      return { ...state, eventHistory: action.payload }

    case "RESTORE_EVENT":
      const restoredEvent = {
        ...action.payload,
        id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      return {
        ...state,
        events: [...state.events, restoredEvent],
      }

    case "RESET_CALENDAR":
      return {
        ...initialState,
        settings: state.settings, // Keep user settings
      }

    default:
      return state
  }
}

export function CalendarProvider({ children }) {
  const [state, dispatch] = useReducer(calendarReducer, initialState)

  // Load data from localStorage on mount
  useEffect(() => {
    const loadData = async () => {
      dispatch({ type: "SET_LOADING", payload: true })

      try {
        // Load events
        const savedEvents = storageUtils.load(STORAGE_KEYS.EVENTS)
        if (savedEvents && Array.isArray(savedEvents)) {
          dispatch({ type: "SET_EVENTS", payload: savedEvents })
        }

        // Load settings
        const savedSettings = storageUtils.load(STORAGE_KEYS.SETTINGS)
        if (savedSettings) {
          dispatch({ type: "UPDATE_SETTINGS", payload: savedSettings })
        }

        // Load categories
        const savedCategories = storageUtils.load(STORAGE_KEYS.CATEGORIES)
        if (savedCategories && Array.isArray(savedCategories)) {
          dispatch({ type: "SET_CATEGORIES", payload: savedCategories })
        }

        // Load templates
        const savedTemplates = storageUtils.load(STORAGE_KEYS.TEMPLATES)
        if (savedTemplates && Array.isArray(savedTemplates)) {
          dispatch({ type: "SET_TEMPLATES", payload: savedTemplates })
        }

        // Load tags
        const savedTags = storageUtils.load(STORAGE_KEYS.TAGS)
        if (savedTags && Array.isArray(savedTags)) {
          dispatch({ type: "SET_TAGS", payload: savedTags })
        }

        // Load history
        const savedHistory = storageUtils.load(STORAGE_KEYS.HISTORY)
        if (savedHistory && Array.isArray(savedHistory)) {
          dispatch({ type: "SET_HISTORY", payload: savedHistory })
        }

        console.log("Calendar data loaded successfully")
      } catch (error) {
        console.error("Error loading calendar data:", error)
        dispatch({
          type: "ADD_NOTIFICATION",
          payload: {
            title: "Loading Error",
            message: "Some data could not be loaded from storage",
            type: "error",
          },
        })
      } finally {
        dispatch({ type: "SET_LOADING", payload: false })
      }
    }

    loadData()
  }, [])

  // Auto-save to localStorage when state changes
  useEffect(() => {
    if (!state.isLoading && state.events.length >= 0) {
      storageUtils.save(STORAGE_KEYS.EVENTS, state.events)
    }
  }, [state.events, state.isLoading])

  useEffect(() => {
    if (!state.isLoading) {
      storageUtils.save(STORAGE_KEYS.SETTINGS, state.settings)
    }
  }, [state.settings, state.isLoading])

  useEffect(() => {
    if (!state.isLoading) {
      storageUtils.save(STORAGE_KEYS.CATEGORIES, state.categories)
    }
  }, [state.categories, state.isLoading])

  useEffect(() => {
    if (!state.isLoading) {
      storageUtils.save(STORAGE_KEYS.TEMPLATES, state.templates)
    }
  }, [state.templates, state.isLoading])

  useEffect(() => {
    if (!state.isLoading) {
      storageUtils.save(STORAGE_KEYS.TAGS, state.tags)
    }
  }, [state.tags, state.isLoading])

  useEffect(() => {
    if (!state.isLoading) {
      storageUtils.save(STORAGE_KEYS.HISTORY, state.eventHistory)
    }
  }, [state.eventHistory, state.isLoading])

  // Theme management
  useEffect(() => {
    const applyTheme = (theme) => {
      const root = document.documentElement

      if (theme === "system") {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
        root.setAttribute("data-theme", prefersDark ? "dark" : "light")
      } else {
        root.setAttribute("data-theme", theme)
      }
    }

    applyTheme(state.settings.theme)

    if (state.settings.theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
      const handleChange = () => applyTheme("system")
      mediaQuery.addEventListener("change", handleChange)
      return () => mediaQuery.removeEventListener("change", handleChange)
    }
  }, [state.settings.theme])

  // Enhanced notification system with reminders
  useEffect(() => {
    if (!state.settings.notifications) return

    const checkReminders = () => {
      const now = new Date()
      state.events.forEach((event) => {
        if (event.reminder && event.reminder !== "none") {
          const reminderTime = new Date(event.date.getTime() - Number.parseInt(event.reminder) * 60000)
          if (now >= reminderTime && now < new Date(reminderTime.getTime() + 60000)) {
            showNotification(event)
          }
        }
      })
    }

    const interval = setInterval(checkReminders, 60000) // Check every minute
    return () => clearInterval(interval)
  }, [state.events, state.settings.notifications])

  // Utility functions
  const showNotification = (event) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(`Upcoming Event: ${event.title}`, {
        body: event.description || `Event starts at ${event.date.toLocaleTimeString()}`,
        icon: "/calendar-icon.png",
      })
    }

    const notification = {
      title: `Reminder: ${event.title}`,
      message: `Event starts at ${event.date.toLocaleTimeString()}`,
      type: "reminder",
    }

    dispatch({ type: "ADD_NOTIFICATION", payload: notification })

    setTimeout(() => {
      dispatch({ type: "REMOVE_NOTIFICATION", payload: notification.id })
    }, 10000)
  }

  const canDeleteEvent = (event) => {
    const now = new Date()
    const eventTime = new Date(event.date)
    const timeDifference = eventTime.getTime() - now.getTime()
    const minutesDifference = timeDifference / (1000 * 60)

    return minutesDifference > 30 || minutesDifference < 0
  }

  const isEventTimeInPast = (eventDate, eventTime) => {
    const now = new Date()
    const eventDateTime = new Date(`${eventDate}T${eventTime}`)
    return eventDateTime < now
  }

  const exportCalendarData = () => {
    const exportData = {
      events: state.events,
      categories: state.categories,
      templates: state.templates,
      tags: state.tags,
      settings: state.settings,
      calendarSettings: state.calendarSettings,
      exportDate: new Date(),
      version: "2.0",
    }
    return exportData
  }

  const importCalendarData = (data) => {
    try {
      if (data.events && Array.isArray(data.events)) {
        const importedEvents = data.events.map((event) => ({
          ...event,
          id: `imported_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          date: new Date(event.date),
          createdAt: new Date(event.createdAt || Date.now()),
          updatedAt: new Date(event.updatedAt || Date.now()),
        }))
        dispatch({ type: "IMPORT_EVENTS", payload: importedEvents })
      }

      if (data.categories && Array.isArray(data.categories)) {
        const mergedCategories = [...state.categories]
        data.categories.forEach((cat) => {
          if (!mergedCategories.find((c) => c.id === cat.id)) {
            mergedCategories.push(cat)
          }
        })
        dispatch({ type: "SET_CATEGORIES", payload: mergedCategories })
      }

      if (data.templates && Array.isArray(data.templates)) {
        dispatch({ type: "SET_TEMPLATES", payload: [...state.templates, ...data.templates] })
      }

      if (data.settings) {
        dispatch({ type: "UPDATE_SETTINGS", payload: data.settings })
      }

      return true
    } catch (error) {
      console.error("Error importing calendar data:", error)
      return false
    }
  }

  const createBackup = () => {
    const backup = {
      ...exportCalendarData(),
      backupDate: new Date(),
      backupId: `backup_${Date.now()}`,
    }

    storageUtils.save(STORAGE_KEYS.BACKUP, backup)
    return backup
  }

  const getEventStats = () => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const thisWeekStart = new Date(today.getTime() - today.getDay() * 24 * 60 * 60 * 1000)
    const thisWeekEnd = new Date(thisWeekStart.getTime() + 7 * 24 * 60 * 60 * 1000)
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const thisMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    const todayEvents = state.events.filter((event) => {
      const eventDate = new Date(event.date)
      return eventDate.toDateString() === today.toDateString()
    })

    const thisWeekEvents = state.events.filter((event) => {
      const eventDate = new Date(event.date)
      return eventDate >= thisWeekStart && eventDate < thisWeekEnd
    })

    const thisMonthEvents = state.events.filter((event) => {
      const eventDate = new Date(event.date)
      return eventDate >= thisMonthStart && eventDate <= thisMonthEnd
    })

    const upcoming = state.events.filter((event) => new Date(event.date) > now)
    const past = state.events.filter((event) => new Date(event.date) < now)

    const byCategory = {}
    state.categories.forEach((cat) => {
      byCategory[cat.id] = state.events.filter((event) => event.category === cat.id).length
    })

    const byPriority = {
      high: state.events.filter((event) => event.priority === "high").length,
      medium: state.events.filter((event) => event.priority === "medium").length,
      low: state.events.filter((event) => event.priority === "low").length,
    }

    return {
      total: state.events.length,
      today: todayEvents.length,
      thisWeek: thisWeekEvents.length,
      thisMonth: thisMonthEvents.length,
      upcoming: upcoming.length,
      past: past.length,
      byCategory,
      byPriority,
    }
  }

  const searchEvents = (query) => {
    if (!query.trim()) {
      dispatch({ type: "CLEAR_SEARCH" })
      return
    }

    const results = state.events.filter(
      (event) =>
        event.title.toLowerCase().includes(query.toLowerCase()) ||
        (event.description && event.description.toLowerCase().includes(query.toLowerCase())) ||
        (event.location && event.location.toLowerCase().includes(query.toLowerCase())),
    )

    dispatch({ type: "SET_SEARCH_RESULTS", payload: results })
  }

  const clearStorage = () => {
    return storageUtils.clear()
  }

  const value = {
    ...state,
    dispatch,
    showNotification,
    canDeleteEvent,
    isEventTimeInPast,
    exportCalendarData,
    importCalendarData,
    createBackup,
    getEventStats,
    searchEvents,
    clearStorage,
    storageUtils,
  }

  return <CalendarContext.Provider value={value}>{children}</CalendarContext.Provider>
}

export function useCalendar() {
  const context = useContext(CalendarContext)
  if (!context) {
    throw new Error("useCalendar must be used within a CalendarProvider")
  }
  return context
}
