"use client"

import { useState } from "react"
import { Search, Filter, Clock, MapPin } from "lucide-react"
import { useCalendar } from "../context/CalendarContext"

export default function AdvancedSearch() {
  const { events, categories, searchEvents, dispatch } = useCalendar()
  const [searchFilters, setSearchFilters] = useState({
    text: "",
    category: "all",
    dateRange: "all",
    startDate: "",
    endDate: "",
    hasLocation: false,
    hasReminder: false,
  })
  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleSearch = () => {
    searchEvents(searchFilters.text)
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
      <div style={{ marginBottom: "16px" }}>
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Search
            style={{
              position: "absolute",
              left: "12px",
              width: "18px",
              height: "18px",
              color: "var(--text-tertiary)",
              zIndex: 1,
            }}
          />
          <input
            type="text"
            placeholder="Search events, descriptions, locations..."
            value={searchFilters.text}
            onChange={(e) => {
              setSearchFilters((prev) => ({ ...prev, text: e.target.value }))
              dispatch({ type: "SET_SEARCH_TERM", payload: e.target.value })
            }}
            style={{
              flex: 1,
              padding: "12px 12px 12px 44px",
              border: "1px solid var(--border-primary)",
              borderRadius: "8px 0 0 8px",
              fontSize: "14px",
              background: "var(--bg-secondary)",
              color: "var(--text-primary)",
            }}
          />
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            style={{
              padding: "12px 16px",
              border: "1px solid var(--border-primary)",
              borderLeft: "none",
              borderRadius: "0 8px 8px 0",
              background: showAdvanced ? "#97b067" : "var(--bg-tertiary)",
              color: showAdvanced ? "#2f5249" : "var(--text-secondary)",
              cursor: "pointer",
            }}
          >
            <Filter />
          </button>
        </div>
      </div>

      {showAdvanced && (
        <div
          style={{
            paddingTop: "16px",
            borderTop: "1px solid var(--border-primary)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
              marginBottom: "16px",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label
                style={{
                  fontSize: "13px",
                  fontWeight: "500",
                  color: "var(--text-secondary)",
                }}
              >
                Category
              </label>
              <select
                value={searchFilters.category}
                onChange={(e) => setSearchFilters((prev) => ({ ...prev, category: e.target.value }))}
                style={{
                  padding: "8px 12px",
                  border: "1px solid var(--border-primary)",
                  borderRadius: "6px",
                  fontSize: "14px",
                  background: "var(--bg-primary)",
                  color: "var(--text-primary)",
                }}
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label
                style={{
                  fontSize: "13px",
                  fontWeight: "500",
                  color: "var(--text-secondary)",
                }}
              >
                Date Range
              </label>
              <select
                value={searchFilters.dateRange}
                onChange={(e) => setSearchFilters((prev) => ({ ...prev, dateRange: e.target.value }))}
                style={{
                  padding: "8px 12px",
                  border: "1px solid var(--border-primary)",
                  borderRadius: "6px",
                  fontSize: "14px",
                  background: "var(--bg-primary)",
                  color: "var(--text-primary)",
                }}
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: "20px",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "14px",
                color: "var(--text-primary)",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={searchFilters.hasLocation}
                onChange={(e) => setSearchFilters((prev) => ({ ...prev, hasLocation: e.target.checked }))}
                style={{ width: "16px", height: "16px", accentColor: "#2f5249" }}
              />
              <MapPin style={{ width: "16px", height: "16px" }} />
              Has Location
            </label>

            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "14px",
                color: "var(--text-primary)",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={searchFilters.hasReminder}
                onChange={(e) => setSearchFilters((prev) => ({ ...prev, hasReminder: e.target.checked }))}
                style={{ width: "16px", height: "16px", accentColor: "#2f5249" }}
              />
              <Clock style={{ width: "16px", height: "16px" }} />
              Has Reminder
            </label>
          </div>

          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "flex-end",
            }}
          >
            <button
              onClick={handleSearch}
              style={{
                padding: "10px 20px",
                background: "#2f5249",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
              }}
            >
              Search Events
            </button>
            <button
              onClick={() =>
                setSearchFilters({
                  text: "",
                  category: "all",
                  dateRange: "all",
                  startDate: "",
                  endDate: "",
                  hasLocation: false,
                  hasReminder: false,
                })
              }
              style={{
                padding: "10px 20px",
                background: "var(--bg-tertiary)",
                color: "var(--text-secondary)",
                border: "1px solid var(--border-primary)",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
              }}
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
