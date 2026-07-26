import { ImageIcon } from "lucide-react";

const THEMES = {
  cream: { bg: "bg-gradient-to-br from-[#EFE7D8] to-[#E3D9C6]", border: "border-[#B5703A]/30", text: "text-[#3D3A34]/60" },
  purple: { bg: "bg-gradient-to-br from-[#C9B6E4] to-[#D8CDEF]", border: "border-white/50", text: "text-[#3D3A34]/60" },
  dark: { bg: "bg-gradient-to-br from-[#1E1B29] to-[#2C2440]", border: "border-white/15", text: "text-white/50" },
};

export default function PlaceholderFrame({
  label,
  theme = "cream",
  rounded = "rounded-[28px]",
  className = "",
  innerRef,
  src,
  alt,
}) {
  const t = THEMES[theme];

  if (src) {
    return (
      <div
        ref={innerRef}
        role="img"
        aria-label={alt || label}
        className={`bg-cover bg-center ${rounded} ${className}`}
        style={{ backgroundImage: `url(${src})` }}
      />
    );
  }

  return (
    <div
      ref={innerRef}
      className={`relative flex items-center justify-center border-2 border-dashed overflow-hidden ${t.bg} ${t.border} ${rounded} ${className}`}
    >
      <div className="flex flex-col items-center gap-3 px-6 text-center">
        <ImageIcon className={`w-6 h-6 ${t.text}`} strokeWidth={1.5} />
        <p className={`text-[11px] uppercase tracking-[0.18em] font-medium ${t.text}`}>
          {label}
        </p>
      </div>
    </div>
  );
}