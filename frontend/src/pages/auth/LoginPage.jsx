import rabbitVideo from "../../assets/videos/LoginPageVideo.mp4"
import { useNavigate } from "react-router-dom"
import { useState } from "react";
import { loginUser } from "../../services/auth";

function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }
    setError("")
    try {
      const data = await loginUser({ email, password })
      localStorage.setItem("token", data.token)
      navigate("/dashboard")
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong")
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin()
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      
      {}
      <video
        src={rabbitVideo}
        autoPlay
        loop
        muted
        className="fixed top-0 left-0 w-full h-full object-cover z-0"
      />
      <div className="fixed top-0 left-0 w-full h-full bg-black/40 z-10" />

      <div className="relative z-20 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-10 w-[800px]">
        
        <h1 className="text-white text-3xl font-bold mb-8">Welcome Back</h1>

        <input 
          placeholder="abc@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/50 mb-4 outline-none" 
        />

        <input 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/50 mb-6 outline-none" 
        />
        
        {error && (
          <p className="text-red-400 text-sm mb-4">{error}</p>
        )}

        <button 
          onClick={handleLogin}
          className="w-full bg-green-800 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors">
          Login
        </button>

        <p className="text-white/60 text-center mt-6">
          Don't have an account? <span onClick={() => navigate("/register")} className="text-white cursor-pointer">Register now</span>
        </p>

      </div>

    </div>
  )
}

export default LoginPage