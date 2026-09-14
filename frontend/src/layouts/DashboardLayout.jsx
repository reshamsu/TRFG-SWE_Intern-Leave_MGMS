import { Navigate, Outlet } from "react-router-dom"; // Added Navigate
import Sidebar from "@/components/Sidebar";
import { Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function DashboardLayout({ role }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const token = sessionStorage.getItem("token");
  const currentUserRole = sessionStorage.getItem("userRole"); // Takes and check the session token as userRole

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 3. Make the comparison case-insensitive to ensure a solid match
  if (currentUserRole?.toLowerCase() !== role?.toLowerCase()) {
    // console.warn(
    //   `Access Denied: Page requires ${role}, user is ${currentUserRole}`,
    // );
    return <Navigate to="/login" replace />;
  }

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
              className="lg:hidden cursor-pointer"
            />

            <h1 className="text-lg xl:text-xl font-semibold">
              {role === "admin" ? "Admin Panel" : "Employee Panel"}
            </h1>
          </span>

          <span className="flex items-center gap-6">
            <Field className="hidden md:flex">
              <ButtonGroup>
                <Input
                  id="input-button-group"
                  placeholder="Type to search..."
                  className="rounded-full px-4"
                />
                <Button>Search</Button>
              </ButtonGroup>
            </Field>

            <Button
              size="sm"
              onClick={() => console.log("Notifications clicked")} // FIXED: Changed from 0 to an arrow function
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
