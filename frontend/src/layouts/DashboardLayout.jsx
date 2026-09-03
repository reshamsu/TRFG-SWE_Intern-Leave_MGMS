import { Outlet } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { Bell, Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function DashboardLayout({ role }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-red-50">
      <Sidebar role={role} isOpen={sidebarOpen} onClose={closeSidebar} />

      <div className="ml-0 lg:ml-64">
        {/* Header */}
        <header className="fixed left-0 lg:left-64 right-0 top-0 z-30 flex h-20 items-center justify-between border-b bg-white px-6 lg:px-10">
          <span className="flex items-center gap-3">
            <Menu
              size={22}
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden"
            />

            <h1 className="text-lg xl:text-xl font-semibold">
              {role === "admin" ? "Admin Panel" : "Employee Panel"}
            </h1>
          </span>

          <span className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={0}
              variant="outline"
              className="rounded-full px-3 py-5 gap-2 cursor-pointer hover:scale-105 hover:shadow-xl duration-700 transition-all"
            >
              <Search size={14} />
            </Button>

            <Button
              size="sm"
              onClick={0}
              variant="outline"
              className="rounded-full px-3 py-5 gap-2 cursor-pointer hover:scale-105 hover:shadow-xl duration-700 transition-all"
            >
              <Bell size={20} />
            </Button>
          </span>
        </header>

        <main className="pt-20">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
