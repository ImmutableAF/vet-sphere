// src/pages/dashboards/OwnerBook.jsx
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

  const glassCard = "backdrop-blur-xl bg-white/40 border border-white/60 shadow-lg rounded-2xl"
  const backgroundStyle = { background: "linear-gradient(135deg, #C9B6E4 0%, #E8DFF5 50%, #D8CDEF 100%)" }
  const inputStyle = "bg-white/50 border border-white/60 rounded-xl px-4 py-3 text-sm text-[#3D3A34] outline-none focus:bg-white/70 transition-colors"

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

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center p-0 -m-8" style={backgroundStyle}>
        <p className="text-[#3D3A34]">Loading...</p>
      </div>
    )
  }

  if (success) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center gap-4 p-0 -m-8" style={backgroundStyle}>
        <div className="text-5xl">✅</div>
        <div className="text-lg font-semibold text-[#3D3A34]">Appointment requested!</div>
        <div className="text-sm text-[#5B4B8A]">Redirecting to overview...</div>
      </div>
    )
  }

  return (
    <div className="w-screen h-screen overflow-y-auto p-0 -m-8" style={backgroundStyle}>
      <div className="flex flex-col gap-6 max-w-4xl mx-auto p-8">

        {/* Header section */}
        <div className={`${glassCard} px-8 py-6 flex items-center justify-between`}>
          <h1 className="text-2xl font-semibold text-[#3D3A34]">Book an appointment</h1>
          <button
            onClick={() => navigate("/dashboard/owner")}
            className="text-sm font-medium px-4 py-2 rounded-full bg-white/50 text-[#5B4B8A] hover:bg-white/70 transition-colors whitespace-nowrap"
          >
            Back to overview
          </button>
        </div>

        {/* Booking form */}
        <div className={`${glassCard} px-8 py-6`}>
          {error && (
            <div className="mb-4 text-sm text-red-800 bg-red-100/70 border border-red-200/60 rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-5 mb-5">
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-wide text-[#5B4B8A] font-semibold">Your pet</label>
              <select
                value={form.pet}
                onChange={handleChange("pet")}
                className={inputStyle}
              >
                {pets.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-wide text-[#5B4B8A] font-semibold">Veterinarian</label>
              <select
                value={form.vet}
                onChange={handleChange("vet")}
                className={inputStyle}
              >
                {vets.map(v => <option key={v._id} value={v._id}>{v.name}</option>)}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-wide text-[#5B4B8A] font-semibold">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={handleChange("date")}
                min={new Date().toISOString().split("T")[0]}
                className={inputStyle}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-wide text-[#5B4B8A] font-semibold">Time</label>
              <select
                value={form.time}
                onChange={handleChange("time")}
                disabled={!form.date}
                className={`${inputStyle} disabled:opacity-50`}
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
              <label className="text-xs uppercase tracking-wide text-[#5B4B8A] font-semibold">Reason for visit</label>
              <input
                type="text"
                value={form.reason}
                onChange={handleChange("reason")}
                placeholder="e.g. Annual checkup"
                className={`${inputStyle} placeholder-[#8B7BC0]`}
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full bg-[#8A6FC7] hover:bg-[#7A5DB8] disabled:opacity-60 text-white text-base font-semibold py-4 rounded-xl transition-colors"
          >
            {submitting ? "Booking..." : "Request appointment"}
          </button>
        </div>

      </div>
    </div>
  )
}

export default OwnerBook