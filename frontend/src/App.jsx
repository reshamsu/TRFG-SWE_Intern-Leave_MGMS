import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import Login from "./pages/Login";
// import Register from "./pages/Register";

import NotFound from "./pages/NotFound";

import DashboardLayout from "./layouts/DashboardLayout";

import EmployeeDashboard from "./pages/employee/Dashboard";
import ApplyLeave from "./pages/ApplyLeave";
import LeaveHistory from "./pages/employee/LeaveHistory";

import AdminDashboard from "./pages/admin/Dashboard";
import LeaveRequests from "./pages/admin/LeaveRequests";
import UserRequests from "./pages/admin/AllUsers";
import Profile from "./pages/Profile";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Entry point */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Authentication */}
          <Route path="/login" element={<Login />} />
          {/* <Route path="/register" element={<Register />} /> */}

          {/* Employee */}
          <Route element={<DashboardLayout role="employee" />}>
            <Route path="/dashboard/employee" element={<EmployeeDashboard />} />
            <Route
              path="/dashboard/employee/leave/new"
              element={<ApplyLeave />}
            />
            <Route
              path="/dashboard/employee/leave/history"
              element={<LeaveHistory />}
            />
            <Route
              path="/dashboard/employee/profile/edit"
              element={<Profile />}
            />
          </Route>

          {/* Admin */}
          <Route element={<DashboardLayout role="admin" />}>
            <Route path="/dashboard/admin" element={<AdminDashboard />} />
            <Route path="/dashboard/admin/leave/new" element={<ApplyLeave />} />
            <Route path="/dashboard/admin/leaves" element={<LeaveRequests />} />
            <Route path="/dashboard/admin/users" element={<UserRequests />} />
            <Route path="/dashboard/admin/profile/edit" element={<Profile />} />
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
