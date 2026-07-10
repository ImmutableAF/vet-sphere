import { useContext } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import LoginPage from "../pages/auth/LoginPage"
import RegisterPage from "../pages/auth/RegisterPage"
import OwnerDashboard from "../pages/owner/owner"
import OwnerOverview from "../pages/owner/OwnerOverview"
import OwnerPets from "../pages/owner/OwnerPets"
import OwnerVets from "../pages/owner/OwnerVets"
import OwnerBook from "../pages/owner/OwnerBook"
import OwnerAppointments from "../pages/owner/OwnerAppointments"
import VetDashboardLayout from "../pages/vet/vet";
import VetAppointments from "../pages/vet/vetAppointments";
import VetPatients from "../pages/vet/vetPatients";
import VetProfile from "../pages/vet/vetProfile";
import VerifyVetPage from "../pages/vet/verifyVetPage"
import EditVetProfile from "../pages/vet/editVetProfile"
import AdminDashboardLayout from "../pages/admin/admin"
import ManageVets from "../pages/admin/manageVets"
import DeleteAccountPage from "../pages/shared/deleteAccount"

function AppRouter() {
  const { currentUser } = useContext(AuthContext)

  const isOwner = currentUser?.role === "owner"
  const isVet = currentUser?.role === "vet"
  const isAdmin = currentUser?.role === "admin"

  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/dashboard/owner"
        element={isOwner ? <OwnerDashboard /> : <Navigate to="/" />}
      >
        <Route index element={<OwnerOverview />} />
        <Route path="pets" element={<OwnerPets />} />
        <Route path="vets" element={<OwnerVets />} />
        <Route path="book" element={<OwnerBook />} />
        <Route path="appointments" element={<OwnerAppointments />} />
        <Route path="delete-account" element={<DeleteAccountPage />} />
      </Route>

      <Route
        path="/dashboard/vet"
        element={isVet ? <VetDashboardLayout /> : <Navigate to="/" />}
      >
        <Route index element={<VetAppointments />} />
        <Route path="appointments" element={<VetAppointments />} />
        <Route path="patients" element={<VetPatients />} />
        <Route path="profile" element={<VetProfile />} />
        <Route path="verify" element={<VerifyVetPage />} />
        <Route path="edit-profile" element={<EditVetProfile />} />
        <Route path="delete-account" element={<DeleteAccountPage />} />
      </Route>

      <Route
        path="/dashboard/admin"
        element={isAdmin ? <AdminDashboardLayout /> : <Navigate to="/" />}
      >
        <Route index element={<ManageVets />} />
        <Route path="vets" element={<ManageVets />} />
      </Route>
    </Routes>
  )
}

export default AppRouter