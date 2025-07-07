"use client"

import { useState } from "react"
import { CheckSquare, Trash2, Copy, Tag } from "lucide-react"
import { useCalendar } from "../context/CalendarContext"

export default function BulkActions({ selectedEvents, onClearSelection }) {
  const { dispatch, categories } = useCalendar()
  const [showBulkMenu, setShowBulkMenu] = useState(false)

  const handleBulkDelete = () => {
    if (window.confirm(`Delete ${selectedEvents.length} selected events?`)) {
      dispatch({ type: "BULK_DELETE_EVENTS", payload: selectedEvents })
      onClearSelection()
      dispatch({
        type: "ADD_NOTIFICATION",
        payload: {
          id: Date.now(),
          title: "Events Deleted",
          message: `${selectedEvents.length} events have been deleted`,
          type: "success",
        },
      })
    }
  }

  const handleBulkCategoryChange = (categoryId) => {
    selectedEvents.forEach((eventId) => {
      dispatch({
        type: "UPDATE_EVENT",
        payload: { id: eventId, category: categoryId },
      })
    })
    onClearSelection()
    dispatch({
      type: "ADD_NOTIFICATION",
      payload: {
        id: Date.now(),
        title: "Category Updated",
        message: `${selectedEvents.length} events updated`,
        type: "success",
      },
    })
  }

  const handleBulkDuplicate = () => {
    selectedEvents.forEach((eventId) => {
      dispatch({ type: "DUPLICATE_EVENT", payload: eventId })
    })
    onClearSelection()
    dispatch({
      type: "ADD_NOTIFICATION",
      payload: {
        id: Date.now(),
        title: "Events Duplicated",
        message: `${selectedEvents.length} events duplicated`,
        type: "success",
      },
    })
  }

  if (selectedEvents.length === 0) return null

  return (
    <div className="bulk-actions-bar">
      <div className="bulk-info">
        <CheckSquare />
        <span>{selectedEvents.length} events selected</span>
      </div>

      <div className="bulk-buttons">
        <button onClick={handleBulkDuplicate} className="bulk-btn">
          <Copy />
          Duplicate
        </button>

        <div className="bulk-dropdown">
          <button onClick={() => setShowBulkMenu(!showBulkMenu)} className="bulk-btn">
            <Tag />
            Change Category
          </button>
          {showBulkMenu && (
            <div className="bulk-menu">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleBulkCategoryChange(category.id)}
                  className="bulk-menu-item"
                >
                  <div className="category-dot" style={{ backgroundColor: category.color }} />
                  {category.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <button onClick={handleBulkDelete} className="bulk-btn danger">
          <Trash2 />
          Delete
        </button>

        <button onClick={onClearSelection} className="bulk-btn secondary">
          Cancel
        </button>
      </div>
    </div>
  )
}
