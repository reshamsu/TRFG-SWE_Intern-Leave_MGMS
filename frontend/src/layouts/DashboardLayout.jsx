import { Outlet } from "react-router-dom";
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({ role }) {
  return (
    <div className="min-h-screen bg-red-50">

      {/* Sidebar receives the role */}
      <Sidebar role={role} />

      {/* Main application area */}
      <div className="ml-64">

        {/* Header */}
        <header className="fixed left-64 right-0 top-0 z-30 flex h-20 items-center border-b bg-white px-10">
          <h1 className="text-xl font-semibold">
            {role === "admin"
              ? "Admin Portal"
              : "Employee Portal"}
          </h1>
        </header>

        {/* Current route gets rendered here */}
        <main className="pt-20">
          <Outlet />
        </main>

      </div>
    </div>
  );
}