import rabbitVideo from "../../assets/videos/LoginPageVideo.mp4"
import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../../services/auth";

function RegisterPage() {
  const [phase, setPhase] = useState(1)
  const [role, setRole] = useState("owner");
  const navigate = useNavigate();

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [phone, setPhone] = useState("")
  const [specialization, setSpecialization] = useState("")
  const [licenseNumber, setLicenseNumber] = useState("")
  const [error, setError] = useState("")

  const handleNext = () => {
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill all the fields");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError("");
    setPhase(2);
  }

  const handleRegister = async () => {
    if (role === "vet") {
      if (!phone || !specialization || !licenseNumber) {
        setError("Please fill all the fields");
        return;
      }
      setError("");
    }
    try {
      await registerUser({
        name, email, password, role, ...(role === "vet" && {
          phone, specialization, licenseNumber
        })
      })
      const data = await loginUser({ email, password })
      localStorage.setItem("token", data.token)
      navigate("/dashboard")
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong")
    }
  }

  const handleKeyDownPhase1 = (e) => {
    if (e.key === "Enter") handleNext()
  }

  const handleKeyDownPhase2 = (e) => {
    if (e.key === "Enter") handleRegister()
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">

      { }
      <video
        src={rabbitVideo}
        autoPlay
        loop
        muted
        className="fixed top-0 left-0 w-full h-full object-cover z-0"
      />
      <div className="fixed top-0 left-0 w-full h-full bg-black/40 z-10" />

      <div className="relative z-20 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-10 w-[800px]">

        {phase === 1 && (
          <>
            <h1 className="text-white text-3xl font-bold mb-8">Welcome to Vet Sphere family</h1>

            <input
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDownPhase1}
              className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/50 mb-4 outline-none"
            />

            <input
              placeholder="abc@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDownPhase1}
              className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/50 mb-4 outline-none"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDownPhase1}
              className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/50 mb-6 outline-none"
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyDown={handleKeyDownPhase1}
              className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/50 mb-6 outline-none"
            />

            {error && (
              <p className="text-red-400 text-sm mb-4">{error}</p>
            )}

            <button
              onClick={handleNext}
              className="w-full bg-green-800 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors">
              Next
            </button>

            <p className="text-white/60 text-center mt-6">
              Already have an account? <span onClick={() => navigate("/login")} className="text-white cursor-pointer">Login now</span>
            </p>
          </>
        )}

        {phase === 2 && (
          <>
            <div className="flex gap-3 mb-6">
              <div
                onClick={() => setRole("owner")}
                className={`flex-1 flex flex-col items-center justify-center p-5 rounded-xl border cursor-pointer transition-all ${
                  role === "owner"
                    ? "bg-green-800/60 border-green-500 text-white"
                    : "bg-white/10 border-white/20 text-white/60 hover:bg-white/20"
                }`}
              >
                <span className="text-3xl mb-2">🐾</span>
                <span className="font-semibold">Pet Owner</span>
              </div>

              <div
                onClick={() => setRole("vet")}
                className={`flex-1 flex flex-col items-center justify-center p-5 rounded-xl border cursor-pointer transition-all ${
                  role === "vet"
                    ? "bg-green-800/60 border-green-500 text-white"
                    : "bg-white/10 border-white/20 text-white/60 hover:bg-white/20"
                }`}
              >
                <span className="text-3xl mb-2">🩺</span>
                <span className="font-semibold">Veterinarian</span>
              </div>
            </div>

            {role === "vet" && (
              <>
                <input
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onKeyDown={handleKeyDownPhase2}
                  className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/50 mb-6 outline-none"
                />

                <input
                  placeholder="Specialization"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  onKeyDown={handleKeyDownPhase2}
                  className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/50 mb-6 outline-none"
                />

                <input
                  placeholder="License Number"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  onKeyDown={handleKeyDownPhase2}
                  className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/50 mb-6 outline-none"
                />
              </>
            )}

            {error && (
              <p className="text-red-400 text-sm mb-4">{error}</p>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setPhase(1)
                  setError("");
                }}
                className="w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-3 rounded-lg transition-colors">
                Back
              </button>

              <button
                onClick={handleRegister}
                className="w-full bg-green-800 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors">
                Register
              </button>
            </div>
          </>
        )}

      </div>

    </div>
  )
}

export default RegisterPage