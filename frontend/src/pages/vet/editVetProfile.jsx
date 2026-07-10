import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyVetProfile, updateMyVetProfile } from "../../services/vets";

function validateField(name, value) {
  switch (name) {
    case "name":
      if (!value.trim()) return "Name is required.";
      return "";
    case "specialization":
      if (!value.trim()) return "Specialization is required.";
      return "";
    case "experienceYears":
      if (value === "" || value === null) return "Years of experience is required.";
      if (Number(value) < 0) return "Experience can't be negative.";
      return "";
    case "city":
      if (!value.trim()) return "City is required.";
      return "";
    case "phone":
      if (!value.trim()) return "Phone number is required.";
      return "";
    case "email":
      if (!value.trim()) return "Contact email is required.";
      if (!/^\S+@\S+\.\S+$/.test(value)) return "Enter a valid email address.";
      return "";
    default:
      return "";
  }
}

export default function EditVetProfile() {
  const navigate = useNavigate();
  const [fields, setFields] = useState({
    name: "",
    licenseNumber: "",
    specialization: "",
    experienceYears: "",
    city: "",
    phone: "",
    email: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await getMyVetProfile();
        setFields({
          name: data.name || "",
          licenseNumber: data.licenseNumber || "",
          specialization: data.specialization || "",
          experienceYears: data.experienceYears ?? "",
          city: data.city || "",
          phone: data.contactInfo?.phone || "",
          email: data.contactInfo?.email || "",
        });
      } catch (err) {
        setError("Couldn't load your profile.");
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  }

  const editableFields = ["name", "specialization", "experienceYears", "city", "phone", "email"];
  const hasAllRequired = editableFields.every((name) => fields[name] !== "" && fields[name] !== null);
  const hasNoErrors = editableFields.every((name) => !validateField(name, fields[name]));
  const canSubmit = hasAllRequired && hasNoErrors && !saving;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;

    setSaving(true);
    setError("");
    setSuccessMessage("");

    try {
      await updateMyVetProfile({
        name: fields.name,
        specialization: fields.specialization,
        experienceYears: Number(fields.experienceYears),
        city: fields.city,
        contactInfo: {
          phone: fields.phone,
          email: fields.email,
        },
      });
      setSuccessMessage("Profile updated successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong updating your profile.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto">
        <p className="text-sm text-gray-400">Loading your profile…</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6">
        Edit Profile
      </h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 shadow-sm space-y-6">
        {error && (
          <div className="bg-red-50 text-red-700 text-sm rounded-2xl p-4">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="bg-[#E7F0E5] text-[#4C7A5A] text-sm rounded-2xl p-4">
            {successMessage}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          {errors.name && <p className="text-xs text-[#C0392B] mb-1">{errors.name}</p>}
          <input
            type="text"
            name="name"
            value={fields.name}
            onChange={handleChange}
            className={`w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ${
              errors.name ? "border-[#C0392B] focus:ring-red-200" : "border-gray-200 focus:ring-[#E7F0E5]"
            }`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            License Number <span className="text-gray-400 font-normal">(locked after verification)</span>
          </label>
          <input
            type="text"
            name="licenseNumber"
            value={fields.licenseNumber}
            disabled
            readOnly
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
          {errors.specialization && <p className="text-xs text-[#C0392B] mb-1">{errors.specialization}</p>}
          <input
            type="text"
            name="specialization"
            value={fields.specialization}
            onChange={handleChange}
            placeholder="e.g. General Practice, Surgery, Dermatology"
            className={`w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ${
              errors.specialization ? "border-[#C0392B] focus:ring-red-200" : "border-gray-200 focus:ring-[#E7F0E5]"
            }`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
          {errors.experienceYears && <p className="text-xs text-[#C0392B] mb-1">{errors.experienceYears}</p>}
          <input
            type="number"
            name="experienceYears"
            min="0"
            value={fields.experienceYears}
            onChange={handleChange}
            className={`w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ${
              errors.experienceYears ? "border-[#C0392B] focus:ring-red-200" : "border-gray-200 focus:ring-[#E7F0E5]"
            }`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
          {errors.city && <p className="text-xs text-[#C0392B] mb-1">{errors.city}</p>}
          <input
            type="text"
            name="city"
            value={fields.city}
            onChange={handleChange}
            className={`w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ${
              errors.city ? "border-[#C0392B] focus:ring-red-200" : "border-gray-200 focus:ring-[#E7F0E5]"
            }`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          {errors.phone && <p className="text-xs text-[#C0392B] mb-1">{errors.phone}</p>}
          <input
            type="text"
            name="phone"
            value={fields.phone}
            onChange={handleChange}
            className={`w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ${
              errors.phone ? "border-[#C0392B] focus:ring-red-200" : "border-gray-200 focus:ring-[#E7F0E5]"
            }`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
          {errors.email && <p className="text-xs text-[#C0392B] mb-1">{errors.email}</p>}
          <input
            type="email"
            name="email"
            value={fields.email}
            onChange={handleChange}
            className={`w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ${
              errors.email ? "border-[#C0392B] focus:ring-red-200" : "border-gray-200 focus:ring-[#E7F0E5]"
            }`}
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={!canSubmit}
            className={`flex-1 rounded-xl py-3 text-sm font-medium transition ${
              canSubmit ? "bg-[#7FA88A] text-white hover:bg-[#6d9678]" : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/dashboard/vet/profile")}
            className="rounded-xl py-3 px-6 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}