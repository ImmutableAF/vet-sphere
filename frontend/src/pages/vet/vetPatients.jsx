import { useEffect, useMemo, useState } from "react"
import { ChevronLeft, ChevronRight, Clock } from "lucide-react"
import { Swiper, SwiperSlide } from "swiper/react"
import { EffectCards, Navigation } from "swiper/modules"
import "swiper/css/effect-cards"
import "swiper/css/navigation"
import "swiper/css"
import { getAppointments } from "../../services/appointments"

const STATUS_BADGES = {
  pending: "bg-[#E0B84C] text-white",
  confirmed: "bg-green-600 text-white",
  completed: "bg-[#5B4B8A] text-white",
  rejected: "bg-red-700 text-white",
  cancelled: "bg-gray-500 text-white",
}

function formatDate(value) {
  if (!value) return "—"
  return new Date(value).toLocaleDateString()
}

function formatTime(value) {
  if (!value) return "—"
  return new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

function initials(name) {
  if (!name) return "?"
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase()
}

function buildPatients(appointments) {
  const seen = new Map()

  appointments.forEach((a) => {
    if (!a.pet?._id) return
    if (!seen.has(a.pet._id)) {
      seen.set(a.pet._id, { ...a.pet, owner: a.owner, appointments: [] })
    }
    seen.get(a.pet._id).appointments.push(a)
  })

  const patients = Array.from(seen.values()).filter((p) =>
    p.appointments.some((a) => a.status === "confirmed" || a.status === "completed")
  )

  patients.forEach((p) => {
    p.appointments.sort((a, b) => new Date(b.date) - new Date(a.date))
  })

  return patients
}

function PatientCard({ patient, variant = "swiper" }) {
  const isGrid = variant === "grid"

  return (
    <div
      className={`bg-white border border-[#F0EBE0] rounded-2xl overflow-hidden shadow-md cursor-default w-full flex flex-col ${
        isGrid ? "" : "h-full"
      }`}
    >
      <div className="flex justify-between items-start px-6 py-5 bg-[#EDE7F6]">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 rounded-full bg-[#5B4B8A] text-white flex items-center justify-center font-semibold text-base shrink-0">
            {initials(patient.name)}
          </div>
          <div className="min-w-0">
            <h2 className="text-xl font-semibold text-[#3D3A34] leading-tight truncate">{patient.name}</h2>
            <p className="text-sm text-[#5B4B8A] mt-0.5 truncate">
              {patient.species || "Species unknown"} {patient.breed ? `· ${patient.breed}` : ""}
            </p>
          </div>
        </div>
        <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium leading-none shrink-0 bg-[#5B4B8A] text-white">
          {patient.appointments.length} visit{patient.appointments.length > 1 ? "s" : ""}
        </span>
      </div>

      <div className={`px-6 py-5 flex flex-col gap-3 ${isGrid ? "" : "flex-1 min-h-0"}`}>
        <p className="text-sm text-[#8A8578]">Owner: {patient.owner?.name || "Unknown"}</p>

        <div
          className={
            isGrid
              ? "space-y-3 max-h-[420px] overflow-y-auto pr-1"
              : "flex-1 min-h-0 overflow-y-auto space-y-2.5 pr-1"
          }
        >
          {patient.appointments.map((appt) => (
            <div
              key={appt._id}
              className="border border-[#F0EBE0] rounded-xl px-4 py-3.5 text-sm text-[#3D3A34]"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-medium">{formatDate(appt.date)}</span>
                <span
                  className={`text-[11px] px-2.5 py-0.5 rounded-full font-medium ${
                    STATUS_BADGES[appt.status] || "bg-gray-400 text-white"
                  }`}
                >
                  {appt.status}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[#5B4B8A] font-semibold mb-1.5">
                <Clock size={14} className="shrink-0" />
                <span>{formatTime(appt.date)}</span>
              </div>
              {appt.reason && <p className="text-[#8A8578]">{appt.reason}</p>}
              {appt.statusNote && (
                <p className="text-xs text-[#8A8578] italic mt-1">{appt.statusNote}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function VetPatients() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    const loadPatients = async () => {
      try {
        setLoading(true)
        const data = await getAppointments()
        setAppointments(data)
        setError("")
      } catch (err) {
        setError("Couldn't load patients. Please try again.")
      } finally {
        setLoading(false)
      }
    }
    loadPatients()
  }, [])

  const patients = useMemo(() => buildPatients(appointments), [appointments])
  const backgroundStyle = { background: "linear-gradient(135deg, #C9B6E4 0%, #E8DFF5 50%, #D8CDEF 100%)" }

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center -m-8" style={backgroundStyle}>
        <p className="text-[#3D3A34]">Loading patients...</p>
      </div>
    )
  }

  return (
    <div className="w-screen h-screen overflow-y-auto -m-8" style={backgroundStyle}>
      <div className="max-w-3xl mx-auto p-8">
        <h1 className="text-2xl font-semibold text-[#3D3A34] mb-2">My Patients</h1>
        <p className="text-sm text-[#5B4B8A] mb-8">
          {patients.length} patient{patients.length !== 1 ? "s" : ""} with confirmed visits
        </p>

        {error && (
          <div className="mb-6 px-4 py-2 rounded-lg bg-red-100 text-red-700 text-sm">
            {error}
          </div>
        )}

        {patients.length === 0 ? (
          <p className="text-center text-[#5B4B8A]/70 text-sm">
            No patients yet. Confirmed appointments will show up here.
          </p>
        ) : showAll ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 items-start">
            {patients.map((patient) => (
              <PatientCard key={patient._id} patient={patient} variant="grid" />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center gap-4">
            <button
              className="swiper-nav-prev-patients w-9 h-9 rounded-full border border-white/70 bg-white/50 flex items-center justify-center text-[#3D3A34] shrink-0"
              aria-label="Previous"
            >
              <ChevronLeft size={18} />
            </button>

            <Swiper
              effect="cards"
              grabCursor={true}
              loop={patients.length > 1}
              modules={[EffectCards, Navigation]}
              navigation={{
                nextEl: ".swiper-nav-next-patients",
                prevEl: ".swiper-nav-prev-patients",
              }}
              className="w-[320px] h-[420px]"
            >
              {patients.map((patient) => (
                <SwiperSlide key={patient._id} className="rounded-2xl">
                  <PatientCard patient={patient} />
                </SwiperSlide>
              ))}
            </Swiper>

            <button
              className="swiper-nav-next-patients w-9 h-9 rounded-full border border-white/70 bg-white/50 flex items-center justify-center text-[#3D3A34] shrink-0"
              aria-label="Next"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}

        {patients.length > 0 && (
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

export default VetPatients