import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { submitVetVerification, getMyVetProfile } from "../../services/vets"

const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/jpg", "image/png"]
const MAX_FILE_SIZE = 5 * 1024 * 1024

function validateField(name, value) {
  switch (name) {
    case "licenseIssuingAuthority":
      if (!value.trim()) return "Issuing authority is required."
      if (value.trim().length < 2) return "Please enter a valid authority name."
      return ""
    case "licenseIssueDate":
      if (!value) return "License issue date is required."
      if (new Date(value) > new Date()) return "Issue date can't be in the future."
      return ""
    case "proofDocument":
      if (!value) return "A proof document is required."
      if (!ALLOWED_TYPES.includes(value.type)) return "Only PDF, JPG, or PNG files are allowed."
      if (value.size > MAX_FILE_SIZE) return "File must be under 5MB."
      return ""
    default:
      return ""
  }
}

const STATUS_MESSAGES = {
  pending: {
    title: "Verification Pending",
    message: "Your documents have been submitted and are under review. We'll update your status once a decision has been made.",
  },
  verified: {
    title: "You're Already Verified",
    message: "Your account has already been verified. No further action is needed.",
  },
  rejected: {
    title: "Verification Rejected",
    message: "Your previous submission was rejected. Please contact support for next steps.",
  },
}

export default function VerifyVetPage() {
  const navigate = useNavigate()
  const [checkingStatus, setCheckingStatus] = useState(true)
  const [existingStatus, setExistingStatus] = useState(null)
  const [fields, setFields] = useState({
    licenseIssuingAuthority: "",
    licenseIssueDate: "",
    additionalNotes: "",
    proofDocument: null,
  })
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const backgroundStyle = { background: "linear-gradient(135deg, #C9B6E4 0%, #E8DFF5 50%, #D8CDEF 100%)" }

  useEffect(() => {
    async function loadStatus() {
      try {
        const data = await getMyVetProfile()
        setExistingStatus(data.verificationStatus)
      } catch (err) {
        setExistingStatus("not_submitted")
      } finally {
        setCheckingStatus(false)
      }
    }
    loadStatus()
  }, [])

  function handleTextChange(e) {
    const { name, value } = e.target
    setFields((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }))
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0] ?? null
    setFields((prev) => ({ ...prev, proofDocument: file }))
    setErrors((prev) => ({ ...prev, proofDocument: validateField("proofDocument", file) }))
  }

  const requiredFields = ["licenseIssuingAuthority", "licenseIssueDate", "proofDocument"]
  const hasAllRequired = requiredFields.every((name) => {
    const value = fields[name]
    return name === "proofDocument" ? value !== null : value.trim() !== ""
  })
  const hasNoErrors = requiredFields.every((name) => !validateField(name, fields[name]))
  const canSubmit = hasAllRequired && hasNoErrors && !submitting

  async function handleSubmit(e) {
    e.preventDefault()
    if (!canSubmit) return

    setSubmitting(true)
    setSubmitError("")

    try {
      const formData = new FormData()
      formData.append("licenseIssuingAuthority", fields.licenseIssuingAuthority)
      formData.append("licenseIssueDate", fields.licenseIssueDate)
      formData.append("additionalNotes", fields.additionalNotes)
      formData.append("proofDocument", fields.proofDocument)

      await submitVetVerification(formData)
      navigate("/dashboard/vet/profile")
    } catch (err) {
      setSubmitError(
        err.response?.data?.message || "Something went wrong submitting your verification."
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (checkingStatus) {
    return (
      <div className="w-screen h-screen flex items-center justify-center -m-8" style={backgroundStyle}>
        <p className="text-[#3D3A34]">Checking your verification status...</p>
      </div>
    )
  }

  if (existingStatus && existingStatus !== "not_submitted") {
    const info = STATUS_MESSAGES[existingStatus]
    return (
      <div className="w-screen h-screen overflow-y-auto -m-8" style={backgroundStyle}>
        <div className="max-w-2xl mx-auto p-8">
          <div className="bg-white border border-[#F0EBE0] rounded-2xl overflow-hidden shadow-md px-8 py-6">
            <h1 className="text-2xl font-semibold text-[#3D3A34] mb-3">
              {info.title}
            </h1>
            <p className="text-sm text-[#3D3A34]">{info.message}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-screen h-screen overflow-y-auto -m-8" style={backgroundStyle}>
      <div className="max-w-2xl mx-auto p-8">
        <h1 className="text-2xl font-semibold text-[#3D3A34] mb-6">
          Get Verified
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-[#F0EBE0] rounded-2xl overflow-hidden shadow-md px-8 py-6 space-y-6"
        >
          {submitError && (
            <div className="px-4 py-2 rounded-lg bg-red-100 text-red-700 text-sm">
              {submitError}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-[#3D3A34] mb-1">
              License Issuing Authority
            </label>
            {errors.licenseIssuingAuthority && (
              <p className="text-xs text-red-700 mb-1">{errors.licenseIssuingAuthority}</p>
            )}
            <input
              type="text"
              name="licenseIssuingAuthority"
              value={fields.licenseIssuingAuthority}
              onChange={handleTextChange}
              className={`w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ${
                errors.licenseIssuingAuthority
                  ? "border-red-700 focus:ring-red-200"
                  : "border-[#F0EBE0] focus:ring-[#E4DAF5]"
              }`}
              placeholder="e.g. Punjab Veterinary Council"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#3D3A34] mb-1">
              License Issue Date
            </label>
            {errors.licenseIssueDate && (
              <p className="text-xs text-red-700 mb-1">{errors.licenseIssueDate}</p>
            )}
            <input
              type="date"
              name="licenseIssueDate"
              value={fields.licenseIssueDate}
              onChange={handleTextChange}
              className={`w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ${
                errors.licenseIssueDate
                  ? "border-red-700 focus:ring-red-200"
                  : "border-[#F0EBE0] focus:ring-[#E4DAF5]"
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#3D3A34] mb-1">
              Additional Notes <span className="text-[#8A8578] font-normal">(optional)</span>
            </label>
            <textarea
              name="additionalNotes"
              value={fields.additionalNotes}
              onChange={handleTextChange}
              rows={3}
              className="w-full rounded-xl border border-[#F0EBE0] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E4DAF5]"
              placeholder="Anything else you'd like the reviewer to know"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#3D3A34] mb-1">
              Proof Document
            </label>
            {errors.proofDocument && (
              <p className="text-xs text-red-700 mb-1">{errors.proofDocument}</p>
            )}
            <input
              type="file"
              name="proofDocument"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className={`w-full text-sm rounded-xl border px-4 py-2.5 file:mr-4 file:rounded-lg file:border-0 file:bg-[#EDE7F6] file:px-3 file:py-1.5 file:text-sm ${
                errors.proofDocument ? "border-red-700" : "border-[#F0EBE0]"
              }`}
            />
            <p className="text-xs text-[#8A8578] mt-1">PDF, JPG, or PNG. Max 5MB.</p>
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className={`w-full rounded-full py-3 text-sm font-medium transition ${
              canSubmit
                ? "bg-[#8A6FC7] text-white hover:bg-[#7a5fb5]"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            {submitting ? "Submitting..." : "Submit for Verification"}
          </button>
        </form>
      </div>
    </div>
  )
}