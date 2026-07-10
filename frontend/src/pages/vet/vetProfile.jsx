import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"
import { getMyVetProfile } from "../../services/vets"

const statusConfig = {
  not_submitted: {
    label: "Not Submitted",
    badgeClass: "bg-gray-100 text-gray-600",
    message: "You haven't submitted your verification documents yet.",
  },
  pending: {
    label: "Pending Review",
    badgeClass: "bg-yellow-100 text-yellow-700",
    message: "Your verification is under review. We'll notify you once it's complete.",
  },
  verified: {
    label: "Verified",
    badgeClass: "bg-[#E7F0E5] text-[#4C7A5A]",
    message: "Your account has been verified.",
  },
  rejected: {
    label: "Rejected",
    badgeClass: "bg-red-100 text-[#C0392B]",
    message: "Your verification was rejected.",
  },
}

function VetProfile() {
  const { currentUser } = useContext(AuthContext)
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await getMyVetProfile()
        setProfile(data)
      } catch (err) {
        setError("Couldn't load your profile.")
      } finally {
        setLoading(false)
      }
    }
    loadProfile()
  }, [])

  if (loading) {
    return <p className="text-sm text-gray-400">Loading your profile…</p>
  }

  if (error || !profile) {
    return <p className="text-sm text-[#C0392B]">{error || "No profile data found."}</p>
  }

  const status = statusConfig[profile.verificationStatus] || statusConfig.not_submitted

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-3xl p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">
            {profile.name}
          </h1>
          <span className={`text-xs font-medium px-3 py-1 rounded-full ${status.badgeClass}`}>
            {status.label}
          </span>
        </div>

        <p className="text-sm text-gray-600">{status.message}</p>

        {profile.verificationStatus === "not_submitted" && (
          <button
            onClick={() => navigate("/dashboard/vet/verify")}
            className="bg-[#7FA88A] text-white text-sm font-medium rounded-xl px-5 py-2.5 hover:bg-[#6d9678] transition"
          >
            Get Verified
          </button>
        )}

        {profile.verificationStatus === "rejected" && profile.rejectionReason && (
          <div className="bg-red-50 text-[#C0392B] text-sm rounded-2xl p-4">
            Reason: {profile.rejectionReason}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <p className="text-xs text-gray-400">Specialization</p>
            <p className="text-sm text-gray-800">{profile.specialization || "—"}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Experience</p>
            <p className="text-sm text-gray-800">
              {profile.experienceYears ? `${profile.experienceYears} years` : "—"}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400">City</p>
            <p className="text-sm text-gray-800">{profile.city || "—"}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Contact</p>
            <p className="text-sm text-gray-800">{profile.contactInfo?.phone || "—"}</p>
            <p className="text-sm text-gray-800">{profile.contactInfo?.email || "—"}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VetProfile