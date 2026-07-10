import axios from "axios"

const authHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
})

export const getPets = async () => {
  const res = await axios.get("/pets", authHeader())
  return res.data
}

export const createPet = async (data) => {
  const res = await axios.post("/pets", data, authHeader())
  return res.data
}

export const deletePet = async (id) => {
  const res = await axios.delete(`/pets/${id}`, authHeader())
  return res.data
}