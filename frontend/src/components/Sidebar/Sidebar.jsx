import "./sidebar.css";
import { NavLink } from "react-router-dom";

import {
  FiHome,
  FiImage,
  FiClock,
  FiFolder,
  FiHeart,
  FiUser,
  FiSettings,
  FiZap,
  FiEdit3,
} from "react-icons/fi";

function Sidebar() {
  const menus = [
    {
      name: "Dashboard",
      icon: <FiHome />,
      path: "/",
    },
    {
      name: "AI Studio",
      icon: <FiImage />,
      path: "/studio",
    },
    {
      name: "AI Image Editor",
      icon: <FiEdit3 />,
      path: "/image-editor",
    },
    {
      name: "History",
      icon: <FiClock />,
      path: "/history",
    },
    {
      name: "Projects",
      icon: <FiFolder />,
      path: "/projects",
    },
    {
      name: "Favorites",
      icon: <FiHeart />,
      path: "/favorites",
    },
    {
      name: "Profile",
      icon: <FiUser />,
      path: "/profile",
    },
    {
      name: "Settings",
      icon: <FiSettings />,
      path: "/settings",
    },
    {
      name: "Upgrade",
      icon: <FiZap />,
      path: "/upgrade",
    },
  ];

  return (
    <aside className="sidebar">
      <div className="menu">
        {menus.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              isActive ? "menu-item active" : "menu-item"
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </div>
    </aside>
  );
}
export default Sidebar;