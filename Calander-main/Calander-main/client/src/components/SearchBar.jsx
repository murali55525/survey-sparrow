"use client"

import { useState } from "react"
import { Search, Filter, X } from "lucide-react"
import { useEvents } from "../context/EventContext"

const SearchBar = () => {
  const { searchTerm, setSearchTerm, selectedCategory, setSelectedCategory } = useEvents()
  const [showFilters, setShowFilters] = useState(false)

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "personal", label: "Personal" },
    { value: "work", label: "Work" },
    { value: "health", label: "Health" },
    { value: "social", label: "Social" },
    { value: "travel", label: "Travel" },
    { value: "education", label: "Education" },
  ]

  return (
    <div className="glass-card rounded-2xl p-4">
      <div className="flex items-center space-x-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search events..."
            className="w-full pl-10 pr-4 py-3 bg-white/50 border border-slate-200/50 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-slate-100 rounded-full transition-colors duration-200"
            >
              <X className="w-4 h-4 text-slate-400" />
            </button>
          )}
        </div>

        {/* Filter Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`p-3 rounded-xl border transition-all duration-200 ${
            showFilters
              ? "bg-blue-500 text-white border-blue-500"
              : "bg-white/50 text-slate-600 border-slate-200/50 hover:bg-white/80"
          }`}
        >
          <Filter className="w-5 h-5" />
        </button>
      </div>

      {/* Filter Options */}
      {showFilters && (
        <div className="mt-4 pt-4 border-t border-slate-200/50">
          <div className="flex items-center space-x-2 flex-wrap gap-2">
            <span className="text-sm font-medium text-slate-600">Category:</span>
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category.value
                    ? "bg-blue-500 text-white"
                    : "bg-white/50 text-slate-600 hover:bg-white/80"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchBar
