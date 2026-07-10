import { useEffect, useState } from "react"
import { getPets, deletePet, createPet } from "@/services/pets"

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

  if (loading) return <p className="text-[#9C968A] text-sm">Loading pets...</p>
  if (error) return <p className="text-red-500 text-sm">{error}</p>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#3D3A34]">My Pets</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[#7FA88A] hover:bg-[#6E9778] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
        >
          + Add a pet
        </button>
      </div>

      {pets.length === 0 ? (
        <p className="text-[#9C968A] text-sm">
          No pets yet. Add your first pet to get started.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pets.map((pet) => (
            <div
              key={pet._id}
              className="bg-white rounded-2xl px-5 py-4 border border-[#F2EDE2] hover:border-[#D8CFC0] transition-colors"
            >
              <h3 className="text-lg font-semibold text-[#3D3A34]">{pet.name}</h3>
              <p className="text-sm text-[#9C968A]">
                {pet.species}
                {pet.breed ? ` · ${pet.breed}` : ""}
              </p>
              {pet.age !== undefined && pet.age !== null && (
                <p className="text-sm text-[#9C968A]">Age: {pet.age}</p>
              )}
              {pet.weight !== undefined && pet.weight !== null && (
                <p className="text-sm text-[#9C968A]">Weight: {pet.weight} kg</p>
              )}
              <button
                onClick={() => handleDelete(pet._id)}
                className="mt-3 text-xs font-semibold text-[#C0392B] hover:underline"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-[#3D3A34] mb-4">Add a Pet</h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                className="w-full bg-[#FBF8F3] border border-[#EBE4D6] rounded-xl px-4 py-3 text-sm text-[#3D3A34] outline-none"
              />
              <input
                name="species"
                value={formData.species}
                onChange={handleChange}
                placeholder="Species (e.g. Dog, Cat)"
                className="w-full bg-[#FBF8F3] border border-[#EBE4D6] rounded-xl px-4 py-3 text-sm text-[#3D3A34] outline-none"
              />
              <input
                name="breed"
                value={formData.breed}
                onChange={handleChange}
                placeholder="Breed (optional)"
                className="w-full bg-[#FBF8F3] border border-[#EBE4D6] rounded-xl px-4 py-3 text-sm text-[#3D3A34] outline-none"
              />
              <input
                name="age"
                type="number"
                value={formData.age}
                onChange={handleChange}
                placeholder="Age (optional)"
                className="w-full bg-[#FBF8F3] border border-[#EBE4D6] rounded-xl px-4 py-3 text-sm text-[#3D3A34] outline-none"
              />
              <input
                name="weight"
                type="number"
                value={formData.weight}
                onChange={handleChange}
                placeholder="Weight in kg (optional)"
                className="w-full bg-[#FBF8F3] border border-[#EBE4D6] rounded-xl px-4 py-3 text-sm text-[#3D3A34] outline-none"
              />

              {formError && <p className="text-red-500 text-sm">{formError}</p>}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-[#FBF8F3] border border-[#EBE4D6] text-[#3D3A34] text-sm font-semibold py-3 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-[#7FA88A] hover:bg-[#6E9778] text-white text-sm font-semibold py-3 rounded-xl disabled:opacity-60"
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