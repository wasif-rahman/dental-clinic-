import "./globals.css";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export const metadata = {
  title: "Dental Clinic Management System",
  description: "Intern build — Next.js frontend",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
