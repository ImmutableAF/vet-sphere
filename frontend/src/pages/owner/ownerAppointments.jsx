import { useEffect, useState } from "react"
import { getAppointments, updateAppointmentStatus } from "../../services/appointments"

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

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

function OwnerAppointments() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [cancellingId, setCancellingId] = useState(null)

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

  if (loading) return <p className="text-[#9C968A] text-sm">Loading appointments...</p>
  if (error) return <p className="text-red-500 text-sm">{error}</p>

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#3D3A34] mb-6">Appointments</h1>

      {appointments.length === 0 ? (
        <p className="text-[#9C968A] text-sm">
          No appointments yet. Book one from the Book page.
        </p>
      ) : (
        <div className="space-y-3">
          {appointments.map((appt) => (
            <div
              key={appt._id}
              className="bg-white rounded-2xl px-5 py-4 border border-[#F2EDE2] hover:border-[#D8CFC0] transition-colors flex items-center justify-between gap-4"
            >
              <div>
                <h3 className="text-base font-semibold text-[#3D3A34]">
                  {appt.pet?.name ?? "Unknown pet"} with {appt.vet?.name ?? "Unknown vet"}
                </h3>
                <p className="text-sm text-[#9C968A]">{formatDate(appt.date)}</p>
                {appt.reason && (
                  <p className="text-sm text-[#9C968A] mt-1">{appt.reason}</p>
                )}
              </div>

              <div className="flex flex-col items-end gap-2 max-w-[220px]">
                <span
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full ${STATUS_STYLES[appt.status] ?? STATUS_STYLES.pending}`}
                >
                  {appt.status}
                </span>
                {appt.statusNote && (
                  <p className="text-xs text-[#9C968A] text-right italic">
                    {appt.statusNote}
                  </p>
                )}
                {OWNER_ACTIONS[appt.status]?.map((action) => (
                  <button
                    key={action.nextStatus}
                    onClick={() => handleStatusChange(appt._id, action.nextStatus)}
                    disabled={cancellingId === appt._id}
                    className="text-xs font-semibold px-4 py-1.5 rounded-full bg-[#FBE9DD] text-[#C0392B] hover:bg-[#f7ddc9] transition-colors disabled:opacity-60"
                  >
                    {cancellingId === appt._id ? "Cancelling..." : action.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default OwnerAppointments