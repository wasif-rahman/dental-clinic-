import "./globals.css";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { AuthProvider } from "../context/AuthContext";
import ProtectedRoute from "../components/ProtectedRoute";

export const metadata = {
  title: "Dental Clinic Management System",
  description: "Modern Dental Clinic Portal & Management System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)]">
            <Sidebar />
            <main className="flex-1 p-4 md:p-6 min-w-0">
              <ProtectedRoute>{children}</ProtectedRoute>
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
