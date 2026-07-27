import api from "./api"

const authHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
})

export const getAllVets = async () => {
  const res = await api.get("/admin/vets", authHeader())
  return res.data
}

export const updateVetVerification = async (id, data) => {
  const res = await api.put(`/admin/vets/${id}/verify`, data, authHeader())
  return res.data
}