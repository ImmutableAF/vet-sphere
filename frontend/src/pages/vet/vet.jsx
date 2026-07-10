import { useContext } from "react"
import { AuthContext } from "../../context/AuthContext"
import { useNavigate, Outlet } from "react-router-dom"
import StaggeredMenu from "../../components/ui/StaggeredMenu"

function VetDashboardLayout() {
  const { handleLogout } = useContext(AuthContext)
  const navigate = useNavigate()

  const navItems = [
    { label: "Appointments", path: "/dashboard/vet/appointments" },
    { label: "My Patients", path: "/dashboard/vet/patients" },
    { label: "My Profile", path: "/dashboard/vet/profile" },
    { label: "Edit Profile", path: "/dashboard/vet/edit-profile" },
    { label: "Delete Account", path: "/dashboard/vet/delete-account" },
  ]

  const menuItems = navItems.map((item) => ({
    label: item.label,
    ariaLabel: `Go to ${item.label}`,
    onClick: () => navigate(item.path),
  }))

  const handleLogoutClick = () => {
    handleLogout()
    navigate("/")
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#FBF8F3] font-sans">

      <div className="flex items-center justify-between px-8 py-5 bg-white border-b border-[#F0EBE0] relative z-10">
        <div className="text-xl font-semibold text-[#3D3A34]">
          Vet<span className="text-[#7FA88A]">Sphere</span>
        </div>
      </div>

      <div style={{ position: "absolute", inset: 0, zIndex: 30, pointerEvents: "none" }}>
        <StaggeredMenu
          position="right"
          isFixed={true}
          items={menuItems}
          displaySocials={false}
          displayItemNumbering={false}
          menuButtonColor="#3D3A34"
          openMenuButtonColor="#3D3A34"
          changeMenuColorOnOpen={true}
          colors={["#E7F0E5", "#FBF8F3"]}
          logoText="VetSphere"
          accentColor="#7FA88A"
          footerItem={{
            label: "Logout",
            onClick: handleLogoutClick,
          }}
        />
      </div>

      <div
        className="absolute inset-0 overflow-y-auto px-8 py-8"
        style={{ top: "73px", scrollbarWidth: "none" }}
      >
        <Outlet />
      </div>

    </div>
  )
}

export default VetDashboardLayout