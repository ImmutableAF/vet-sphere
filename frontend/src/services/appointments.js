import axios from "axios"

const authHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
})

export const getAppointments = async () => {
  const res = await axios.get("/appointments", authHeader())
  return res.data
}

export const createAppointment = async (data) => {
  const res = await axios.post("/appointments", data, authHeader())
  return res.data
}

export const getAvailability = async (vet, date) => {
  const res = await axios.get("/appointments/availability", {
    params: { vet, date },
    headers: authHeader().headers,
  })
  return res.data
}

export const updateAppointmentStatus = async (id, status) => {
  const res = await axios.put(`/appointments/${id}/status`, { status }, authHeader())
  return res.data
}