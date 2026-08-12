import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "./Layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import AIStudio from "./pages/AIStudio";
import ImageEditorPage from "./pages/ImageEditorPage";
import History from "./pages/History";
import Projects from "./pages/Projects";
import Profile from "./pages/Profile";
import Upgrade from "./pages/Upgrade";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/Notfound";
import Favorites from "./components/Favorites/Favorites";
import { AuthProvider } from "./auth/AuthContext";
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Authentication */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          {/* Main application */}
          <Route
            path="/*"
            element={
              <DashboardLayout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/studio" element={<AIStudio />} />
                  <Route
                    path="/image-editor"
                    element={<ImageEditorPage />}
                  />
                  <Route path="/history" element={<History />} />
                  <Route path="/favorites" element={<Favorites />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/upgrade" element={<Upgrade />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </DashboardLayout>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
export default App;