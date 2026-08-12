import Navbar from "../components/navbar/Navbar";
import Sidebar from "../components/sidebar/Sidebar";
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