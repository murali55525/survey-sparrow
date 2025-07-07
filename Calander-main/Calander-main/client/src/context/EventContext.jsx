"use client"

import { createContext, useContext, useState, useEffect } from "react"

const EventContext = createContext()

export const useEvents = () => {
  const context = useContext(EventContext)
  if (!context) {
    throw new Error("useEvents must be used within an EventProvider")
  }
  return context
}

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  // Load events from localStorage on mount
  useEffect(() => {
    const savedEvents = localStorage.getItem("calendar-events")
    if (savedEvents) {
      try {
        const parsedEvents = JSON.parse(savedEvents).map((event) => ({
          ...event,
          date: new Date(event.date),
          createdAt: new Date(event.createdAt),
          updatedAt: new Date(event.updatedAt),
        }))
        setEvents(parsedEvents)
      } catch (error) {
        console.error("Error loading events:", error)
      }
    }
  }, [])

  // Save events to localStorage whenever events change
  useEffect(() => {
    localStorage.setItem("calendar-events", JSON.stringify(events))
  }, [events])

  const addEvent = (eventData) => {
    const newEvent = {
      id: Date.now().toString(),
      ...eventData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setEvents((prev) => [...prev, newEvent])
    return newEvent
  }

  const updateEvent = (eventId, eventData) => {
    setEvents((prev) =>
      prev.map((event) => (event.id === eventId ? { ...event, ...eventData, updatedAt: new Date() } : event)),
    )
  }

  const deleteEvent = (eventId) => {
    setEvents((prev) => prev.filter((event) => event.id !== eventId))
  }

  const getEventsForDate = (date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.date)
      return eventDate.toDateString() === date.toDateString()
    })
  }

  const getFilteredEvents = () => {
    let filtered = events

    if (searchTerm) {
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (event.description && event.description.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((event) => event.category === selectedCategory)
    }

    return filtered.sort((a, b) => new Date(a.date) - new Date(b.date))
  }

  const getUpcomingEvents = (limit = 5) => {
    const now = new Date()
    return events
      .filter((event) => new Date(event.date) >= now)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, limit)
  }

  const getEventStats = () => {
    const now = new Date()
    const thisMonth = events.filter((event) => {
      const eventDate = new Date(event.date)
      return eventDate.getMonth() === now.getMonth() && eventDate.getFullYear() === now.getFullYear()
    })

    const upcoming = events.filter((event) => new Date(event.date) >= now)
    const past = events.filter((event) => new Date(event.date) < now)

    return {
      total: events.length,
      thisMonth: thisMonth.length,
      upcoming: upcoming.length,
      past: past.length,
    }
  }

  const value = {
    events,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    addEvent,
    updateEvent,
    deleteEvent,
    getEventsForDate,
    getFilteredEvents,
    getUpcomingEvents,
    getEventStats,
  }

  return <EventContext.Provider value={value}>{children}</EventContext.Provider>
}
