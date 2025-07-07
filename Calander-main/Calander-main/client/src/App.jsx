"use client"

import { useEffect } from "react"
import { CalendarProvider, useCalendar } from "./context/CalendarContext"
import Header from "./components/Header"
import Sidebar from "./components/Sidebar"
import MonthView from "./components/MonthView"
import WeekView from "./components/WeekView"
import DayView from "./components/DayView"
import AgendaView from "./components/AgendaView"
import EventModal from "./components/EventModal"
import SettingsModal from "./components/SettingsModal"
import NotificationCenter from "./components/NotificationCenter"
// import QuickActions from "./components/QuickActions"
import EventHistory from "./components/EventHistory"
import AdvancedSearch from "./components/AdvancedSearch"
import ImportModal from "./components/ImportModal"

import "./styles/global.css"
import "./styles/App.css"
// import "./styles/QuickActions.css"
import "./styles/EventHistory.css"
import "./styles/BulkActions.css"
import "./styles/AdvancedSearch.css"
import "./styles/AgendaView.css"
import "./styles/MiniCalendar.css"
import "./styles/ImportModal.css"

function CalendarApp() {
  const { view, isLoading } = useCalendar()

  // Request notification permission on app load
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission()
    }
  }, [])

  const renderView = () => {
    switch (view) {
      case "month":
        return <MonthView />
      case "week":
        return <WeekView />
      case "day":
        return <DayView />
      case "agenda":
        return <AgendaView />
      default:
        return <MonthView />
    }
  }

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner-large"></div>
        <p>Loading your calendar...</p>
      </div>
    )
  }

  return (
    <div className="app-container">
      <div className="app-header">
        <Header />
      </div>
      <div className="app-body">
        <div className="app-sidebar">
          <Sidebar />
          <div className="sidebar-bottom">
            {/* <QuickActions /> */}
            {/* <EventHistory /> */}
          </div>
        </div>
        <div className="app-main">
          <div className="main-content">
            <AdvancedSearch />
            {renderView()}
          </div>
        </div>
      </div>
      <EventModal />
      <SettingsModal />
      <NotificationCenter />
      <ImportModal />
    </div>
  )
}

export default function App() {
  return (
    <CalendarProvider>
      <CalendarApp />
    </CalendarProvider>
  )
}
