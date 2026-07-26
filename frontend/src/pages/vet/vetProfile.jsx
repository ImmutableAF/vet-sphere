import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"
import { getMyVetProfile } from "../../services/vets"

const statusConfig = {
  not_submitted: {
    label: "Not Submitted",
    badgeBg: "bg-gray-500",
    badgeText: "text-white",
    message: "You haven't submitted your verification documents yet.",
  },
  pending: {
    label: "Pending Review",
    badgeBg: "bg-[#E0B84C]",
    badgeText: "text-white",
    message: "Your verification is under review. We'll notify you once it's complete.",
  },
  verified: {
    label: "Verified",
    badgeBg: "bg-green-600",
    badgeText: "text-white",
    message: "Your account has been verified.",
  },
  rejected: {
    label: "Rejected",
    badgeBg: "bg-red-700",
    badgeText: "text-white",
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

  const backgroundStyle = { background: "linear-gradient(135deg, #C9B6E4 0%, #E8DFF5 50%, #D8CDEF 100%)" }

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center -m-8" style={backgroundStyle}>
        <p className="text-[#3D3A34]">Loading your profile...</p>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="w-screen h-screen flex items-center justify-center -m-8" style={backgroundStyle}>
        <p className="text-[#3D3A34]">{error || "No profile data found."}</p>
      </div>
    )
  }

  const status = statusConfig[profile.verificationStatus] || statusConfig.not_submitted

  return (
    <div className="w-screen h-screen overflow-y-auto -m-8" style={backgroundStyle}>
      <div className="max-w-2xl mx-auto p-8">
        <div className="bg-white border border-[#F0EBE0] rounded-2xl overflow-hidden shadow-md">

          <div className="flex items-center justify-between px-8 py-6 bg-[#EDE7F6]">
            <h1 className="text-2xl font-semibold text-[#3D3A34]">
              {profile.name}
            </h1>
            <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium leading-none ${status.badgeBg} ${status.badgeText}`}>
              {status.label}
            </span>
          </div>

          <div className="px-8 py-6 space-y-6">
            <p className="text-sm text-[#3D3A34]">{status.message}</p>

            {profile.verificationStatus === "not_submitted" && (
              <button
                onClick={() => navigate("/dashboard/vet/verify")}
                className="px-5 py-2.5 rounded-full bg-[#8A6FC7] text-white text-sm font-medium"
              >
                Get Verified
              </button>
            )}

            {profile.verificationStatus === "rejected" && profile.rejectionReason && (
              <div className="px-4 py-2 rounded-lg bg-red-100 text-red-700 text-sm">
                Reason: {profile.rejectionReason}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm text-[#3D3A34] pt-2">
              <p><span className="text-[#8A8578]">Specialization:</span> {profile.specialization || "—"}</p>
              <p><span className="text-[#8A8578]">Experience:</span> {profile.experienceYears ? `${profile.experienceYears} years` : "—"}</p>
              <p><span className="text-[#8A8578]">City:</span> {profile.city || "—"}</p>
              <p>
                <span className="text-[#8A8578]">Contact:</span>{" "}
                {profile.contactInfo?.phone || "—"}
                {profile.contactInfo?.email ? ` · ${profile.contactInfo.email}` : ""}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VetProfile