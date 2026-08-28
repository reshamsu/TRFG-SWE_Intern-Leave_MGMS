import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";

import EmployeeDashboard from "./pages/employee/Dashboard";
import ApplyLeave from "./pages/employee/ApplyLeave";
import DashboardLayout from "./layouts/DashboardLayout";
import LeaveHistory from "./pages/employee/LeaveHistory";

import AdminDashboard from "./pages/admin/Dashboard";
import LeaveRequests from "./pages/admin/LeaveRequests";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Entry point */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />

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
        </Route>

        {/* Unknown URL */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
