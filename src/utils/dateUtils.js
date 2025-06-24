export const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate()
}

export const getFirstDayOfWeek = (year, month) => {
  return new Date(year, month, 1).getDay()
}

export const formatTime = (hours, minutes) => {
  return `${hours % 12 || 12}:${minutes.toString().padStart(2, '0')} ${hours >= 12 ? 'PM' : 'AM'}`
}
