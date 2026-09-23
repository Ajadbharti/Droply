import { Link } from "react-router-dom";
import {
  Moon,
  Sun,
  Settings,
} from "lucide-react";

import { useTheme } from "../context/ThemeContext";

function Navbar() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(
      theme === "dark"
        ? "light"
        : "dark"
    );
  };

  return (
    <nav
      className="border-b"
      style={{
        borderColor: "var(--border)",
        backgroundColor: "var(--bg)",
      }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold"
          style={{
            color: "rgb(var(--primary))",
          }}
        >
          Droply
        </Link>

        {/* Right */}
        <div className="flex items-center gap-2">

          {/* Theme */}
          <button
            onClick={toggleTheme}
            className="rounded-xl border p-2.5 transition hover:scale-105"
            style={{
              borderColor: "var(--border)",
              color: "var(--text)",
            }}
            title="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun size={19} />
            ) : (
              <Moon size={19} />
            )}
          </button>

          {/* Settings */}
          <Link
            to="/settings"
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 font-medium text-white transition hover:opacity-90"
            style={{
              backgroundColor: "rgb(var(--primary))",
            }}
          >
            <Settings size={18} />

            <span className="hidden sm:inline">
              Settings
            </span>
          </Link>

        </div>

      </div>
    </nav>
  );
}

export default Navbar;