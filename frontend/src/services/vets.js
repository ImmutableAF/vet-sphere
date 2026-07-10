import axios from "axios"

const authHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
})

export const getVets = async () => {
  const res = await axios.get("/vets", authHeader())
  return res.data
}

export const getMyVetProfile = async () => {
  const res = await axios.get("/vets/me", authHeader())
  return res.data
}

export const updateMyVetProfile = async (data) => {
  const res = await axios.patch("/vets/me", data, authHeader())
  return res.data
}

export const submitVetVerification = async (formData) => {
  const res = await axios.post("/vets/verify", formData, authHeader())
  return res.data
}