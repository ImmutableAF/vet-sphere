import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getAppointments } from "../../services/appointments"
import { getPets } from "../../services/pets"
import { getVets } from "../../services/vets"

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

  const formatDate = (dateStr) => {
    const d = new Date(dateStr)
    return {
      day: d.getDate().toString().padStart(2, "0"),
      mon: d.toLocaleString("default", { month: "short" }),
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-[#9C968A] text-sm">Loading...</div>
    </div>
  )

  if (error) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-red-400 text-sm">{error}</div>
    </div>
  )

  const upcoming = appointments
  .filter(a => (a.status === "pending" || a.status === "confirmed") && new Date(a.date) >= new Date())
  .sort((a, b) => new Date(a.date) - new Date(b.date))
  .slice(0, 3)

  return (
    <div>
      <h2 className="text-2xl font-semibold text-[#3D3A34] mb-1">
        Welcome back
      </h2>
      <p className="text-base text-[#9C968A] mb-8">
        Here's what's happening with your pets today
      </p>

      {/* Stat tiles */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        <button
          onClick={() => navigate("/dashboard/owner")}
          className="bg-[#E7F0E5] rounded-3xl p-6 text-left active:scale-[0.97] transition-transform"
        >
          <div className="text-4xl font-bold text-[#4F7A57]">{appointments.length}</div>
          <div className="text-sm font-medium text-[#6B9072] mt-2">Appointments</div>
        </button>
        <button
          onClick={() => navigate("/dashboard/owner/pets")}
          className="bg-[#FBE9DD] rounded-3xl p-6 text-left active:scale-[0.97] transition-transform"
        >
          <div className="text-4xl font-bold text-[#B5703B]">{pets.length}</div>
          <div className="text-sm font-medium text-[#C68856] mt-2">Pets registered</div>
        </button>
        <button
          onClick={() => navigate("/dashboard/owner/vets")}
          className="bg-[#EDE7F7] rounded-3xl p-6 text-left active:scale-[0.97] transition-transform"
        >
          <div className="text-4xl font-bold text-[#6F5FA3]">{vets.length}</div>
          <div className="text-sm font-medium text-[#8B7BC0] mt-2">Vets available</div>
        </button>
      </div>

      {/* Upcoming appointments */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-[#3D3A34]">Upcoming appointments</h3>
        <button
          onClick={() => navigate("/dashboard/owner/book")}
          className="text-sm font-medium text-[#9A6F4E] hover:underline"
        >
          Book new
        </button>
      </div>

      {upcoming.length === 0 ? (
        <div className="bg-white rounded-2xl px-5 py-8 border border-[#F2EDE2] text-center text-sm text-[#9C968A]">
          No upcoming appointments. <button onClick={() => navigate("/dashboard/owner/book")} className="text-[#9A6F4E] underline">Book one now</button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {upcoming.map((appt) => {
            const { day, mon } = formatDate(appt.date)
            return (
              <div key={appt._id} className="flex items-center gap-4 bg-white rounded-2xl px-5 py-4 border border-[#F2EDE2] hover:border-[#D8CFC0] transition-colors cursor-pointer">
                <div className="w-14 h-14 rounded-2xl bg-[#E7F0E5] flex flex-col items-center justify-center flex-shrink-0">
                  <span className="text-xl font-bold text-[#4F7A57] leading-none">{day}</span>
                  <span className="text-[10px] font-semibold text-[#6B9072] uppercase mt-0.5">{mon}</span>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-[#3D3A34]">{appt.vet?.name ?? "Unknown vet"}</div>
                  <div className="text-xs text-[#9C968A] mt-1">{appt.pet?.name ?? "Unknown pet"} · {appt.reason ?? "No reason given"}</div>
                </div>
                <span className={`text-xs font-semibold px-3 py-1.5 rounded-full
                  ${appt.status === "confirmed" ? "bg-[#E7F0E5] text-[#4F7A57]" : "bg-[#FCEEDB] text-[#B5703B]"}`}>
                  {appt.status}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default OwnerOverview