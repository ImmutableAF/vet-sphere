import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { submitVetVerification, getMyVetProfile } from "../../services/vets";

const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

function validateField(name, value) {
  switch (name) {
    case "licenseIssuingAuthority":
      if (!value.trim()) return "Issuing authority is required.";
      if (value.trim().length < 2) return "Please enter a valid authority name.";
      return "";
    case "licenseIssueDate":
      if (!value) return "License issue date is required.";
      if (new Date(value) > new Date()) return "Issue date can't be in the future.";
      return "";
    case "proofDocument":
      if (!value) return "A proof document is required.";
      if (!ALLOWED_TYPES.includes(value.type)) return "Only PDF, JPG, or PNG files are allowed.";
      if (value.size > MAX_FILE_SIZE) return "File must be under 5MB.";
      return "";
    default:
      return "";
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
};

export default function VerifyVetPage() {
  const navigate = useNavigate();
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [existingStatus, setExistingStatus] = useState(null);
  const [fields, setFields] = useState({
    licenseIssuingAuthority: "",
    licenseIssueDate: "",
    additionalNotes: "",
    proofDocument: null,
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadStatus() {
      try {
        const data = await getMyVetProfile();
        setExistingStatus(data.verificationStatus);
      } catch (err) {
        setExistingStatus("not_submitted");
      } finally {
        setCheckingStatus(false);
      }
    }
    loadStatus();
  }, []);

  function handleTextChange(e) {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0] ?? null;
    setFields((prev) => ({ ...prev, proofDocument: file }));
    setErrors((prev) => ({ ...prev, proofDocument: validateField("proofDocument", file) }));
  }

  const requiredFields = ["licenseIssuingAuthority", "licenseIssueDate", "proofDocument"];
  const hasAllRequired = requiredFields.every((name) => {
    const value = fields[name];
    return name === "proofDocument" ? value !== null : value.trim() !== "";
  });
  const hasNoErrors = requiredFields.every((name) => !validateField(name, fields[name]));
  const canSubmit = hasAllRequired && hasNoErrors && !submitting;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    setSubmitError("");

    try {
      const formData = new FormData();
      formData.append("licenseIssuingAuthority", fields.licenseIssuingAuthority);
      formData.append("licenseIssueDate", fields.licenseIssueDate);
      formData.append("additionalNotes", fields.additionalNotes);
      formData.append("proofDocument", fields.proofDocument);

      await submitVetVerification(formData);
      navigate("/dashboard/vet/profile");
    } catch (err) {
      setSubmitError(
        err.response?.data?.message || "Something went wrong submitting your verification."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (checkingStatus) {
    return (
      <div className="max-w-2xl mx-auto">
        <p className="text-sm text-gray-400">Checking your verification status…</p>
      </div>
    );
  }

  if (existingStatus && existingStatus !== "not_submitted") {
    const info = STATUS_MESSAGES[existingStatus];
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl p-8 shadow-sm">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-3">
            {info.title}
          </h1>
          <p className="text-sm text-gray-600">{info.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6">
        Get Verified
      </h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 shadow-sm space-y-6">
        {submitError && (
          <div className="bg-red-50 text-red-700 text-sm rounded-2xl p-4">
            {submitError}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            License Issuing Authority
          </label>
          {errors.licenseIssuingAuthority && (
            <p className="text-xs text-[#C0392B] mb-1">{errors.licenseIssuingAuthority}</p>
          )}
          <input
            type="text"
            name="licenseIssuingAuthority"
            value={fields.licenseIssuingAuthority}
            onChange={handleTextChange}
            className={`w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ${
              errors.licenseIssuingAuthority
                ? "border-[#C0392B] focus:ring-red-200"
                : "border-gray-200 focus:ring-[#E7F0E5]"
            }`}
            placeholder="e.g. Punjab Veterinary Council"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            License Issue Date
          </label>
          {errors.licenseIssueDate && (
            <p className="text-xs text-[#C0392B] mb-1">{errors.licenseIssueDate}</p>
          )}
          <input
            type="date"
            name="licenseIssueDate"
            value={fields.licenseIssueDate}
            onChange={handleTextChange}
            className={`w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ${
              errors.licenseIssueDate
                ? "border-[#C0392B] focus:ring-red-200"
                : "border-gray-200 focus:ring-[#E7F0E5]"
            }`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Additional Notes <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea
            name="additionalNotes"
            value={fields.additionalNotes}
            onChange={handleTextChange}
            rows={3}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E7F0E5]"
            placeholder="Anything else you'd like the reviewer to know"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Proof Document
          </label>
          {errors.proofDocument && (
            <p className="text-xs text-[#C0392B] mb-1">{errors.proofDocument}</p>
          )}
          <input
            type="file"
            name="proofDocument"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            className={`w-full text-sm rounded-xl border px-4 py-2.5 file:mr-4 file:rounded-lg file:border-0 file:bg-[#E7F0E5] file:px-3 file:py-1.5 file:text-sm ${
              errors.proofDocument ? "border-[#C0392B]" : "border-gray-200"
            }`}
          />
          <p className="text-xs text-gray-400 mt-1">PDF, JPG, or PNG. Max 5MB.</p>
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className={`w-full rounded-xl py-3 text-sm font-medium transition ${
            canSubmit
              ? "bg-[#7FA88A] text-white hover:bg-[#6d9678]"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          {submitting ? "Submitting…" : "Submit for Verification"}
        </button>
      </form>
    </div>
  );
}