import { Outlet, Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth-store";
import { Sidebar } from "./sidebar";
import { Navbar } from "./navbar";

export function MainLayout() {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
