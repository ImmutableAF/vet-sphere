// src/pages/dashboards/OwnerVets.jsx
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getVets } from "../../services/vets"
import { ScrollArea } from "@/components/ui/scroll-area"

function OwnerVets() {
  const navigate = useNavigate()
  const [vets, setVets] = useState([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const glassCard = "backdrop-blur-xl bg-white/40 border border-white/60 shadow-lg rounded-2xl"
  const backgroundStyle = { background: "linear-gradient(135deg, #C9B6E4 0%, #E8DFF5 50%, #D8CDEF 100%)" }

  useEffect(() => {
    const fetchVets = async () => {
      try {
        const data = await getVets()
        setVets(data)
      } catch (err) {
        setError("Failed to load vets")
      } finally {
        setLoading(false)
      }
    }
    fetchVets()
  }, [])

  const filtered = vets.filter(v =>
    v.name?.toLowerCase().includes(search.toLowerCase()) ||
    v.specialization?.toLowerCase().includes(search.toLowerCase())
  )

  const getInitials = (name) => name?.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() ?? "VT"

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center p-0 -m-8" style={backgroundStyle}>
        <p className="text-[#3D3A34]">Loading vets...</p>
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
          <h1 className="text-2xl font-semibold text-[#3D3A34]">Find a vet</h1>
          <button
            onClick={() => navigate("/dashboard/owner")}
            className="text-sm font-medium px-4 py-2 rounded-full bg-white/50 text-[#5B4B8A] hover:bg-white/70 transition-colors whitespace-nowrap"
          >
            Back to overview
          </button>
        </div>

        {/* Search */}
        <div className={`${glassCard} flex items-center gap-3 px-5 py-3.5`}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or specialization..."
            className="bg-transparent outline-none text-sm text-[#3D3A34] flex-1 placeholder-[#8B7BC0]"
          />
        </div>

        {/* Vet list */}
        <div className={`${glassCard} px-8 py-6`}>
          <ScrollArea className="h-[500px] w-full">
            <div className="space-y-4 pr-4">
              {filtered.length === 0 ? (
                <div className="flex h-24 w-full items-center justify-center rounded-xl bg-white/50 text-sm text-[#5B4B8A]">
                  No vets found matching "{search}"
                </div>
              ) : (
                filtered.map((vet) => (
                  <div
                    key={vet._id}
                    className="flex min-h-[112px] w-full items-center gap-5 rounded-xl bg-white/50 hover:bg-white/80 transition-colors border border-white/50 p-4 shadow-sm cursor-pointer"
                  >
                    <div className="w-14 h-14 rounded-xl bg-[#5B4B8A] flex items-center justify-center flex-shrink-0">
                      <span className="text-base font-semibold text-white">
                        {getInitials(vet.name)}
                      </span>
                    </div>

                    <div className="flex-1 overflow-hidden flex flex-col justify-center gap-1">
                      <div className="text-base font-semibold text-[#3D3A34] truncate">
                        {vet.name}
                      </div>
                      <div className="text-xs text-[#5B4B8A] truncate">
                        {vet.specialization}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#5B4B8A]">
                        <span className="font-semibold bg-white/70 px-2 py-1 rounded text-[#3D3A34]">
                          {vet.experienceYears != null ? `${vet.experienceYears} yrs experience` : "Experience not listed"}
                        </span>
                        <span className="opacity-50">•</span>
                        <span className="truncate">
                          {vet.city ?? "Location not listed"}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate("/dashboard/owner/book")}
                      className="text-sm font-semibold px-5 py-2 rounded-full bg-[#8A6FC7] text-white hover:bg-[#7A5DB8] transition-colors whitespace-nowrap flex-shrink-0"
                    >
                      Book
                    </button>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>

      </div>
    </div>
  )
}

export default OwnerVets