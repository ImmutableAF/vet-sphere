import { useState } from "react"
import { AuthContext } from "./AuthContext"

function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(() => {
        const token = localStorage.getItem("token")
        if (!token) return null
        try{
            const payload = token.split(".")[1]
            const decoded = JSON.parse(atob(payload))
            if(decoded.exp * 1000 < Date.now()){
                localStorage.removeItem("token")
                return null
            }
            return decoded
        }
        catch{
            localStorage.removeItem("token")
            return null
        }
    })

    const handleLogout = () =>  {
        localStorage.removeItem("token")
        setCurrentUser(null)
    }

    return (
        <AuthContext.Provider value={{ currentUser, setCurrentUser, handleLogout }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider