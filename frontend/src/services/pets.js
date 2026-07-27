import api from "./api"

const authHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
})

export const getPets = async () => {
  const res = await api.get("/pets", authHeader())
  return res.data
}

export const createPet = async (data) => {
  const res = await api.post("/pets", data, authHeader())
  return res.data
}

export const deletePet = async (id) => {
  const res = await api.delete(`/pets/${id}`, authHeader())
  return res.data
}