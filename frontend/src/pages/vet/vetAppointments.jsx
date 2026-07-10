import { useState, useEffect } from "react";
import { getAppointments, updateAppointmentStatus } from "../../services/appointments";

const STATUS_ACTIONS = {
  pending: [
    { label: "Approve", nextStatus: "confirmed", style: "bg-[#E7F0E5] text-[#3A6B35] hover:bg-[#d8e8d4]" },
    { label: "Reject", nextStatus: "rejected", style: "bg-[#FBE9DD] text-[#C0392B] hover:bg-[#f7ddc9]" },
  ],
  confirmed: [
    { label: "Mark Completed", nextStatus: "completed", style: "bg-[#EDE7F7] text-[#5B4B8A] hover:bg-[#e1d8f2]" },
    { label: "Cancel", nextStatus: "cancelled", style: "bg-[#FBE9DD] text-[#C0392B] hover:bg-[#f7ddc9]" },
  ],
  completed: [],
  rejected: [],
  cancelled: [],
};

const TABS = ["pending", "confirmed", "completed", "rejected", "cancelled"];

const STATUS_LABEL = {
  pending: "Pending",
  confirmed: "Confirmed",
  completed: "Completed",
  rejected: "Rejected",
  cancelled: "Cancelled",
};

export default function VetAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  async function loadAppointments() {
    try {
      const data = await getAppointments();
      setAppointments(data);
    } catch (err) {
      setError("Couldn't load appointments. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAppointments();
  }, []);

  async function handleStatusChange(appointmentId, nextStatus) {
    setUpdatingId(appointmentId);
    const prevAppointments = appointments;
    setAppointments((prev) =>
      prev.map((appt) =>
        appt._id === appointmentId ? { ...appt, status: nextStatus } : appt
      )
    );
    try {
      await updateAppointmentStatus(appointmentId, nextStatus);
    } catch (err) {
      setAppointments(prevAppointments);
      setError("Update failed — please try again.");
    } finally {
      setUpdatingId(null);
    }
  }

  const filtered = appointments.filter((a) => a.status === activeTab);

  return (
    <div className="min-h-screen bg-[#FBF8F3] p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6">
          Appointments
        </h1>

        <div className="flex gap-2 mb-6 flex-wrap">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-2xl text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "bg-[#EDE7F7] text-[#5B4B8A]"
                  : "bg-white text-gray-500 hover:bg-gray-50"
              }`}
            >
              {STATUS_LABEL[tab]}
              <span className="ml-2 text-xs opacity-70">
                {appointments.filter((a) => a.status === tab).length}
              </span>
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-[#FBE9DD] text-[#C0392B] rounded-2xl p-4 mb-4 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-gray-400 text-center py-12">Loading appointments…</div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center text-gray-400">
            No {STATUS_LABEL[activeTab].toLowerCase()} appointments.
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((appt) => (
              <div
                key={appt._id}
                className="bg-white rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >
                <div>
                  <p className="font-semibold text-gray-800">
                    {appt.pet?.name || "Unknown pet"}
                  </p>
                  <p className="text-sm text-gray-500">
                    Owner: {appt.owner?.name || "Unknown"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {appt.date ? new Date(appt.date).toLocaleString() : "No date set"}
                  </p>
                  {appt.reason && (
                    <p className="text-sm text-gray-600 mt-1">Reason: {appt.reason}</p>
                  )}
                  {appt.statusNote && (
                    <p className="text-xs text-gray-400 italic mt-1">{appt.statusNote}</p>
                  )}
                </div>

                <div className="flex gap-2 flex-wrap">
                  {STATUS_ACTIONS[appt.status]?.map((action) => (
                    <button
                      key={action.nextStatus}
                      onClick={() => handleStatusChange(appt._id, action.nextStatus)}
                      disabled={updatingId === appt._id}
                      className={`px-4 py-2 rounded-2xl text-sm font-medium transition-colors disabled:opacity-50 ${action.style}`}
                    >
                      {updatingId === appt._id ? "…" : action.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}