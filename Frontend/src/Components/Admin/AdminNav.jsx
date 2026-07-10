import { NavLink } from "react-router-dom";
import { BookOpen, LayoutDashboard, ReceiptText, Tag, Users } from "lucide-react";

const links = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/students", label: "Students", icon: Users },
  { to: "/admin/courses", label: "Courses", icon: BookOpen },
  { to: "/admin/coupons", label: "Coupons", icon: Tag },
  { to: "/admin/orders", label: "Orders", icon: ReceiptText },
];

export default function AdminNav() {
  return (
    <nav className="mb-8 flex gap-2 overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.035] p-2 backdrop-blur-2xl no-scrollbar">
      {links.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) => `flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition ${isActive ? "bg-orange-500 text-white shadow-[0_8px_25px_rgba(249,115,22,.25)]" : "text-white/60 hover:bg-white/10 hover:text-white"}`}
        >
          <Icon size={17} />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
