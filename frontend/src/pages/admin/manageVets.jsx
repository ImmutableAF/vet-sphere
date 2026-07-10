import { useEffect, useState } from "react"
import { getAllVets, updateVetVerification } from "../../services/admin"

const TABS = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "verified", label: "Verified" },
  { key: "rejected", label: "Rejected" },
  { key: "not_submitted", label: "Not Submitted" },
]

const STATUS_STYLES = {
  pending: "bg-yellow-100 text-yellow-800",
  verified: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  not_submitted: "bg-gray-100 text-gray-600",
}

function formatDate(value) {
  if (!value) return "—"
  return new Date(value).toLocaleDateString()
}

function ManageVets() {
  const [vets, setVets] = useState([])
  const [activeTab, setActiveTab] = useState("pending")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [rejectingId, setRejectingId] = useState(null)
  const [rejectionReason, setRejectionReason] = useState("")
  const [actionLoadingId, setActionLoadingId] = useState(null)

  const loadVets = async () => {
    try {
      setLoading(true)
      const data = await getAllVets()
      setVets(data)
      setError("")
    } catch (err) {
      setError("Failed to load vets")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadVets()
  }, [])

  const filteredVets =
    activeTab === "all"
      ? vets
      : vets.filter((v) => v.verificationStatus === activeTab)

  const handleApprove = async (id) => {
    try {
      setActionLoadingId(id)
      const { vet } = await updateVetVerification(id, { verificationStatus: "verified" })
      setVets((prev) => prev.map((v) => (v._id === id ? vet : v)))
    } catch (err) {
      setError("Failed to approve vet")
    } finally {
      setActionLoadingId(null)
    }
  }

  const startReject = (id) => {
    setRejectingId(id)
    setRejectionReason("")
  }

  const cancelReject = () => {
    setRejectingId(null)
    setRejectionReason("")
  }

  const confirmReject = async (id) => {
    try {
      setActionLoadingId(id)
      const { vet } = await updateVetVerification(id, {
        verificationStatus: "rejected",
        rejectionReason: rejectionReason.trim(),
      })
      setVets((prev) => prev.map((v) => (v._id === id ? vet : v)))
      setRejectingId(null)
      setRejectionReason("")
    } catch (err) {
      setError("Failed to reject vet")
    } finally {
      setActionLoadingId(null)
    }
  }

  if (loading) {
    return <div className="text-[#3D3A34]">Loading vets...</div>
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-semibold text-[#3D3A34] mb-6">Manage Vets</h1>

      {error && (
        <div className="mb-4 px-4 py-2 rounded-lg bg-red-100 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-2 mb-6 flex-wrap">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              activeTab === tab.key
                ? "bg-[#7FA88A] text-white"
                : "bg-white text-[#3D3A34] border border-[#F0EBE0]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {filteredVets.length === 0 && (
        <p className="text-[#8A8578]">No vets in this category.</p>
      )}

      <div className="flex flex-col gap-4">
        {filteredVets.map((vet) => (
          <div
            key={vet._id}
            className="bg-white border border-[#F0EBE0] rounded-2xl p-6"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h2 className="text-lg font-semibold text-[#3D3A34]">{vet.name}</h2>
                <p className="text-sm text-[#8A8578]">{vet.specialization || "No specialization listed"}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  STATUS_STYLES[vet.verificationStatus] || STATUS_STYLES.not_submitted
                }`}
              >
                {vet.verificationStatus.replace("_", " ")}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm text-[#3D3A34] mb-3">
              <p><span className="text-[#8A8578]">City:</span> {vet.city || "—"}</p>
              <p><span className="text-[#8A8578]">Experience:</span> {vet.experienceYears ?? "—"} yrs</p>
              <p><span className="text-[#8A8578]">License #:</span> {vet.licenseNumber || "—"}</p>
              <p><span className="text-[#8A8578]">Phone:</span> {vet.contactInfo?.phone || "—"}</p>
              <p><span className="text-[#8A8578]">Email:</span> {vet.contactInfo?.email || "—"}</p>
            </div>

            {vet.verificationDetails && (
              <div className="text-sm text-[#3D3A34] mb-3 border-t border-[#F0EBE0] pt-3">
                <p><span className="text-[#8A8578]">Issuing authority:</span> {vet.verificationDetails.licenseIssuingAuthority || "—"}</p>
                <p><span className="text-[#8A8578]">Issue date:</span> {formatDate(vet.verificationDetails.licenseIssueDate)}</p>
                {vet.verificationDetails.additionalNotes && (
                  <p><span className="text-[#8A8578]">Notes:</span> {vet.verificationDetails.additionalNotes}</p>
                )}
              </div>
            )}

            {vet.proofDocumentPath && (
              <a
                href={`http://localhost:5000${vet.proofDocumentPath}`}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-[#7FA88A] underline"
              >
                View proof document
              </a>
            )}

            {vet.verificationStatus === "rejected" && vet.rejectionReason && (
              <p className="mt-2 text-sm text-red-700">
                <span className="text-[#8A8578]">Rejection reason:</span> {vet.rejectionReason}
              </p>
            )}

            <p className="mt-2 text-xs text-[#8A8578]">
              Submitted: {formatDate(vet.submittedAt)} · Reviewed: {formatDate(vet.reviewedAt)}
            </p>

            {vet.verificationStatus !== "not_submitted" && (
              <div className="mt-4 flex gap-3 items-center">
                {vet.verificationStatus !== "verified" && (
                  <button
                    onClick={() => handleApprove(vet._id)}
                    disabled={actionLoadingId === vet._id}
                    className="px-4 py-2 rounded-full bg-[#7FA88A] text-white text-sm font-medium disabled:opacity-50"
                  >
                    Approve
                  </button>
                )}

                {vet.verificationStatus !== "rejected" && rejectingId !== vet._id && (
                  <button
                    onClick={() => startReject(vet._id)}
                    disabled={actionLoadingId === vet._id}
                    className="px-4 py-2 rounded-full bg-red-100 text-red-700 text-sm font-medium disabled:opacity-50"
                  >
                    Reject
                  </button>
                )}

                {rejectingId === vet._id && (
                  <div className="flex gap-2 items-center flex-1">
                    <input
                      type="text"
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Reason for rejection"
                      className="flex-1 px-3 py-2 rounded-full border border-[#F0EBE0] text-sm"
                    />
                    <button
                      onClick={() => confirmReject(vet._id)}
                      disabled={actionLoadingId === vet._id || !rejectionReason.trim()}
                      className="px-4 py-2 rounded-full bg-red-600 text-white text-sm font-medium disabled:opacity-50"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={cancelReject}
                      className="px-4 py-2 rounded-full bg-white border border-[#F0EBE0] text-sm font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ManageVets