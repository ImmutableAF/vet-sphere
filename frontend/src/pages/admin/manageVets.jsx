import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { ChevronLeft, ChevronRight, MapPin, Clock, Calendar } from "lucide-react"
import { Swiper, SwiperSlide } from "swiper/react"
import { EffectCards, Navigation } from "swiper/modules"
import "swiper/css/effect-cards"
import "swiper/css/navigation"
import "swiper/css"
import { getAllVets } from "../../services/admin"


function formatDate(value) {
  if (!value) return "—"
  return new Date(value).toLocaleDateString()
}

function initials(name) {
  if (!name) return "?"
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase()
}

const STATUS_SECTIONS = [
  { key: "pending", label: "Pending", badgeBg: "bg-[#E0B84C]", badgeText: "text-white" },
  { key: "verified", label: "Verified", badgeBg: "bg-green-600", badgeText: "text-white" },
  { key: "rejected", label: "Rejected", badgeBg: "bg-red-700", badgeText: "text-white" },
  { key: "not_submitted", label: "Not Submitted", badgeBg: "bg-gray-500", badgeText: "text-white" },
]

function VetCard({ vet, badgeBg, badgeText, label, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-white border border-[#F0EBE0] rounded-2xl overflow-hidden shadow-md cursor-pointer w-full h-full flex flex-col"
    >
      <div className="flex justify-between items-start px-6 py-5 bg-[#EDE7F6]">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 rounded-full bg-[#5B4B8A] text-white flex items-center justify-center font-semibold text-base shrink-0">
            {initials(vet.name)}
          </div>
          <div className="min-w-0">
            <h2 className="text-xl font-semibold text-[#3D3A34] leading-tight truncate">{vet.name}</h2>
            <p className="text-sm text-[#5B4B8A] mt-0.5 truncate">
              {vet.specialization || "No specialization listed"}
            </p>
          </div>
        </div>
        <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium leading-none shrink-0 ${badgeBg} ${badgeText}`}>
          {label}
        </span>
      </div>

      <div className="px-6 py-5 flex flex-col flex-1 gap-4">
        <div className="space-y-3 text-[15px] text-[#3D3A34]">
          <div className="flex items-center gap-2.5">
            <MapPin size={17} className="text-[#8A8578] shrink-0" />
            <span>{vet.city || "City not listed"}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Clock size={17} className="text-[#8A8578] shrink-0" />
            <span>{vet.experienceYears ?? "—"} years of experience</span>
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-[#F0EBE0] flex items-center gap-2 text-sm text-[#8A8578]">
          <Calendar size={14} className="shrink-0" />
          <span>Submitted {formatDate(vet.submittedAt)}</span>
        </div>
      </div>
    </div>
  )
}

function ManageVets() {
  const navigate = useNavigate()
  const [vets, setVets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeStatus, setActiveStatus] = useState("pending")
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    const loadVets = async () => {
      try {
        setLoading(true)
        const data = await getAllVets()
        setVets(data)
        setError("")
      } catch (err) {
        setError("Failed to load vets")
      } finally {
        setLoading(false)
      }
    }
    loadVets()
  }, [])

  const activeSection = STATUS_SECTIONS.find((s) => s.key === activeStatus)
  const filteredVets = useMemo(
    () => vets.filter((v) => v.verificationStatus === activeStatus),
    [vets, activeStatus]
  )

  const onOpenVet = (id) => navigate(`/dashboard/admin/vets/${id}`)
  const backgroundStyle = { background: "linear-gradient(135deg, #C9B6E4 0%, #E8DFF5 50%, #D8CDEF 100%)" }

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center -m-8" style={backgroundStyle}>
        <p className="text-[#3D3A34]">Loading vets...</p>
      </div>
    )
  }

  return (
    <div className="w-screen h-screen overflow-y-auto -m-8" style={backgroundStyle}>
      <div className="max-w-3xl mx-auto p-8">
        <h1 className="text-2xl font-semibold text-[#3D3A34] mb-2">Manage Vets</h1>

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
            </button>
          ))}
        </div>

        <p className="text-center text-2xl font-semibold tracking-wide text-[#5B4B8A] mb-6 uppercase">
          {activeSection.label}
        </p>

        {filteredVets.length === 0 ? (
          <p className="text-center text-[#5B4B8A]/70 text-sm">No vets in this category.</p>
        ) : showAll ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredVets.map((vet) => (
              <div key={vet._id} className="h-[300px]">
                <VetCard
                  vet={vet}
                  label={activeSection.label}
                  badgeBg={activeSection.badgeBg}
                  badgeText={activeSection.badgeText}
                  onClick={() => onOpenVet(vet._id)}
                />
              </div>
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
              loop={filteredVets.length > 1}
              modules={[EffectCards, Navigation]}
              navigation={{
                nextEl: `.swiper-nav-next-${activeStatus}`,
                prevEl: `.swiper-nav-prev-${activeStatus}`,
              }}
              className="w-[320px] h-[380px]"
            >
              {filteredVets.map((vet) => (
                <SwiperSlide key={vet._id} className="rounded-2xl">
                  <VetCard
                    vet={vet}
                    label={activeSection.label}
                    badgeBg={activeSection.badgeBg}
                    badgeText={activeSection.badgeText}
                    onClick={() => onOpenVet(vet._id)}
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

        {filteredVets.length > 0 && (
          <div className="flex justify-end mt-8 sticky bottom-4">
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

export default ManageVets