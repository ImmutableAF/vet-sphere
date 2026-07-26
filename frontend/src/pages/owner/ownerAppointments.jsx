import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getAppointments, updateAppointmentStatus } from "../../services/appointments"
import { ScrollArea } from "@/components/ui/scroll-area"

const STATUS_STYLES = {
  pending: "bg-[#FBE9DD] text-[#B8730F]",
  confirmed: "bg-[#E7F0E5] text-[#4F7A57]",
  completed: "bg-[#EDE7F7] text-[#6F5FA3]",
  rejected: "bg-red-50 text-[#C0392B]",
  cancelled: "bg-red-50 text-[#C0392B]",
}

const OWNER_ACTIONS = {
  pending: [{ label: "Cancel", nextStatus: "cancelled" }],
  confirmed: [{ label: "Cancel", nextStatus: "cancelled" }],
  completed: [],
  rejected: [],
  cancelled: [],
}

function formatApptDate(dateString) {
  const d = new Date(dateString)
  return {
    day: d.getDate().toString().padStart(2, "0"),
    mon: d.toLocaleString("default", { month: "short" }),
    year: d.getFullYear(),
    time: d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
  }
}

function OwnerAppointments() {
  const navigate = useNavigate()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [cancellingId, setCancellingId] = useState(null)

  const glassCard = "backdrop-blur-xl bg-white/40 border border-white/60 shadow-lg rounded-2xl"
  const backgroundStyle = { background: "linear-gradient(135deg, #C9B6E4 0%, #E8DFF5 50%, #D8CDEF 100%)" }

  useEffect(() => {
    let ignore = false

    const loadAppointments = async () => {
      try {
        const res = await getAppointments()
        if (!ignore) setAppointments(res)
      } catch {
        if (!ignore) setError("Failed to load appointments")
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadAppointments()

    return () => {
      ignore = true
    }
  }, [])

  const handleStatusChange = async (id, nextStatus) => {
    setCancellingId(id)
    const prevAppointments = appointments
    setAppointments((prev) =>
      prev.map((appt) =>
        appt._id === id ? { ...appt, status: nextStatus } : appt
      )
    )
    try {
      await updateAppointmentStatus(id, nextStatus)
    } catch {
      setAppointments(prevAppointments)
      setError("Failed to update appointment")
    } finally {
      setCancellingId(null)
    }
  }

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center p-0 -m-8" style={backgroundStyle}>
        <p className="text-[#3D3A34]">Loading appointments...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-screen h-screen flex items-center justify-center p-0 -m-8" style={backgroundStyle}>
        <p className="text-red-800 bg-white/50 px-4 py-2 rounded-xl">{error}</p>
      </div>
    )
  }

  return (
    <div className="w-screen h-screen overflow-y-auto p-0 -m-8" style={backgroundStyle}>
      <div className="flex flex-col gap-6 max-w-4xl mx-auto p-8">

        {/* Header section */}
        <div className={`${glassCard} px-8 py-6 flex items-center justify-between`}>
          <h1 className="text-2xl font-semibold text-[#3D3A34]">Appointments</h1>
          <button
            onClick={() => navigate("/dashboard/owner")}
            className="text-sm font-medium px-4 py-2 rounded-full bg-white/50 text-[#5B4B8A] hover:bg-white/70 transition-colors whitespace-nowrap"
          >
            Back to overview
          </button>
        </div>

        {/* Appointments list */}
        <div className={`${glassCard} px-8 py-6`}>
          {appointments.length === 0 ? (
            <div className="flex h-24 w-full items-center justify-center rounded-xl bg-white/50 text-sm text-[#5B4B8A]">
              No appointments yet. Book one from the Book page.
            </div>
          ) : (
            <ScrollArea className="h-[600px] w-full">
              <div className="space-y-4 pr-4">
                {appointments.map((appt) => {
                  const { day, mon, year, time } = formatApptDate(appt.date)
                  return (
                    <div
                      key={appt._id}
                      className="bg-white/50 hover:bg-white/80 transition-colors rounded-xl border border-white/50 shadow-sm px-6 py-6 flex items-center gap-6"
                    >
                      {/* Highlighted date block */}
                      <div className="w-16 h-16 rounded-xl bg-[#5B4B8A] flex flex-col items-center justify-center flex-shrink-0">
                        <span className="text-2xl font-bold text-white leading-none">{day}</span>
                        <span className="text-[10px] font-semibold text-white/80 uppercase mt-1">{mon}</span>
                      </div>

                      <div className="flex-1">
                        <h3 className="text-base font-semibold text-[#3D3A34]">
                          {appt.pet?.name ?? "Unknown pet"} with {appt.vet?.name ?? "Unknown vet"}
                        </h3>

                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs font-semibold bg-white/70 text-[#5B4B8A] px-2.5 py-1 rounded-full">
                            {time}
                          </span>
                          <span className="text-xs text-[#8B7BC0]">•</span>
                          <span className="text-sm text-[#5B4B8A]">{year}</span>
                          {appt.vet?.city && (
                            <>
                              <span className="text-xs text-[#8B7BC0]">•</span>
                              <span className="text-sm text-[#5B4B8A]">📍 {appt.vet.city}</span>
                            </>
                          )}
                        </div>

                        {appt.reason && (
                          <p className="text-sm text-[#5B4B8A] mt-2">{appt.reason}</p>
                        )}
                      </div>

                      <div className="flex flex-col items-end gap-2 max-w-[220px] flex-shrink-0">
                        <span
                          className={`text-xs font-semibold px-3 py-1.5 rounded-full ${STATUS_STYLES[appt.status] ?? STATUS_STYLES.pending}`}
                        >
                          {appt.status}
                        </span>
                        {appt.statusNote && (
                          <p className="text-xs text-[#5B4B8A] text-right italic">
                            {appt.statusNote}
                          </p>
                        )}
                        {OWNER_ACTIONS[appt.status]?.map((action) => (
                          <button
                            key={action.nextStatus}
                            onClick={() => handleStatusChange(appt._id, action.nextStatus)}
                            disabled={cancellingId === appt._id}
                            className="text-xs font-semibold px-4 py-1.5 rounded-full bg-red-900 text-white hover:bg-red-800 transition-colors disabled:opacity-60"
                          >
                            {cancellingId === appt._id ? "Cancelling..." : action.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </ScrollArea>
          )}
        </div>

      </div>
    </div>
  )
}

export default OwnerAppointments