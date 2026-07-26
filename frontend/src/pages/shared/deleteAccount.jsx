import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { requestAccountDeletion } from "../../services/auth"
import { AuthContext } from "../../context/AuthContext"

function DeleteAccountPage() {
  const [password, setPassword] = useState("")
  const [confirmChecked, setConfirmChecked] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  const { handleLogout } = useContext(AuthContext)
  const navigate = useNavigate()

  const glassCard = "backdrop-blur-xl bg-white/40 border border-white/60 shadow-lg rounded-2xl"
  const backgroundStyle = { background: "linear-gradient(135deg, #C9B6E4 0%, #E8DFF5 50%, #D8CDEF 100%)" }
  const inputStyle = "bg-white/50 border border-white/60 rounded-xl px-4 py-3 text-sm text-[#3D3A34] outline-none focus:bg-white/70 transition-colors"

  const handleDelete = async () => {
    setError("")
    if (!password) {
      setError("Please enter your password to confirm.")
      return
    }
    if (!confirmChecked) {
      setError("Please check the box to confirm you understand this action.")
      return
    }

    try {
      setLoading(true)
      const data = await requestAccountDeletion(password)
      setSuccess(data.message)
      setTimeout(() => {
        handleLogout()
        navigate("/")
      }, 3000)
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-screen h-screen overflow-y-auto p-0 -m-8" style={backgroundStyle}>
      <div className="flex flex-col gap-6 max-w-2xl mx-auto p-8">

        {/* Header section */}
        <div className={`${glassCard} px-8 py-6`}>
          <h1 className="text-2xl font-semibold text-[#3D3A34]">Delete account</h1>
        </div>

        {/* Warning section */}
        <div className={`${glassCard} border-red-300/50 px-8 py-6`}>
          <p className="text-red-900 font-semibold text-base mb-3">
            This action cannot be undone.
          </p>
          <ul className="text-red-800 text-sm leading-relaxed list-disc pl-5 space-y-2">
            <li>Your account will be deactivated immediately.</li>
            <li>If you log back in within 7 days, your account will be automatically restored — nothing will be lost.</li>
            <li>If 7 days pass without logging in, your account and all associated data will be permanently and irreversibly deleted.</li>
          </ul>
        </div>

        {success ? (
          <div className={`${glassCard} border-green-300/50 px-8 py-6`}>
            <p className="text-green-900 text-base leading-relaxed">
              {success} You'll be logged out now.
            </p>
          </div>
        ) : (
          <div className={`${glassCard} px-8 py-6`}>
            <label className="block text-sm font-semibold text-[#3D3A34] mb-2">
              Enter your password to confirm
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className={`w-full ${inputStyle} mb-5`}
            />

            <label className="flex items-start gap-3 mb-5 text-sm text-[#3D3A34] leading-relaxed">
              <input
                type="checkbox"
                checked={confirmChecked}
                onChange={(e) => setConfirmChecked(e.target.checked)}
                className="mt-1 flex-shrink-0"
              />
              I understand my account will be deactivated now, and permanently deleted if I don't log back in within 7 days.
            </label>

            {error && (
              <div className="mb-5 text-sm text-red-800 bg-red-100/70 border border-red-200/60 rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            <button
              onClick={handleDelete}
              disabled={loading || !confirmChecked}
              className="w-full bg-red-900 hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed text-white text-base font-semibold py-4 rounded-xl transition-colors"
            >
              {loading ? "Processing..." : "Permanently delete my account"}
            </button>
          </div>
        )}

      </div>
    </div>
  )
}

export default DeleteAccountPage