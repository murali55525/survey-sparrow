import { Calendar, Target, CheckCircle, AlertCircle } from "lucide-react"
import { useEvents } from "../context/EventContext"

const Stats = ({ selectedDate, currentDate }) => {
  const { getEventStats } = useEvents()
  const eventStats = getEventStats()

  const today = new Date()
  const daysInCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const currentDay = today.getDate()
  const monthProgress = (currentDay / daysInCurrentMonth) * 100

  const stats = [
    {
      icon: Calendar,
      label: "Total Events",
      value: eventStats.total,
      color: "from-blue-500 to-indigo-600",
      bgColor: "from-blue-50 to-indigo-50",
      borderColor: "border-blue-200/50",
    },
    {
      icon: CheckCircle,
      label: "This Month",
      value: eventStats.thisMonth,
      color: "from-emerald-500 to-teal-600",
      bgColor: "from-emerald-50 to-teal-50",
      borderColor: "border-emerald-200/50",
    },
    {
      icon: AlertCircle,
      label: "Upcoming",
      value: eventStats.upcoming,
      color: "from-purple-500 to-pink-600",
      bgColor: "from-purple-50 to-pink-50",
      borderColor: "border-purple-200/50",
    },
    {
      icon: Target,
      label: "Month Progress",
      value: `${Math.round(monthProgress)}%`,
      color: "from-orange-500 to-red-600",
      bgColor: "from-orange-50 to-red-50",
      borderColor: "border-orange-200/50",
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className={`glass-card rounded-2xl p-6 bg-gradient-to-r ${stat.bgColor} border ${stat.borderColor} hover:scale-105 transition-all duration-300 fade-in`}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`p-2 bg-gradient-to-r ${stat.color} rounded-lg shadow-lg`}>
              <stat.icon className="w-4 h-4 text-white" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-slate-800">{stat.value}</div>
            </div>
          </div>
          <p className="text-sm font-medium text-slate-600">{stat.label}</p>
        </div>
      ))}
    </div>
  )
}

export default Stats
