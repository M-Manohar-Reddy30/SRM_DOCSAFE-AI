import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore, useThemeStore } from './store';
import { useEffect } from 'react';

// Placeholders for layouts and pages
const PublicLayout = ({ children }: { children: React.ReactNode }) => <div className="min-h-screen">{children}</div>;
const DashboardLayout = ({ children }: { children: React.ReactNode }) => <div className="min-h-screen flex bg-light-bg dark:bg-dark-bg">{children}</div>;

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

function App() {
  const isDark = useThemeStore((state) => state.isDark);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout><div>Landing Page</div></PublicLayout>} />
        <Route path="/login" element={<PublicLayout><div>Login Page</div></PublicLayout>} />
        <Route path="/signup" element={<PublicLayout><div>Signup Page</div></PublicLayout>} />

        {/* Protected Dashboard Routes */}
        <Route path="/app" element={<ProtectedRoute><DashboardLayout><OutletWrapper /></DashboardLayout></ProtectedRoute>}>
          <Route path="dashboard" element={<div>Dashboard Home</div>} />
          <Route path="documents" element={<div>Document Library</div>} />
          <Route path="upload" element={<div>Upload Center</div>} />
          <Route path="chat" element={<div>AI Chat</div>} />
          <Route path="notes" element={<div>AI Notes</div>} />
          <Route path="analytics" element={<div>Analytics</div>} />
          <Route path="career" element={<div>Career & Resume</div>} />
          <Route path="settings" element={<div>Settings</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

// Temporary wrapper since we didn't extract Layouts to separate files yet
import { Outlet } from 'react-router-dom';
const OutletWrapper = () => (
  <div className="flex-1 p-8">
    <Outlet />
  </div>
);

export default App;
