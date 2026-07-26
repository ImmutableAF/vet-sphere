import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Stethoscope,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
} from "lucide-react";
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

const glassCard = "backdrop-blur-xl bg-white/40 border border-white/60 shadow-lg rounded-2xl";
const backgroundStyle = { background: "linear-gradient(135deg, #C9B6E4 0%, #E8DFF5 50%, #D8CDEF 100%)" };

function Field({ label, name, value, onChange, error, type = "text", icon: Icon, disabled, hint, min }) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-sm font-medium text-[#3D3A34] mb-1.5">
        {Icon && <Icon size={14} className="text-[#5B4B8A]" />}
        {label}
        {hint && <span className="text-[#8A8578] font-normal">{hint}</span>}
      </label>
      {error && <p className="text-xs text-red-700 mb-1">{error}</p>}
      <input
        type={type}
        name={name}
        min={min}
        value={value}
        onChange={onChange}
        disabled={disabled}
        readOnly={disabled}
        className={`w-full rounded-xl border px-4 py-2.5 text-sm text-[#3D3A34] transition focus:outline-none focus:ring-2 ${
          disabled
            ? "bg-white/30 border-white/50 text-[#8A8578] cursor-not-allowed"
            : error
            ? "border-red-400 bg-white/60 focus:ring-red-200"
            : "border-white/60 bg-white/60 focus:ring-[#D8CDEF] focus:border-[#8A6FC7]"
        }`}
      />
    </div>
  );
}

function SectionCard({ icon: Icon, title, children }) {
  return (
    <div className={`${glassCard} px-8 py-6`}>
      <div className="flex items-center gap-2 mb-5">
        <Icon size={14} className="text-[#5B4B8A]" />
        <h3 className="text-xs uppercase tracking-wide text-[#5B4B8A] font-semibold">
          {title}
        </h3>
      </div>
      <div className="space-y-5">{children}</div>
    </div>
  );
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
      <div className="w-screen h-screen flex items-center justify-center" style={backgroundStyle}>
        <p className="text-[#3D3A34]">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen overflow-y-auto p-0 -m-8" style={backgroundStyle}>
      <div className="flex flex-col gap-6 max-w-3xl mx-auto p-8">

        <button
          onClick={() => navigate("/dashboard/vet/profile")}
          className={`self-start px-5 py-2.5 text-sm font-medium text-[#3D3A34] ${glassCard}`}
        >
          ← Back to profile
        </button>

        <div className={`${glassCard} px-8 py-6 flex justify-between items-center`}>
          <div>
            <h1 className="text-2xl font-semibold text-[#3D3A34]">Edit Profile</h1>
            <p className="text-sm text-[#5B4B8A] mt-1">
              Keep your professional details up to date
            </p>
          </div>
        </div>

        {error && (
          <div className={`px-4 py-3 text-red-800 text-sm ${glassCard}`}>
            {error}
          </div>
        )}
        {successMessage && (
          <div className={`px-4 py-3 text-green-800 text-sm ${glassCard}`}>
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <SectionCard icon={User} title="Identity">
            <Field
              label="Name"
              name="name"
              icon={User}
              value={fields.name}
              onChange={handleChange}
              error={errors.name}
            />
            <Field
              label="License Number"
              name="licenseNumber"
              icon={ShieldCheck}
              hint="(locked after verification)"
              value={fields.licenseNumber}
              onChange={() => {}}
              disabled
            />
          </SectionCard>

          <SectionCard icon={Stethoscope} title="Professional Details">
            <Field
              label="Specialization"
              name="specialization"
              icon={Stethoscope}
              value={fields.specialization}
              onChange={handleChange}
              error={errors.specialization}
            />
            <div className="grid grid-cols-2 gap-4">
              <Field
                label="Years of Experience"
                name="experienceYears"
                type="number"
                min="0"
                value={fields.experienceYears}
                onChange={handleChange}
                error={errors.experienceYears}
              />
              <Field
                label="City"
                name="city"
                icon={MapPin}
                value={fields.city}
                onChange={handleChange}
                error={errors.city}
              />
            </div>
          </SectionCard>

          <SectionCard icon={Phone} title="Contact">
            <Field
              label="Phone"
              name="phone"
              icon={Phone}
              value={fields.phone}
              onChange={handleChange}
              error={errors.phone}
            />
            <Field
              label="Contact Email"
              name="email"
              type="email"
              icon={Mail}
              value={fields.email}
              onChange={handleChange}
              error={errors.email}
            />
          </SectionCard>

          <div className={`${glassCard} px-8 py-6 flex gap-3 items-center`}>
            <button
              type="submit"
              disabled={!canSubmit}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition ${
                canSubmit
                  ? "bg-[#8A6FC7] text-white hover:bg-[#7a5fb5]"
                  : "bg-white/40 text-[#8A8578] cursor-not-allowed"
              }`}
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/dashboard/vet/profile")}
              className="px-6 py-2.5 rounded-full bg-red-900 text-white text-sm font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}