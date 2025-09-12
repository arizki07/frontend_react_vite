import "./App.css";
import { ThemeProvider } from "./components/shared/theme-provider";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/login";
import DashboardPage from "./pages/dashboard";
import User from "./pages/users/user";
import ProtectedRoute from "./api/middleware/ProtectedRoute";
import Profile from "./pages/users/profile";
import AuditLogs from "./pages/auditLogs";
function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin", "user"]}>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <User />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={["admin", "user"]}>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/audit/logs"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AuditLogs />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
