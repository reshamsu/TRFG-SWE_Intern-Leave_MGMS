import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FilePlus2,
  ClipboardList,
  User,
//   Users,
//   CheckCircle2,
} from "lucide-react";

const employeeLinks = [
  {
    label: "Dashboard",
    to: "/employee/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Apply for Leave",
    to: "/employee/leave/new",
    icon: FilePlus2,
  },
  {
    label: "My Leave History",
    to: "/employee/leave/history",
    icon: ClipboardList,
  },
];

const adminLinks = [
  {
    label: "Dashboard",
    to: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Leave Requests",
    to: "/admin/leaves",
    icon: ClipboardList,
  },
    {
    label: "All Users",
    to: "/admin/users",
    icon: User,
  },
];

export default function SideLink({ role }) {
  const links =
    role === "admin"
      ? adminLinks
      : employeeLinks;

  return (
    <nav className="space-y-1">
      {links.map((link) => {
        const Icon = link.icon;

        return (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`
            }
          >
            <Icon className="h-4 w-4" />
            <span>{link.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
