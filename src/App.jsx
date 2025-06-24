import CalendarApp from './CalendarApp'

export default function App() {
  return (
    <div className="min-h-screen w-full bg-white font-sans text-[15px] text-gray-900 flex flex-col">
      {/* Simplified header - white background */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        {/* Place your CalendarHeader component here if not already in CalendarApp */}
        {/* <CalendarHeader ...props /> */}
      </div>
      <div className="flex-1 flex flex-col">
        <CalendarApp />
      </div>
    </div>
  )
}
