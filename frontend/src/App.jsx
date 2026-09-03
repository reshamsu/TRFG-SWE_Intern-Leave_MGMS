import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

import DashboardLayout from "./layouts/DashboardLayout";

import EmployeeDashboard from "./pages/employee/Dashboard";
import ApplyLeave from "./pages/employee/ApplyLeave";
import LeaveHistory from "./pages/employee/LeaveHistory";

import AdminDashboard from "./pages/admin/Dashboard";
import LeaveRequests from "./pages/admin/LeaveRequests";
import UserRequests from "./pages/admin/UserRequests";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Entry point */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Authentication */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Employee */}
          <Route element={<DashboardLayout role="employee" />}>
            <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
            <Route path="/employee/leave/new" element={<ApplyLeave />} />
            <Route path="/employee/leave/history" element={<LeaveHistory />} />
          </Route>

          {/* Admin */}
          <Route element={<DashboardLayout role="admin" />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/leaves" element={<LeaveRequests />} />
            <Route path="/admin/users" element={<UserRequests />} />
          </Route>

          {/* Unknown URL */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>

      <Toaster position="top-right" richColors closeButton duration={4000} />
    </>
  );
}

export default App;
