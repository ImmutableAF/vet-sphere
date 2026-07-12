import rabbitVideo from "../../assets/videos/LoginPageVideo.mp4"
import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../../services/auth";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";

import { validateName, validateConfirmPassword, validateEmail, validateLicense, validatePassword, validatePhone, validateSpecialization } from "@/utils/validations";

function RegisterPage() {
  const [phase, setPhase] = useState(1)
  const [role, setRole] = useState("owner");
  const navigate = useNavigate();

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [phone, setPhone] = useState("")
  const [specialization, setSpecialization] = useState("")
  const [licenseNumber, setLicenseNumber] = useState("")
  const [error, setError] = useState("")

  const [touched, setTouched] = useState({})
  const [errors, setErrors] = useState({})

  const { setCurrentUser } = useContext(AuthContext)

  const handleNext = () => {
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill all the fields");
      return;
    }
    const hasErrors =
      !validateName(name).valid ||
      !validateEmail(email).valid ||
      !validatePassword(password).valid ||
      !validateConfirmPassword(confirmPassword, password).valid

    if (hasErrors) {
      setTouched({ name: true, email: true, password: true, confirmPassword: true })
      return
    }
    setError("");
    setPhase(2);
  }

const handleRegister = async () => {
  if (role === "vet") {
    if (!phone || !specialization || !licenseNumber) {
      setError("Please fill all the fields")
      return
    }
    const hasVetErrors =
      !validatePhone(phone).valid ||
      !validateSpecialization(specialization).valid ||
      !validateLicense(licenseNumber).valid

    if (hasVetErrors) {
      setTouched({ phone: true, specialization: true, licenseNumber: true })
      return
    }
    setError("")
  }
  try {
    await registerUser({
      name, email, password, role, ...(role === "vet" && {
        phone, specialization, licenseNumber
      })
    })
    const data = await loginUser({ email, password })
    localStorage.setItem("token", data.token)
    setCurrentUser(data.user)
    navigate(`/dashboard/${data.user.role}`)
} catch (error) {
    console.log(error)
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
              onChange={(e) => {
                setName(e.target.value)
                const result = validateName(e.target.value)
                setErrors(prev => ({
                  ...prev, name: result.message
                }))
              }}
              onBlur={() => setTouched(prev => ({
                ...prev, name: true
              }))}
              onKeyDown={handleKeyDownPhase1}
              className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/50 mb-4 outline-none"
            />
            {touched.name && errors.name && (
              <p className="text-red-400 text-sm mt-1 mb-3">{errors.name}</p>
            )}

            <input
              placeholder="abc@gmail.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                const result = validateEmail(e.target.value)
                setErrors(prev => ({
                  ...prev, email: result.message
                }))
              }}
              onBlur={() => setTouched(prev => ({
                ...prev, email: true
              }))}
              onKeyDown={handleKeyDownPhase1}
              className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/50 mb-4 outline-none"
            />
            {touched.email && errors.email && (
              <p className="text-red-400 text-sm mt-1 mb-3">{errors.email}</p>
            )}

            <div className="relative mb-1">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  const result = validatePassword(e.target.value)
                  setErrors(prev => ({
                    ...prev, password: result.message
                  }))
                }}
                onBlur={() => setTouched(prev => ({
                  ...prev, password: true
                }))}
                onKeyDown={handleKeyDownPhase1}
                className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-3 pr-16 text-white placeholder-white/50 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-sm"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <div className="mb-5">
              {touched.password && errors.password && (
                <p className="text-red-400 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <div className="relative mb-1">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value)
                  const result = validateConfirmPassword(e.target.value, password)
                  setErrors(prev => ({
                    ...prev, confirmPassword: result.message
                  }))
                }}
                onBlur={() => setTouched(prev => ({
                  ...prev, confirmPassword: true
                }))}
                onKeyDown={handleKeyDownPhase1}
                className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-3 pr-16 text-white placeholder-white/50 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-sm"
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
            <div className="mb-5">
              {touched.confirmPassword && errors.confirmPassword && (
                <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            {error && (
              <p className="text-red-400 text-sm mb-4">{error}</p>
            )}

            <button
              onClick={handleNext}
              className="w-full bg-green-800 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors">
              Next
            </button>

            <p className="text-white/60 text-center mt-6">
              Already have an account? <span onClick={() => navigate("/")} className="text-white cursor-pointer">Login now</span>
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
                  onChange={(e) => {
                    setPhone(e.target.value)
                    const result = validatePhone(e.target.value)
                    setErrors(prev => ({ ...prev, phone: result.message }))
                  }}
                  onBlur={() => setTouched(prev => ({ ...prev, phone: true }))}
                  onKeyDown={handleKeyDownPhase2}
                  className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/50 mb-6 outline-none"
                />
                {touched.phone && errors.phone && (
                  <p className="text-red-400 text-sm mt-1 mb-3">{errors.phone}</p>
                )}

                <input
                  placeholder="Specialization"
                  value={specialization}
                  onChange={(e) => {
                    setSpecialization(e.target.value)
                    const result = validateSpecialization(e.target.value)
                    setErrors(prev => ({ ...prev, specialization: result.message }))
                  }}
                  onBlur={() => setTouched(prev => ({ ...prev, specialization: true }))}
                  onKeyDown={handleKeyDownPhase2}
                  className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/50 mb-6 outline-none"
                />
                {touched.specialization && errors.specialization && (
                  <p className="text-red-400 text-sm mt-1 mb-3">{errors.specialization}</p>
                )}

                <input
                  placeholder="License Number"
                  value={licenseNumber}
                  onChange={(e) => {
                    setLicenseNumber(e.target.value)
                    const result = validateLicense(e.target.value)
                    setErrors(prev => ({ ...prev, licenseNumber: result.message }))
                  }}
                  onBlur={() => setTouched(prev => ({ ...prev, licenseNumber: true }))}
                  onKeyDown={handleKeyDownPhase2}
                  className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/50 mb-6 outline-none"
                />
                {touched.licenseNumber && errors.licenseNumber && (
                  <p className="text-red-400 text-sm mt-1 mb-3">{errors.licenseNumber}</p>
                )}
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