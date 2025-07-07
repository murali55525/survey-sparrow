"use client"

import { useState } from "react"
import { X, Upload, Download, FileText, AlertCircle, CheckCircle } from "lucide-react"
import { useCalendar } from "../context/CalendarContext"

export default function ImportModal() {
  const { showImportModal, dispatch, importCalendarData, exportCalendarData } = useCalendar()
  const [importType, setImportType] = useState("json") // json, ics, csv
  const [importData, setImportData] = useState("")
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState(null)

  const handleClose = () => {
    dispatch({ type: "TOGGLE_IMPORT_MODAL" })
    setImportData("")
    setImportResult(null)
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      setImportData(e.target.result)
    }
    reader.readAsText(file)
  }

  const handleImport = async () => {
    setImporting(true)
    setImportResult(null)

    try {
      let success = false

      if (importType === "json") {
        const data = JSON.parse(importData)
        success = importCalendarData(data)
      }

      setImportResult({
        success,
        message: success ? "Data imported successfully!" : "Failed to import data. Please check the format.",
      })

      if (success) {
        dispatch({
          type: "ADD_NOTIFICATION",
          payload: {
            title: "Import Successful",
            message: "Your calendar data has been imported",
            type: "success",
          },
        })
        setTimeout(handleClose, 2000)
      }
    } catch (error) {
      console.error("Import error:", error)
      setImportResult({
        success: false,
        message: "Error parsing data. Please check the file format.",
      })
    } finally {
      setImporting(false)
    }
  }

  const handleExport = () => {
    const data = exportCalendarData()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `calendar-export-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    dispatch({
      type: "ADD_NOTIFICATION",
      payload: {
        title: "Export Complete",
        message: "Calendar data exported successfully",
        type: "success",
      },
    })
  }

  if (!showImportModal) return null

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
                <Upload />
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
                  Import/Export Calendar Data
                </h2>
                <p style={{ fontSize: "14px", color: "var(--text-secondary)", margin: 0 }}>
                  Import events from other calendars or export your data
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
            <div
              style={{
                padding: "24px",
                background: "var(--bg-secondary)",
                borderRadius: "12px",
                border: "1px solid var(--border-primary)",
              }}
            >
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  color: "var(--text-primary)",
                  margin: "0 0 8px 0",
                }}
              >
                Export Calendar
              </h3>
              <p style={{ color: "var(--text-secondary)", margin: "0 0 20px 0", fontSize: "14px" }}>
                Export all your calendar data as a JSON file
              </p>
              <button
                onClick={handleExport}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "12px 20px",
                  background: "#2f5249",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                <Download />
                Export Calendar Data
              </button>
            </div>

            <div
              style={{
                padding: "24px",
                background: "var(--bg-secondary)",
                borderRadius: "12px",
                border: "1px solid var(--border-primary)",
              }}
            >
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  color: "var(--text-primary)",
                  margin: "0 0 8px 0",
                }}
              >
                Import Calendar
              </h3>
              <p style={{ color: "var(--text-secondary)", margin: "0 0 20px 0", fontSize: "14px" }}>
                Import events from JSON files
              </p>

              <div
                style={{
                  marginBottom: "20px",
                }}
              >
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  style={{ display: "none" }}
                  id="import-file"
                />
                <label
                  htmlFor="import-file"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "12px 20px",
                    background: "var(--bg-primary)",
                    border: "2px dashed var(--border-primary)",
                    borderRadius: "8px",
                    color: "var(--text-secondary)",
                    cursor: "pointer",
                    textAlign: "center",
                    justifyContent: "center",
                  }}
                >
                  <FileText />
                  Choose JSON file
                </label>
              </div>

              {importData && (
                <div style={{ marginBottom: "20px" }}>
                  <h4
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "var(--text-primary)",
                      margin: "0 0 8px 0",
                    }}
                  >
                    File Preview:
                  </h4>
                  <textarea
                    value={importData.substring(0, 500) + (importData.length > 500 ? "..." : "")}
                    readOnly
                    style={{
                      width: "100%",
                      height: "120px",
                      padding: "12px",
                      border: "1px solid var(--border-primary)",
                      borderRadius: "8px",
                      background: "var(--bg-primary)",
                      color: "var(--text-primary)",
                      fontFamily: "monospace",
                      fontSize: "12px",
                      resize: "vertical",
                    }}
                  />
                </div>
              )}

              {importResult && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "12px 16px",
                    borderRadius: "8px",
                    marginBottom: "20px",
                    fontSize: "14px",
                    fontWeight: "500",
                    background: importResult.success ? "#f0f9ff" : "#fef2f2",
                    color: importResult.success ? "#0369a1" : "#dc2626",
                    border: `1px solid ${importResult.success ? "#7dd3fc" : "#fca5a5"}`,
                  }}
                >
                  {importResult.success ? <CheckCircle /> : <AlertCircle />}
                  <span>{importResult.message}</span>
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  onClick={handleImport}
                  disabled={!importData || importing}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "12px 20px",
                    background: "#2f5249",
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: !importData || importing ? "not-allowed" : "pointer",
                    opacity: !importData || importing ? 0.5 : 1,
                  }}
                >
                  {importing ? "Importing..." : "Import Data"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
