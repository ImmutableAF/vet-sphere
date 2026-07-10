import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getPets } from "../../services/pets"
import { getVets } from "../../services/vets"
import { createAppointment, getAvailability } from "../../services/appointments"

function OwnerBook() {
  const navigate = useNavigate()
  const [pets, setPets] = useState([])
  const [vets, setVets] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [slots, setSlots] = useState([])

  const [form, setForm] = useState({
    pet: "",
    vet: "",
    date: "",
    time: "",
    reason: "",
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [petsData, vetsData] = await Promise.all([getPets(), getVets()])
        setPets(petsData)
        setVets(vetsData)
        setForm(prev => ({
          ...prev,
          pet: petsData[0]?._id ?? "",
          vet: vetsData[0]?._id ?? "",
        }))
      } catch {
        setError("Failed to load booking data")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    const fetchAvailability = async () => {
      if (!form.vet || !form.date) {
        setSlots([])
        return
      }
      try {
        const data = await getAvailability(form.vet, form.date)
        setSlots(data.slots || [])
      } catch {
        setSlots([])
      }
    }
    fetchAvailability()
  }, [form.vet, form.date])

  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }))
  }

  const handleSubmit = async () => {
    if (!form.pet || !form.vet || !form.date || !form.time) {
      setError("Please fill in all required fields")
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const combinedDate = new Date(`${form.date}T${form.time}:00`)
      await createAppointment({
        pet: form.pet,
        vet: form.vet,
        date: combinedDate.toISOString(),
        reason: form.reason,
      })
      setSuccess(true)
      setTimeout(() => navigate("/dashboard/owner"), 1500)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to book appointment. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-[#9C968A] text-sm">Loading...</div>
    </div>
  )

  if (success) return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <div className="text-5xl">✅</div>
      <div className="text-lg font-semibold text-[#4F7A57]">Appointment requested!</div>
      <div className="text-sm text-[#9C968A]">Redirecting to overview...</div>
    </div>
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-[#3D3A34]">Book an appointment</h2>
        <button
          onClick={() => navigate("/dashboard/owner")}
          className="text-sm font-medium text-[#9A6F4E] hover:underline"
        >
          Back to overview
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-[#E7F0E5] rounded-3xl p-6">
          <div className="text-4xl font-bold text-[#4F7A57]">{vets.length}</div>
          <div className="text-sm font-medium text-[#6B9072] mt-2">Vets available</div>
        </div>
        <div className="bg-[#FBE9DD] rounded-3xl p-6">
          <div className="text-4xl font-bold text-[#B5703B]">{pets.length}</div>
          <div className="text-sm font-medium text-[#C68856] mt-2">Your pets</div>
        </div>
        <div className="bg-[#EDE7F7] rounded-3xl p-6">
          <div className="text-4xl font-bold text-[#6F5FA3]">Free</div>
          <div className="text-sm font-medium text-[#8B7BC0] mt-2">Cancellation</div>
        </div>
      </div>

      <div className="bg-white border border-[#F2EDE2] rounded-3xl p-6">
        {error && (
          <div className="mb-4 text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-5 mb-5">
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-wide text-[#9C968A] font-semibold">Your pet</label>
            <select
              value={form.pet}
              onChange={handleChange("pet")}
              className="bg-[#FBF8F3] border border-[#EBE4D6] rounded-xl px-4 py-3 text-sm text-[#3D3A34] outline-none"
            >
              {pets.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-wide text-[#9C968A] font-semibold">Veterinarian</label>
            <select
              value={form.vet}
              onChange={handleChange("vet")}
              className="bg-[#FBF8F3] border border-[#EBE4D6] rounded-xl px-4 py-3 text-sm text-[#3D3A34] outline-none"
            >
              {vets.map(v => <option key={v._id} value={v._id}>{v.name}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-wide text-[#9C968A] font-semibold">Date</label>
            <input
              type="date"
              value={form.date}
              onChange={handleChange("date")}
              min={new Date().toISOString().split("T")[0]}
              className="bg-[#FBF8F3] border border-[#EBE4D6] rounded-xl px-4 py-3 text-sm text-[#3D3A34] outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-wide text-[#9C968A] font-semibold">Time</label>
            <select
              value={form.time}
              onChange={handleChange("time")}
              disabled={!form.date}
              className="bg-[#FBF8F3] border border-[#EBE4D6] rounded-xl px-4 py-3 text-sm text-[#3D3A34] outline-none disabled:opacity-50"
            >
              <option value="">Select a time</option>
              {slots.map((slot) => (
                <option key={slot.time} value={slot.time} disabled={!slot.available}>
                  {slot.time} {!slot.available ? "(booked)" : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2 col-span-2">
            <label className="text-xs uppercase tracking-wide text-[#9C968A] font-semibold">Reason for visit</label>
            <input
              type="text"
              value={form.reason}
              onChange={handleChange("reason")}
              placeholder="e.g. Annual checkup"
              className="bg-[#FBF8F3] border border-[#EBE4D6] rounded-xl px-4 py-3 text-sm text-[#3D3A34] outline-none placeholder-[#C4BCB0]"
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full bg-[#7FA88A] hover:bg-[#6E9778] disabled:opacity-60 text-white text-base font-semibold py-4 rounded-xl transition-colors"
        >
          {submitting ? "Booking..." : "Request appointment"}
        </button>
      </div>
    </div>
  )
}

export default OwnerBook