import { useEffect, useMemo, useState } from "react"
import { PawPrint, Dna, Cake, Weight, X } from "lucide-react"
import { cn } from "@/lib/utils"
import HighlightGrid from "@/components/ui/HighlightGrid"
import { getPets, deletePet, createPet } from "@/services/pets"

const GRID_PALETTE = [
  "#5B4B8A",
  "#8A6FC7",
  "#E0B84C",
  "#2E9E83",
  "#E2703A",
  "#3B82C4",
  "#B5406B",
  "#4B3F72",
]

const GRID_COLS = 3

function buildPetGrid(pets, palette) {
  const grid = []

  pets.forEach((pet, i) => {
    const row = Math.floor(i / GRID_COLS)
    const col = i % GRID_COLS
    if (!grid[row]) grid[row] = []

    const leftColor = col > 0 ? grid[row][col - 1]?.color : null
    const topColor = row > 0 ? grid[row - 1][col]?.color : null

    const available = palette.filter((c) => c !== leftColor && c !== topColor)
    const pool = available.length ? available : palette
    const color = pool[Math.floor(Math.random() * pool.length)]

    grid[row][col] = { pet, color }
  })

  return grid
}

const glassCard = "backdrop-blur-xl bg-white/40 border border-white/60 shadow-lg rounded-2xl"
const backgroundStyle = { background: "linear-gradient(135deg, #C9B6E4 0%, #E8DFF5 50%, #D8CDEF 100%)" }

function OwnerPets() {
  const [pets, setPets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [showAddModal, setShowAddModal] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    species: "",
    breed: "",
    age: "",
    weight: "",
  })
  const [formError, setFormError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const fetchPets = async () => {
    try {
      const res = await getPets()
      setPets(res)
    } catch {
      setError("Failed to load pets")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let ignore = false

    const loadPets = async () => {
      try {
        const res = await getPets()
        if (!ignore) setPets(res)
      } catch {
        if (!ignore) setError("Failed to load pets")
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadPets()

    return () => {
      ignore = true
    }
  }, [])

  const handleDelete = async (id) => {
    try {
      await deletePet(id)
      setPets((prev) => prev.filter((pet) => pet._id !== id))
    } catch {
      setError("Failed to delete pet")
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError(null)

    if (!formData.name.trim() || !formData.species.trim()) {
      setFormError("Name and species are required")
      return
    }

    setSubmitting(true)
    try {
      await createPet({
        name: formData.name,
        species: formData.species,
        breed: formData.breed || undefined,
        age: formData.age ? Number(formData.age) : undefined,
        weight: formData.weight ? Number(formData.weight) : undefined,
      })

      await fetchPets()

      setShowAddModal(false)
      setFormData({ name: "", species: "", breed: "", age: "", weight: "" })
    } catch {
      setFormError("Failed to add pet. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const getInitials = (name) =>
    name
      ?.trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "?"

  const petGrid = useMemo(
    () => buildPetGrid(pets, GRID_PALETTE),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pets.map((p) => p._id).join(",")]
  )

  const petRows = useMemo(
    () =>
      petGrid.map((row) =>
        row.map(({ pet, color }) => ({
          color,
          content: (isActive) => (
            <div className="w-full h-full p-5 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-11 h-11 shrink-0 rounded-full flex items-center justify-center text-sm font-semibold transition-colors duration-200",
                    isActive ? "bg-white/20 text-white" : "bg-[#EDE7F7] text-[#5B4B8A]"
                  )}
                >
                  {getInitials(pet.name)}
                </div>
                <div className="min-w-0">
                  <h3
                    className={cn(
                      "text-lg font-semibold leading-tight truncate transition-colors duration-200",
                      isActive ? "text-white" : "text-[#3D3A34]"
                    )}
                  >
                    {pet.name}
                  </h3>
                  <p
                    className={cn(
                      "text-xs transition-colors duration-200",
                      isActive ? "text-white/80" : "text-[#8A8578]"
                    )}
                  >
                    {pet.species}
                  </p>
                </div>
              </div>

              <div className="space-y-1.5 flex-1">
                {pet.breed && (
                  <div
                    className={cn(
                      "flex items-center gap-2 text-sm transition-colors duration-200",
                      isActive ? "text-white/90" : "text-[#3D3A34]/80"
                    )}
                  >
                    <Dna size={14} className={isActive ? "text-white" : "text-[#5B4B8A]"} />
                    <span className="truncate">{pet.breed}</span>
                  </div>
                )}
                {pet.age !== undefined && pet.age !== null && (
                  <div
                    className={cn(
                      "flex items-center gap-2 text-sm transition-colors duration-200",
                      isActive ? "text-white/90" : "text-[#3D3A34]/80"
                    )}
                  >
                    <Cake size={14} className={isActive ? "text-white" : "text-[#5B4B8A]"} />
                    <span>{pet.age} yrs old</span>
                  </div>
                )}
                {pet.weight !== undefined && pet.weight !== null && (
                  <div
                    className={cn(
                      "flex items-center gap-2 text-sm transition-colors duration-200",
                      isActive ? "text-white/90" : "text-[#3D3A34]/80"
                    )}
                  >
                    <Weight size={14} className={isActive ? "text-white" : "text-[#5B4B8A]"} />
                    <span>{pet.weight} kg</span>
                  </div>
                )}
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleDelete(pet._id)
                }}
                className="w-full px-5 py-2 rounded-full bg-red-900 text-white text-xs font-medium hover:bg-red-950 transition-colors"
              >
                Remove
              </button>
            </div>
          ),
        }))
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [petGrid]
  )

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center" style={backgroundStyle}>
        <p className="text-[#3D3A34]">Loading pets...</p>
      </div>
    )
  }

  return (
    <div className="w-screen h-screen overflow-y-auto -m-8" style={backgroundStyle}>
      <div className="flex flex-col gap-6 max-w-5xl mx-auto p-8">

        {error && (
          <div className={`px-4 py-2 text-red-800 text-sm ${glassCard}`}>
            {error}
          </div>
        )}

        <div className={`${glassCard} px-8 py-6 flex justify-between items-center`}>
          <h1 className="text-2xl font-semibold text-[#3D3A34]">My Pets</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2.5 rounded-full bg-[#8A6FC7] text-white text-sm font-medium"
          >
            + Add a pet
          </button>
        </div>

        {pets.length === 0 ? (
          <div className={`${glassCard} px-8 py-6`}>
            <p className="text-[#3D3A34]/70 text-sm">
              No pets yet. Add your first pet to get started.
            </p>
          </div>
        ) : (
          <HighlightGrid rows={petRows} colors={GRID_PALETTE} className="sm:flex-col" />
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 px-4">
          <div className={`${glassCard} p-6 w-full max-w-md relative`}>
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-5 right-5 text-[#5B4B8A] hover:text-[#3D3A34]"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2 mb-5">
              <PawPrint size={20} className="text-[#8A6FC7]" />
              <h2 className="text-xl font-semibold text-[#3D3A34]">Add a Pet</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                className="w-full px-4 py-2.5 rounded-full border border-white/60 bg-white/50 text-sm text-[#3D3A34] outline-none"
              />
              <input
                name="species"
                value={formData.species}
                onChange={handleChange}
                placeholder="Species (e.g. Dog, Cat)"
                className="w-full px-4 py-2.5 rounded-full border border-white/60 bg-white/50 text-sm text-[#3D3A34] outline-none"
              />
              <input
                name="breed"
                value={formData.breed}
                onChange={handleChange}
                placeholder="Breed (optional)"
                className="w-full px-4 py-2.5 rounded-full border border-white/60 bg-white/50 text-sm text-[#3D3A34] outline-none"
              />
              <input
                name="age"
                type="number"
                value={formData.age}
                onChange={handleChange}
                placeholder="Age (optional)"
                className="w-full px-4 py-2.5 rounded-full border border-white/60 bg-white/50 text-sm text-[#3D3A34] outline-none"
              />
              <input
                name="weight"
                type="number"
                value={formData.weight}
                onChange={handleChange}
                placeholder="Weight in kg (optional)"
                className="w-full px-4 py-2.5 rounded-full border border-white/60 bg-white/50 text-sm text-[#3D3A34] outline-none"
              />

              {formError && <p className="text-red-800 text-sm">{formError}</p>}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className={`flex-1 px-5 py-2.5 text-sm font-medium text-[#3D3A34] ${glassCard}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-5 py-2.5 rounded-full bg-[#8A6FC7] text-white text-sm font-medium disabled:opacity-50"
                >
                  {submitting ? "Adding..." : "Add Pet"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default OwnerPets