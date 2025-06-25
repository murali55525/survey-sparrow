import { useState } from 'react'
import CalendarApp from './CalendarApp'

export default function App() {
  const [viewMode, setViewMode] = useState('month')

  return (
    <div className="h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 font-inter text-[15px] text-gray-900 dark:text-gray-100 flex flex-col overflow-hidden transition-colors duration-300">
      {/* Animated background particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-200/20 dark:bg-blue-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-200/20 dark:bg-purple-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-20 left-1/2 w-80 h-80 bg-pink-200/20 dark:bg-pink-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000"></div>
      </div>

      {/* Main content area with glass effect */}
      <div className="flex-1 flex flex-col relative z-10 h-full overflow-hidden">
        <CalendarApp viewMode={viewMode} setViewMode={setViewMode} />
      </div>
    </div>
  )
}
