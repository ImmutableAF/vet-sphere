import api from "./api"

const authHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
})

export const getVets = async () => {
  const res = await api.get("/vets", authHeader())
  return res.data
}

export const getMyVetProfile = async () => {
  const res = await api.get("/vets/me", authHeader())
  return res.data
}

export const updateMyVetProfile = async (data) => {
  const res = await api.patch("/vets/me", data, authHeader())
  return res.data
}

export const submitVetVerification = async (formData) => {
  const res = await api.post("/vets/verify", formData, authHeader())
  return res.data
}