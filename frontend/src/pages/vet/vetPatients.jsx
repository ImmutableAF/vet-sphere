import { useState, useEffect } from "react";
import { getAppointments } from "../../services/appointments";

function dedupePetsFromAppointments(appointments) {
  const seen = new Map();
  appointments
    .filter((a) => a.status === "confirmed" || a.status === "completed")
    .forEach((a) => {
      if (a.pet?._id && !seen.has(a.pet._id)) {
        seen.set(a.pet._id, {
          ...a.pet,
          owner: a.owner,
          lastVisit: a.date,
          visitCount: 1,
        });
      } else if (a.pet?._id) {
        const existing = seen.get(a.pet._id);
        existing.visitCount += 1;
        if (new Date(a.date) > new Date(existing.lastVisit)) {
          existing.lastVisit = a.date;
        }
      }
    });
  return Array.from(seen.values());
}

export default function VetPatients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadPatients() {
    try {
      const appointments = await getAppointments();
      setPatients(dedupePetsFromAppointments(appointments));
    } catch (err) {
      setError("Couldn't load patients. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPatients();
  }, []);

  return (
    <div className="min-h-screen bg-[#FBF8F3] p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6">
          My Patients
        </h1>

        {error && (
          <div className="bg-[#FBE9DD] text-[#C0392B] rounded-2xl p-4 mb-4 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-gray-400 text-center py-12">Loading patients…</div>
        ) : patients.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center text-gray-400">
            No patients yet. Confirmed appointments will show up here.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {patients.map((pet) => (
              <div key={pet._id} className="bg-white rounded-3xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-gray-800">{pet.name}</p>
                  <span className="text-xs bg-[#E7F0E5] text-[#3A6B35] px-3 py-1 rounded-full">
                    {pet.visitCount} visit{pet.visitCount > 1 ? "s" : ""}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  {pet.species || "Species unknown"} {pet.breed ? `· ${pet.breed}` : ""}
                </p>
                <p className="text-sm text-gray-500">Owner: {pet.owner?.name || "Unknown"}</p>
                <p className="text-sm text-gray-400 mt-2">
                  Last visit: {pet.lastVisit ? new Date(pet.lastVisit).toLocaleDateString() : "—"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}