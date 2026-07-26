import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getAppointments } from "../../services/appointments"
import { getPets } from "../../services/pets"
import { getVets } from "../../services/vets"
import HighlightGrid from "../../components/ui/HighlightGrid"
import { ScrollArea } from "@/components/ui/scroll-area"

function OwnerOverview() {
  const navigate = useNavigate()
  const [appointments, setAppointments] = useState([])
  const [pets, setPets] = useState([])
  const [vets, setVets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [appts, petsData, vetsData] = await Promise.all([
          getAppointments(),
          getPets(),
          getVets(),
        ])
        setAppointments(appts)
        setPets(petsData)
        setVets(vetsData)
      } catch (err) {
        setError("Failed to load dashboard data")
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  const formatApptDate = (dateStr) => {
    const d = new Date(dateStr)
    return {
      day: d.getDate().toString().padStart(2, "0"),
      mon: d.toLocaleString("default", { month: "short" }),
      time: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  }

  const glassCard = "backdrop-blur-xl bg-white/40 border border-white/60 shadow-lg rounded-2xl"
  const backgroundStyle = { background: "linear-gradient(135deg, #C9B6E4 0%, #E8DFF5 50%, #D8CDEF 100%)" }

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center p-0 -m-8" style={backgroundStyle}>
        <p className="text-[#3D3A34]">Loading dashboard...</p>
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

  const upcoming = appointments
    .filter(a => (a.status === "pending" || a.status === "confirmed") && new Date(a.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))

  const statRows = [
    [
      {
        color: "#4F7A57",
        content: (isActive) => (
          <div className="flex flex-col items-center gap-1 px-6 py-8 text-center">
            <span className={`text-4xl font-bold transition-colors ${isActive ? "text-white" : "text-[#4F7A57]"}`}>
              {upcoming.length}
            </span>
            <span className={`text-sm font-medium transition-colors ${isActive ? "text-white/90" : "text-[#6B9072]"}`}>
              Upcoming appointments
            </span>
            <button
              onClick={() => navigate("/dashboard/owner/book")}
              className={`mt-3 text-sm font-medium px-4 py-2 rounded-full transition active:scale-[0.97] ${
                isActive ? "bg-white/20 text-white hover:bg-white/30" : "bg-[#E7F0E5] text-[#4F7A57] hover:bg-[#DCEAD9]"
              }`}
            >
              Book new
            </button>
          </div>
        ),
      },
      {
        color: "#B5703B",
        content: (isActive) => (
          <div className="flex flex-col items-center gap-1 px-6 py-8 text-center">
            <span className={`text-4xl font-bold transition-colors ${isActive ? "text-white" : "text-[#B5703B]"}`}>
              {pets.length}
            </span>
            <span className={`text-sm font-medium transition-colors ${isActive ? "text-white/90" : "text-[#C68856]"}`}>
              Pets registered
            </span>
            <button
              onClick={() => navigate("/dashboard/owner/pets")}
              className={`mt-3 text-sm font-medium px-4 py-2 rounded-full transition active:scale-[0.97] ${
                isActive ? "bg-white/20 text-white hover:bg-white/30" : "bg-[#FBE9DD] text-[#B5703B] hover:bg-[#F7DECB]"
              }`}
            >
              Register new
            </button>
          </div>
        ),
      },
      {
        color: "#6F5FA3",
        content: (isActive) => (
          <div className="flex flex-col items-center gap-1 px-6 py-8 text-center">
            <span className={`text-4xl font-bold transition-colors ${isActive ? "text-white" : "text-[#6F5FA3]"}`}>
              {vets.length}
            </span>
            <span className={`text-sm font-medium transition-colors ${isActive ? "text-white/90" : "text-[#8B7BC0]"}`}>
              Vets available
            </span>
            <button
              onClick={() => navigate("/dashboard/owner/vets")}
              className={`mt-3 text-sm font-medium px-4 py-2 rounded-full transition active:scale-[0.97] ${
                isActive ? "bg-white/20 text-white hover:bg-white/30" : "bg-[#EDE7F7] text-[#6F5FA3] hover:bg-[#E2DAF3]"
              }`}
            >
              Browse vets
            </button>
          </div>
        ),
      },
    ],
  ]

  return (
    <div className="w-screen h-screen overflow-y-auto p-0 -m-8" style={backgroundStyle}>
      <div className="flex flex-col gap-6 max-w-4xl mx-auto p-8">
        
        {/* Header section */}
        <div className={`${glassCard} px-8 py-6`}>
          <h1 className="text-2xl font-semibold text-[#3D3A34]">Welcome back</h1>
          <p className="text-sm text-[#5B4B8A] mt-1">
            Here's what's happening with your pets today
          </p>
        </div>

        {/* Stats Grid */}
        <HighlightGrid rows={statRows} />

        {/* Appointments section */}
        <div className={`${glassCard} px-8 py-6`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs uppercase tracking-wide text-[#5B4B8A] font-semibold">
              Upcoming Appointments
            </h3>
          </div>
          
          <ScrollArea className="h-[400px] w-full">
            <div className="space-y-4 pr-4">
              {upcoming.length === 0 ? (
                <div className="flex h-24 w-full items-center justify-center rounded-xl bg-white/50 text-sm text-[#5B4B8A]">
                  No upcoming appointments. 
                  <button onClick={() => navigate("/dashboard/owner/book")} className="font-semibold underline ml-1">
                    Book one now
                  </button>
                </div>
              ) : (
                upcoming.map((appt) => {
                  const { day, mon, time } = formatApptDate(appt.date)
                  return (
                    <div 
                      key={appt._id} 
                      onClick={() => navigate("/dashboard/owner/appointments")}
                      className="flex min-h-[96px] w-full items-center gap-5 rounded-xl bg-white/50 hover:bg-white/80 transition-colors border border-white/50 p-4 shadow-sm cursor-pointer"
                    >
                      <div className="w-14 h-14 rounded-xl bg-[#5B4B8A] flex flex-col items-center justify-center flex-shrink-0">
                        <span className="text-xl font-bold text-white leading-none">{day}</span>
                        <span className="text-[10px] font-semibold text-white/80 uppercase mt-1">{mon}</span>
                      </div>
                      
                      <div className="flex-1 overflow-hidden flex flex-col justify-center gap-1.5">
                        <div className="flex items-center justify-between">
                          <div className="text-base font-semibold text-[#3D3A34] truncate">
                            Dr. {appt.vet?.name ?? "Unknown vet"}
                          </div>
                          <span className={`text-[10px] font-semibold px-3 py-1.5 rounded-full uppercase tracking-wide flex-shrink-0
                            ${appt.status === "confirmed" ? "bg-green-600 text-white" : "bg-[#E0B84C] text-white"}`}>
                            {appt.status}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-xs text-[#5B4B8A]">
                          <span className="font-semibold bg-white/70 px-2 py-1 rounded text-[#3D3A34]">
                            {time}
                          </span>
                          <span className="opacity-50">•</span>
                          <span className="font-semibold truncate">
                            {appt.pet?.name ?? "Unknown pet"}
                          </span>
                          <span className="opacity-50">•</span>
                          <span className="truncate">
                            {appt.reason ?? "No reason given"}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </ScrollArea>
        </div>

      </div>
    </div>
  )
}

export default OwnerOverview