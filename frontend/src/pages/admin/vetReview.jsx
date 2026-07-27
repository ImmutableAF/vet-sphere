import { useEffect, useRef, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getAllVets, updateVetVerification } from "../../services/admin"


function formatDate(value) {
  if (!value) return "—"
  return new Date(value).toLocaleDateString()
}

function DocumentPreviewLink({ path }) {
  const [hovered, setHovered] = useState(false)
  const [leanX, setLeanX] = useState(0)
  const containerRef = useRef(null)

  const isImage = /\.(png|jpe?g|gif|webp)$/i.test(path || "")
  const url = `${import.meta.env.VITE_API_URL || "http://localhost:5000"}${path}`

  const onMove = (e) => {
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const ratio = (e.clientX - rect.left) / Math.max(1, rect.width)
    setLeanX((Math.max(0, Math.min(1, ratio)) - 0.5) * 60)
  }

  return (
    <span
      ref={containerRef}
      className="relative inline-block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={onMove}
    >
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="text-sm text-[#5B4B8A] underline font-medium"
      >
        View proof document
      </a>

      {hovered && (
        <div
          className="absolute z-20 bg-white/90 border border-[#E4DAF5] rounded-xl shadow-lg overflow-hidden"
          style={{
            width: 280,
            height: 176,
            left: "50%",
            bottom: "calc(100% + 14px)",
            transform: `translateX(calc(-50% + ${leanX}px))`,
            transition: "transform 0.2s ease-out",
            pointerEvents: "none",
          }}
        >
          {isImage ? (
            <img src={url} alt="Proof document" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-[#8A8578] text-sm">
              <span className="text-3xl">📄</span>
              <span>PDF document — click to open</span>
            </div>
          )}
        </div>
      )}
    </span>
  )
}

function VetReview() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [vet, setVet] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [actionLoading, setActionLoading] = useState(false)
  const [rejecting, setRejecting] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")

  const statusStyles = {
          verified: "bg-[#4F7A57] text-white",
          rejected: "bg-[#C0392B] text-white",
          pending: "bg-[#E0B84C] text-white",
          not_submitted: "bg-[#808080] text-white",
        };

  useEffect(() => {
    const loadVet = async () => {
      try {
        setLoading(true)
        const data = await getAllVets()
        const found = data.find((v) => v._id === id)
        setVet(found || null)
        setError(found ? "" : "Vet not found")
      } catch (err) {
        setError("Failed to load vet")
      } finally {
        setLoading(false)
      }
    }
    loadVet()
  }, [id])

  const handleApprove = async () => {
    try {
      setActionLoading(true)
      await updateVetVerification(id, { verificationStatus: "verified" })
      navigate("/dashboard/admin/vets")
    } catch (err) {
      setError("Failed to approve vet")
    } finally {
      setActionLoading(false)
    }
  }

  const handleReject = async () => {
    try {
      setActionLoading(true)
      await updateVetVerification(id, {
        verificationStatus: "rejected",
        rejectionReason: rejectionReason.trim(),
      })
      navigate("/dashboard/admin/vets")
    } catch (err) {
      setError("Failed to reject vet")
    } finally {
      setActionLoading(false)
    }
  }

  const glassCard = "backdrop-blur-xl bg-white/40 border border-white/60 shadow-lg rounded-2xl"
  const backgroundStyle = { background: "linear-gradient(135deg, #C9B6E4 0%, #E8DFF5 50%, #D8CDEF 100%)" }

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center" style={backgroundStyle}>
        <p className="text-[#3D3A34]">Loading vet...</p>
      </div>
    )
  }

  if (!vet) {
    return (
      <div className="w-screen h-screen p-0" style={backgroundStyle}>
        <p className="text-[#3D3A34] mb-4">{error || "Vet not found"}</p>
        <button
          onClick={() => navigate("/dashboard/admin/vets")}
          className={`px-4 py-2 text-sm font-medium text-[#3D3A34] ${glassCard}`}
        >
          ← Back to pending list
        </button>
      </div>
    )
  }

  return (
    <div className="w-screen h-screen overflow-y-auto p-0 -m-8" style={backgroundStyle}>
      <div className="flex flex-col gap-6 max-w-4xl mx-auto p-8">

        {/* Back to pending list, as its own box */}
        <button
          onClick={() => navigate("/dashboard/admin/vets")}
          className={`self-start px-5 py-2.5 text-sm font-medium text-[#3D3A34] ${glassCard}`}
        >
          ← Back to pending list
        </button>

        {error && (
          <div className={`px-4 py-2 text-red-800 text-sm ${glassCard}`}>
            {error}
          </div>
        )}

        {/* Header section */}
        <div className={`${glassCard} px-8 py-6 flex justify-between items-center`}>
          <div>
            <h1 className="text-2xl font-semibold text-[#3D3A34]">{vet.name}</h1>
            <p className="text-sm text-[#5B4B8A] mt-1">
              {vet.specialization || "No specialization listed"}
            </p>
          </div>
          <span
            className={`inline-flex items-center justify-center px-4 py-1.5 rounded-full text-sm font-medium ${
              statusStyles[vet.verificationStatus?.toLowerCase()] || "bg-white/40 text-[#3D3A34]"
            }`}
          >
            {vet.verificationStatus}
          </span>
        </div>

        {/* Contact / basic info section */}
        <div className={`${glassCard} px-8 py-6`}>
          <h3 className="text-xs uppercase tracking-wide text-[#5B4B8A] font-semibold mb-4">
            Basic Information
          </h3>
          <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm text-[#3D3A34]">
            <p><span className="text-[#5B4B8A]">City:</span> {vet.city || "—"}</p>
            <p><span className="text-[#5B4B8A]">Experience:</span> {vet.experienceYears ?? "—"} yrs</p>
            <p><span className="text-[#5B4B8A]">License #:</span> {vet.licenseNumber || "—"}</p>
            <p><span className="text-[#5B4B8A]">Phone:</span> {vet.contactInfo?.phone || "—"}</p>
            <p><span className="text-[#5B4B8A]">Email:</span> {vet.contactInfo?.email || "—"}</p>
          </div>
        </div>

        {/* Verification details + proof document, side by side */}
        {vet.verificationDetails && (
          <div className={`${glassCard} px-8 py-6`}>
            <h3 className="text-xs uppercase tracking-wide text-[#5B4B8A] font-semibold mb-4">
              Verification Details
            </h3>
            <div className="grid grid-cols-2 gap-x-10">
              <div className="text-sm text-[#3D3A34] space-y-2">
                <p>
                  <span className="text-[#5B4B8A]">Issuing authority:</span>{" "}
                  {vet.verificationDetails.licenseIssuingAuthority || "—"}
                </p>
                <p>
                  <span className="text-[#5B4B8A]">Issue date:</span>{" "}
                  {formatDate(vet.verificationDetails.licenseIssueDate)}
                </p>
                {vet.verificationDetails.additionalNotes && (
                  <p><span className="text-[#5B4B8A]">Notes:</span> {vet.verificationDetails.additionalNotes}</p>
                )}
              </div>

              {vet.proofDocumentPath && (
                <div className="flex flex-col items-start">
                  <div style={{ height: 120 }} />
                  <DocumentPreviewLink path={vet.proofDocumentPath} />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Submitted date */}
        <div className={`${glassCard} px-8 py-6 flex justify-between items-center`}>
          <span className="text-sm text-[#5B4B8A] font-medium">Submitted on</span>
          <span className="text-xl font-semibold text-[#3D3A34]">{formatDate(vet.submittedAt)}</span>
        </div>

        {/* Actions */}
        <div className={`${glassCard} px-8 py-6 flex gap-3 items-center`}>
          <button
            onClick={handleApprove}
            disabled={actionLoading}
            className="px-5 py-2.5 rounded-full bg-[#8A6FC7] text-white text-sm font-medium disabled:opacity-50"
          >
            Approve
          </button>

          {!rejecting && (
            <button
              onClick={() => setRejecting(true)}
              disabled={actionLoading}
              className="px-5 py-2.5 rounded-full bg-red-900 text-white text-sm font-medium disabled:opacity-50"
            >
              Reject
            </button>
          )}

          {rejecting && (
            <div className="flex gap-2 items-center flex-1">
              <input
                type="text"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Reason for rejection"
                className="flex-1 px-3 py-2 rounded-full border border-white/60 bg-white/50 text-sm"
              />
              <button
                onClick={handleReject}
                disabled={actionLoading || !rejectionReason.trim()}
                className="px-5 py-2.5 rounded-full bg-green-700 text-white text-sm font-medium disabled:opacity-50"
              >
                Confirm
              </button>
              <button
                onClick={() => setRejecting(false)}
                className="px-5 py-2.5 rounded-full bg-red-900 text-white text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default VetReview