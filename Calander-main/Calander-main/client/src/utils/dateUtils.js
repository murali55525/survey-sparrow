import dayjs from "dayjs"
import utc from "dayjs/plugin/utc.js"
import timezone from "dayjs/plugin/timezone.js"
import isSameOrBefore from "dayjs/plugin/isSameOrBefore.js"
import isSameOrAfter from "dayjs/plugin/isSameOrAfter.js"
import weekOfYear from "dayjs/plugin/weekOfYear.js"
import relativeTime from "dayjs/plugin/relativeTime.js"
import customParseFormat from "dayjs/plugin/customParseFormat.js"

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)
dayjs.extend(weekOfYear)
dayjs.extend(relativeTime)
dayjs.extend(customParseFormat)

export const formatDate = (date, format = "YYYY-MM-DD") => {
  return dayjs(date).format(format)
}

export const formatTime = (date, format = "HH:mm") => {
  return dayjs(date).format(format)
}

export const formatDateTime = (date, format = "YYYY-MM-DD HH:mm") => {
  return dayjs(date).format(format)
}

export const formatMonthYear = (date) => {
  return dayjs(date).format("MMMM YYYY")
}

export const isToday = (date) => {
  return dayjs(date).isSame(dayjs(), "day")
}

export const isSameDay = (date1, date2) => {
  return dayjs(date1).isSame(dayjs(date2), "day")
}

export const addDays = (date, days) => {
  return dayjs(date).add(days, "day").toDate()
}

export const addWeeks = (date, weeks) => {
  return dayjs(date).add(weeks, "week").toDate()
}

export const addMonths = (date, months) => {
  return dayjs(date).add(months, "month").toDate()
}

export const subMonths = (date, months) => {
  return dayjs(date).subtract(months, "month").toDate()
}

export const startOfMonth = (date) => {
  return dayjs(date).startOf("month").toDate()
}

export const endOfMonth = (date) => {
  return dayjs(date).endOf("month").toDate()
}

export const startOfWeek = (date) => {
  return dayjs(date).startOf("week").toDate()
}

export const endOfWeek = (date) => {
  return dayjs(date).endOf("week").toDate()
}

export const getDaysInMonth = (date) => {
  return dayjs(date).daysInMonth()
}

export const getFirstDayOfMonth = (date) => {
  return dayjs(date).startOf("month").day()
}

export const getDayOfYear = (date) => {
  return dayjs(date).dayOfYear()
}

export const getWeekNumber = (date) => {
  return dayjs(date).week()
}

export const getQuarter = (date) => {
  return dayjs(date).quarter()
}

export const getRelativeTime = (date) => {
  return dayjs(date).fromNow()
}

export const getWeekDays = (startDate) => {
  const days = []
  for (let i = 0; i < 7; i++) {
    days.push(dayjs(startDate).add(i, "day").toDate())
  }
  return days
}

export const getMonthCalendarDays = (date) => {
  const start = dayjs(date).startOf("month").startOf("week")
  const end = dayjs(date).endOf("month").endOf("week")
  const days = []

  let current = start
  while (current.isSameOrBefore(end)) {
    days.push(current.toDate())
    current = current.add(1, "day")
  }

  return days
}

export const getTimeSlots = (startHour = 0, endHour = 24, interval = 30) => {
  const slots = []
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += interval) {
      const time = dayjs().hour(hour).minute(minute).second(0)
      slots.push({
        time: time.format("HH:mm"),
        display: time.format("h:mm A"),
        value: hour * 60 + minute,
      })
    }
  }
  return slots
}

export const getHoursArray = () => {
  const hours = []
  for (let i = 0; i < 24; i++) {
    hours.push({
      hour: i,
      display: i === 0 ? "12 AM" : i < 12 ? `${i} AM` : i === 12 ? "12 PM" : `${i - 12} PM`,
    })
  }
  return hours
}

export const sortEventsByTime = (events) => {
  return events.sort((a, b) => new Date(a.date) - new Date(b.date))
}

export const generateRecurringEvents = (event, endDate) => {
  const events = []
  const { recurring, date } = event

  if (recurring === "none") return [event]

  let current = dayjs(date)
  const end = dayjs(endDate)

  while (current.isSameOrBefore(end)) {
    events.push({
      ...event,
      id: `${event.id}-${current.format("YYYY-MM-DD")}`,
      date: current.toDate(),
      isRecurring: true,
      originalId: event.id,
    })

    switch (recurring) {
      case "daily":
        current = current.add(1, "day")
        break
      case "weekly":
        current = current.add(1, "week")
        break
      case "monthly":
        current = current.add(1, "month")
        break
      case "yearly":
        current = current.add(1, "year")
        break
      default:
        break
    }
  }

  return events
}

export const getEventPosition = (event, dayStart = 0, dayEnd = 24) => {
  const eventStart = dayjs(event.date)
  const eventEnd = dayjs(event.endDate || event.date).add(event.duration || 60, "minute")

  const dayStartMinutes = dayStart * 60
  const dayEndMinutes = dayEnd * 60
  const totalMinutes = dayEndMinutes - dayStartMinutes

  const eventStartMinutes = eventStart.hour() * 60 + eventStart.minute()
  const eventEndMinutes = eventEnd.hour() * 60 + eventEnd.minute()

  const top = ((eventStartMinutes - dayStartMinutes) / totalMinutes) * 100
  const height = ((eventEndMinutes - eventStartMinutes) / totalMinutes) * 100

  return {
    top: Math.max(0, top),
    height: Math.max(2, height),
  }
}

export const exportToICS = (events) => {
  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Advanced Calendar//EN",
    ...events.flatMap((event) => [
      "BEGIN:VEVENT",
      `UID:${event.id}`,
      `DTSTART:${dayjs(event.date).utc().format("YYYYMMDDTHHmmss")}Z`,
      `DTEND:${dayjs(event.endDate || event.date)
        .add(event.duration || 60, "minute")
        .utc()
        .format("YYYYMMDDTHHmmss")}Z`,
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.description || ""}`,
      `LOCATION:${event.location || ""}`,
      "END:VEVENT",
    ]),
    "END:VCALENDAR",
  ].join("\r\n")

  return icsContent
}
