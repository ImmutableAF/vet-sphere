// src/pages/dashboards/OwnerVets.jsx
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getVets } from "../../services/vets"

function OwnerVets() {
  const navigate = useNavigate()
  const [vets, setVets] = useState([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const vetColors = [
    { bg: "#E7F0E5", color: "#4F7A57" },
    { bg: "#EDE7F7", color: "#6F5FA3" },
    { bg: "#FBE9DD", color: "#B5703B" },
  ]

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

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-[#9C968A] text-sm">Loading vets...</div>
    </div>
  )

  if (error) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-red-400 text-sm">{error}</div>
    </div>
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-[#3D3A34]">Find a vet</h2>
        <button
          onClick={() => navigate("/dashboard/owner")}
          className="text-sm font-medium text-[#9A6F4E] hover:underline"
        >
          Back to overview
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-[#EDE7F7] rounded-3xl p-6">
          <div className="text-4xl font-bold text-[#6F5FA3]">{vets.length}</div>
          <div className="text-sm font-medium text-[#8B7BC0] mt-2">Vets available</div>
        </div>
        <div className="bg-[#E7F0E5] rounded-3xl p-6">
          <div className="text-4xl font-bold text-[#4F7A57]">{filtered.length}</div>
          <div className="text-sm font-medium text-[#6B9072] mt-2">Matching search</div>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3 bg-white border border-[#EBE4D6] rounded-2xl px-5 py-3.5 mb-6">
        <span className="text-[#9C968A] text-lg">🔍</span>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or specialization..."
          className="bg-transparent outline-none text-sm text-[#3D3A34] flex-1 placeholder-[#C4BCB0]"
        />
      </div>

      {/* Vet cards */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl px-5 py-10 border border-[#F2EDE2] text-center text-sm text-[#9C968A]">
          No vets found matching "{search}"
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((vet, i) => {
            const { bg, color } = vetColors[i % vetColors.length]
            return (
              <div key={vet._id} className="flex items-center gap-4 bg-white rounded-2xl px-5 py-4 border border-[#F2EDE2] hover:border-[#D8CFC0] transition-colors cursor-pointer">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-base font-semibold flex-shrink-0"
                  style={{ background: bg, color }}
                >
                  {getInitials(vet.name)}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-[#3D3A34]">{vet.name}</div>
                  <div className="text-xs text-[#9C968A] mt-1">{vet.specialization}</div>
                </div>
                <button
                  onClick={() => navigate("/dashboard/owner/book")}
                  className="text-sm font-semibold px-5 py-2 rounded-full bg-[#E7F0E5] text-[#4F7A57] hover:bg-[#D6E8D4] transition-colors whitespace-nowrap"
                >
                  Book
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default OwnerVets