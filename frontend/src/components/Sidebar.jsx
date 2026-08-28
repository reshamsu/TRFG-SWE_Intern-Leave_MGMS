import { LucideLogOut } from "lucide-react";
import SideLink from "../constants/SideLinks";

export default function Sidebar({ role }) {
  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r bg-white p-5 shadow-md">

      {/* Brand */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold">
          Empl Mgms
        </h3>

        <p className="text-sm text-muted-foreground">
          Leave Management
        </p>
      </div>

      {/* Navigation */}
      <div className="flex-1">
        <SideLink role={role} />
      </div>

      {/* User / Logout */}
      <div className="border-t pt-4">
        <button
          type="button"
          className="flex justify-between items-center w-full rounded-lg px-4 py-2 text-left text-sm font-medium text-muted-foreground transition-transform hover:bg-muted hover:text-foreground"
        >
          Logout <LucideLogOut className="hover:text-red-500 " size={16}/>
        </button>
      </div>

    </aside>
  );
}