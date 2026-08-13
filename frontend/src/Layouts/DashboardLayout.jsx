import Navbar from "../components/Navbar/Navbar";
import Sidebar from "../components/Sidebar/Sidebar";
import "./DashboardLayout.css";
function DashboardLayout({ children }) {
  return (
    <>
      <Navbar />
      <div className="dashboard-layout">
        <Sidebar />
        <main className="dashboard-content">
          {children}
        </main>
      </div>
    </>
  );
}
export default DashboardLayout;