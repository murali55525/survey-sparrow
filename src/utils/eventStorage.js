// Utility for event CRUD and localStorage sync

const EVENTS_KEY = 'events';

export function loadEvents() {
  try {
    return JSON.parse(localStorage.getItem(EVENTS_KEY) || '{}');
  } catch {
    return {};
  }
}

export function saveEvents(events) {
  localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
}

export function addEvent(events, dateKey, event) {
  // Always add the event (allow duplicates)
  const updated = {
    ...events,
    [dateKey]: [...(events[dateKey] || []), event]
  };
  saveEvents(updated);
  return updated;
}

export function updateEvent(events, dateKey, idx, updatedEvent) {
  const updated = {
    ...events,
    [dateKey]: events[dateKey].map((ev, i) => (i === idx ? updatedEvent : ev))
  };
  saveEvents(updated);
  return updated;
}

export function deleteEvent(events, dateKey, idx) {
  const updated = {
    ...events,
    [dateKey]: events[dateKey].filter((_, i) => i !== idx)
  };
  saveEvents(updated);
  return updated;
}
