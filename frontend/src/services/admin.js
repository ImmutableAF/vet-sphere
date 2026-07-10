import axios from "axios"

const authHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
})

export const getAllVets = async () => {
  const res = await axios.get("/admin/vets", authHeader())
  return res.data
}

export const updateVetVerification = async (id, data) => {
  const res = await axios.put(`/admin/vets/${id}/verify`, data, authHeader())
  return res.data
}