import api from "./api"

const authHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
})

export const getAppointments = async () => {
  const res = await api.get("/appointments", authHeader())
  return res.data
}

export const createAppointment = async (data) => {
  const res = await api.post("/appointments", data, authHeader())
  return res.data
}

export const getAvailability = async (vet, date) => {
  const res = await api.get("/appointments/availability", {
    params: { vet, date },
    headers: authHeader().headers,
  })
  return res.data
}

export const updateAppointmentStatus = async (id, status) => {
  const res = await api.put(`/appointments/${id}/status`, { status }, authHeader())
  return res.data
}