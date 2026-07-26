import { Link } from "react-router-dom";

export default function TopNav() {
  return (
    <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 md:px-10 py-5 pointer-events-none">
      <span className="pointer-events-auto rounded-full bg-black/25 backdrop-blur-md border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.25em] font-medium text-white shadow-lg shadow-black/10">
        VetSphere
      </span>
      <Link
        to="/login"
        className="pointer-events-auto rounded-full bg-black/25 backdrop-blur-md border border-white/20 px-5 py-2.5 text-xs uppercase tracking-[0.2em] font-medium text-white shadow-lg shadow-black/10 hover:bg-black/40 transition-colors"
      >
        Login
      </Link>
    </nav>
  );
}