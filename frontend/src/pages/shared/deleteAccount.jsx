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
    <div className="max-w-lg">
      <h1 className="text-2xl font-semibold text-[#3D3A34] mb-6">Delete Account</h1>

      <div className="bg-red-50 border border-red-200 rounded-2xl p-5 mb-6">
        <p className="text-red-800 font-semibold mb-2">⚠ This action cannot be undone.</p>
        <ul className="text-red-700 text-sm list-disc pl-5 space-y-1">
          <li>Your account will be deactivated immediately.</li>
          <li>If you log back in within 7 days, your account will be automatically restored — nothing will be lost.</li>
          <li>If 7 days pass without logging in, your account and all associated data will be permanently and irreversibly deleted.</li>
        </ul>
      </div>

      {success ? (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-5 text-green-800">
          {success} You'll be logged out now.
        </div>
      ) : (
        <>
          <label className="block text-sm text-[#3D3A34] mb-2">Enter your password to confirm</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full bg-white border border-[#F0EBE0] rounded-lg px-4 py-3 mb-4 outline-none"
          />

          <label className="flex items-start gap-2 mb-4 text-sm text-[#3D3A34]">
            <input
              type="checkbox"
              checked={confirmChecked}
              onChange={(e) => setConfirmChecked(e.target.checked)}
              className="mt-1"
            />
            I understand my account will be deactivated now, and permanently deleted if I don't log back in within 7 days.
          </label>

          {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

          <button
            onClick={handleDelete}
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? "Processing..." : "Permanently Delete My Account"}
          </button>
        </>
      )}
    </div>
  )
}

export default DeleteAccountPage