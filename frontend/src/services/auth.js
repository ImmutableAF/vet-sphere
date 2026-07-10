import axios from "axios";

const api = axios.create({
    baseURL: "/"
})

const authHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
})

export const registerUser = async (data) => {
    const res = await api.post("/auth/register", data);
    return res.data;
}

export const loginUser = async (data) => {
    const res = await api.post("/auth/login", data);
    return res.data;
}

export const requestAccountDeletion = async (password) => {
    const res = await api.delete("/auth/delete-account", {
      ...authHeader(),
      data: { password },
    });
    return res.data;
}