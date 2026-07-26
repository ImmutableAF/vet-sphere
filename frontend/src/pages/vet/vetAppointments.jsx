import { useEffect, useMemo, useState } from "react"
import { ChevronLeft, ChevronRight, Stethoscope } from "lucide-react"
import { Swiper, SwiperSlide } from "swiper/react"
import { EffectCards, Navigation } from "swiper/modules"
import "swiper/css/effect-cards"
import "swiper/css/navigation"
import "swiper/css"
import { getAppointments, updateAppointmentStatus } from "../../services/appointments"

const STATUS_SECTIONS = [
  { key: "pending", label: "Pending", badgeBg: "bg-[#E0B84C]", badgeText: "text-white" },
  { key: "confirmed", label: "Confirmed", badgeBg: "bg-green-600", badgeText: "text-white" },
  { key: "completed", label: "Completed", badgeBg: "bg-[#5B4B8A]", badgeText: "text-white" },
  { key: "rejected", label: "Rejected", badgeBg: "bg-red-700", badgeText: "text-white" },
  { key: "cancelled", label: "Cancelled", badgeBg: "bg-gray-500", badgeText: "text-white" },
]

const STATUS_ACTIONS = {
  pending: [
    { label: "Approve", nextStatus: "confirmed", style: "bg-green-600 text-white" },
    { label: "Reject", nextStatus: "rejected", style: "bg-red-900 text-white" },
  ],
  confirmed: [
    { label: "Mark Completed", nextStatus: "completed", style: "bg-[#8A6FC7] text-white" },
    { label: "Cancel", nextStatus: "cancelled", style: "bg-red-900 text-white" },
  ],
  completed: [],
  rejected: [],
  cancelled: [],
}

function formatDateTime(value) {
  if (!value) return "No date set"
  return new Date(value).toLocaleString()
}

function AppointmentCard({ appt, badgeBg, badgeText, label, updatingId, onAction }) {
  return (
    <div className="bg-white border border-[#F0EBE0] rounded-2xl overflow-hidden shadow-md cursor-default w-full h-full flex flex-col">
      <div className="flex justify-between items-center px-5 py-3 bg-[#EDE7F6]">
        <h2 className="text-lg font-semibold text-[#3D3A34]">{appt.pet?.name || "Unknown pet"}</h2>
        <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-medium leading-none ${badgeBg} ${badgeText}`}>
          {label}
        </span>
      </div>

      <div className="px-5 py-4 flex flex-col flex-1">
        <div>
          <p className="text-sm text-[#8A8578] mb-1">
            Owner: {appt.owner?.name || "Unknown"}
          </p>
          {appt.vet?.name && (
            <p className="flex items-center gap-1.5 text-sm text-[#5B4B8A] font-medium mb-3">
              <Stethoscope size={14} className="shrink-0" />
              Dr. {appt.vet.name}
              {appt.vet.specialization ? ` · ${appt.vet.specialization}` : ""}
            </p>
          )}
          <div className="text-sm text-[#3D3A34] space-y-1">
            <p><span className="text-[#8A8578]">When:</span> {formatDateTime(appt.date)}</p>
            {appt.reason && (
              <p><span className="text-[#8A8578]">Reason:</span> {appt.reason}</p>
            )}
            {appt.statusNote && (
              <p className="text-xs text-[#8A8578] italic">{appt.statusNote}</p>
            )}
          </div>
        </div>

        {STATUS_ACTIONS[appt.status]?.length > 0 && (
          <div className="flex gap-2 flex-wrap mt-auto pt-4">
            {STATUS_ACTIONS[appt.status].map((action) => (
              <button
                key={action.nextStatus}
                onClick={(e) => {
                  e.stopPropagation()
                  onAction(appt._id, action.nextStatus)
                }}
                disabled={updatingId === appt._id}
                className={`px-4 py-2 rounded-full text-sm font-medium disabled:opacity-50 ${action.style}`}
              >
                {updatingId === appt._id ? "…" : action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function VetAppointments() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeStatus, setActiveStatus] = useState("pending")
  const [showAll, setShowAll] = useState(false)
  const [updatingId, setUpdatingId] = useState(null)

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        setLoading(true)
        const data = await getAppointments()
        setAppointments(data)
        setError("")
      } catch (err) {
        setError("Couldn't load appointments. Please try again.")
      } finally {
        setLoading(false)
      }
    }
    loadAppointments()
  }, [])

  const handleStatusChange = async (appointmentId, nextStatus) => {
    setUpdatingId(appointmentId)
    const prevAppointments = appointments
    setAppointments((prev) =>
      prev.map((appt) =>
        appt._id === appointmentId ? { ...appt, status: nextStatus } : appt
      )
    )
    try {
      await updateAppointmentStatus(appointmentId, nextStatus)
    } catch (err) {
      setAppointments(prevAppointments)
      setError("Update failed — please try again.")
    } finally {
      setUpdatingId(null)
    }
  }

  const activeSection = STATUS_SECTIONS.find((s) => s.key === activeStatus)
  const filteredAppointments = useMemo(
    () => appointments.filter((a) => a.status === activeStatus),
    [appointments, activeStatus]
  )

  const backgroundStyle = { background: "linear-gradient(135deg, #C9B6E4 0%, #E8DFF5 50%, #D8CDEF 100%)" }

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center -m-8" style={backgroundStyle}>
        <p className="text-[#3D3A34]">Loading appointments...</p>
      </div>
    )
  }

  return (
    <div className="w-screen h-screen overflow-y-auto -m-8" style={backgroundStyle}>
      <div className="max-w-3xl mx-auto p-8">
        <h1 className="text-2xl font-semibold text-[#3D3A34] mb-2">Appointments</h1>

        {error && (
          <div className="mb-6 px-4 py-2 rounded-lg bg-red-100 text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-3 flex-wrap mb-8">
          {STATUS_SECTIONS.map((section) => (
            <button
              key={section.key}
              onClick={() => {
                setActiveStatus(section.key)
                setShowAll(false)
              }}
              className={`px-5 py-2 rounded-full text-sm font-medium transition ${
                activeStatus === section.key
                  ? "bg-[#5B4B8A] text-white border-2 border-[#5B4B8A]"
                  : "bg-white/50 text-[#3D3A34] border border-white/70"
              }`}
            >
              {section.label}
              <span className="ml-2 text-xs opacity-70">
                {appointments.filter((a) => a.status === section.key).length}
              </span>
            </button>
          ))}
        </div>

        <p className="text-center text-2xl font-semibold tracking-wide text-[#5B4B8A] mb-6 uppercase">
          {activeSection.label}
        </p>

        {filteredAppointments.length === 0 ? (
          <p className="text-center text-[#5B4B8A]/70 text-sm">No {activeSection.label.toLowerCase()} appointments.</p>
        ) : showAll ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 items-start">
            {filteredAppointments.map((appt) => (
              <AppointmentCard
                key={appt._id}
                appt={appt}
                label={activeSection.label}
                badgeBg={activeSection.badgeBg}
                badgeText={activeSection.badgeText}
                updatingId={updatingId}
                onAction={handleStatusChange}
              />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center gap-4">
            <button
              className={`swiper-nav-prev-${activeStatus} w-9 h-9 rounded-full border border-white/70 bg-white/50 flex items-center justify-center text-[#3D3A34] shrink-0`}
              aria-label="Previous"
            >
              <ChevronLeft size={18} />
            </button>

            <Swiper
              key={activeStatus}
              effect="cards"
              grabCursor={true}
              loop={filteredAppointments.length > 1}
              modules={[EffectCards, Navigation]}
              navigation={{
                nextEl: `.swiper-nav-next-${activeStatus}`,
                prevEl: `.swiper-nav-prev-${activeStatus}`,
              }}
              className="w-[300px] h-[340px]"
            >
              {filteredAppointments.map((appt) => (
                <SwiperSlide key={appt._id} className="rounded-2xl">
                  <AppointmentCard
                    appt={appt}
                    label={activeSection.label}
                    badgeBg={activeSection.badgeBg}
                    badgeText={activeSection.badgeText}
                    updatingId={updatingId}
                    onAction={handleStatusChange}
                  />
                </SwiperSlide>
              ))}
            </Swiper>

            <button
              className={`swiper-nav-next-${activeStatus} w-9 h-9 rounded-full border border-white/70 bg-white/50 flex items-center justify-center text-[#3D3A34] shrink-0`}
              aria-label="Next"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}

        {filteredAppointments.length > 0 && (
          <div className="flex justify-end mt-8">
            <button
              onClick={() => setShowAll((s) => !s)}
              className="px-4 py-2 rounded-full bg-white/80 backdrop-blur border border-white/70 shadow-md text-sm font-medium text-[#3D3A34]"
            >
              {showAll ? "Show less" : "Show more"}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default VetAppointments