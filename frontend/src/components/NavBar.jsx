import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ThemeChanger from "./ThemeChanger";

export default function NavBar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="navbar bg-base-100 px-6 shadow-md">
      <div className="flex-1">
        <span className="text-xl font-bold">ProjectX</span>
      </div>

      <div className="flex items-center gap-4">
        <ThemeChanger />

        {user ? (
          <div className="flex items-center gap-3">
            <div className="avatar">
              <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img
                  src={user.profileImage ? `http://localhost:3000${user.profileImage}` : "uploads/default-profile.png"}
                  alt="Pr`ofile"
                  onError={(e) => (e.target.src = "images/default-profile.png")}
                />
              </div>
            </div>
            <span className="font-medium text-base">{user.username}</span>
            <button
              className="btn btn-sm btn-outline btn-error"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            className="btn btn-sm btn-primary"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        )}
      </div>
    </div>
  );
}
