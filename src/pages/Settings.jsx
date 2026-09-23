import {
  Moon,
  Sun,
  Monitor,
  Check,
  Palette,
} from "lucide-react";

import { useTheme } from "../context/ThemeContext";

function Settings() {
  const {
    theme,
    setTheme,
    accent,
    setAccent,
    customColor,
    setCustomColor,
  } = useTheme();

  const colors = [
    {
      name: "blue",
      value: "#2563eb",
    },
    {
      name: "purple",
      value: "#8b5cf6",
    },
    {
      name: "green",
      value: "#22c55e",
    },
    {
      name: "orange",
      value: "#f97316",
    },
    {
      name: "red",
      value: "#ef4444",
    },
    {
      name: "pink",
      value: "#ec4899",
    },
  ];

  return (
    <main
      className="min-h-[calc(100vh-73px)] px-6 py-10"
      style={{
        backgroundColor: "var(--bg)",
        color: "var(--text)",
      }}
    >
      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <div className="mb-10">
          <div className="mb-3 flex items-center gap-3">
            <Palette
              size={30}
              style={{
                color: "rgb(var(--primary))",
              }}
            />

            <h1 className="text-3xl font-bold">
              Appearance
            </h1>
          </div>

          <p
            style={{
              color: "var(--muted)",
            }}
          >
            Customize how Droply looks on your device.
          </p>
        </div>

        {/* Theme */}
        <section
          className="mb-8 rounded-2xl border p-6"
          style={{
            backgroundColor: "var(--surface)",
            borderColor: "var(--border)",
          }}
        >
          <h2 className="mb-2 text-xl font-semibold">
            Theme
          </h2>

          <p
            className="mb-6 text-sm"
            style={{
              color: "var(--muted)",
            }}
          >
            Choose how Droply should appear.
          </p>

          <div className="grid gap-4 md:grid-cols-3">

            {/* Light */}
            <button
              onClick={() => setTheme("light")}
              className="relative rounded-xl border p-5 text-left transition hover:scale-[1.02]"
              style={{
                borderColor:
                  theme === "light"
                    ? "rgb(var(--primary))"
                    : "var(--border)",
              }}
            >
              {theme === "light" && (
                <Check
                  className="absolute right-4 top-4"
                  size={20}
                  style={{
                    color: "rgb(var(--primary))",
                  }}
                />
              )}

              <Sun size={28} />

              <h3 className="mt-4 font-semibold">
                Light
              </h3>

              <p
                className="mt-1 text-sm"
                style={{
                  color: "var(--muted)",
                }}
              >
                Bright appearance
              </p>
            </button>

            {/* Dark */}
            <button
              onClick={() => setTheme("dark")}
              className="relative rounded-xl border p-5 text-left transition hover:scale-[1.02]"
              style={{
                borderColor:
                  theme === "dark"
                    ? "rgb(var(--primary))"
                    : "var(--border)",
              }}
            >
              {theme === "dark" && (
                <Check
                  className="absolute right-4 top-4"
                  size={20}
                  style={{
                    color: "rgb(var(--primary))",
                  }}
                />
              )}

              <Moon size={28} />

              <h3 className="mt-4 font-semibold">
                Dark
              </h3>

              <p
                className="mt-1 text-sm"
                style={{
                  color: "var(--muted)",
                }}
              >
                Easy on the eyes
              </p>
            </button>

            {/* System */}
            <button
              onClick={() => setTheme("system")}
              className="relative rounded-xl border p-5 text-left transition hover:scale-[1.02]"
              style={{
                borderColor:
                  theme === "system"
                    ? "rgb(var(--primary))"
                    : "var(--border)",
              }}
            >
              {theme === "system" && (
                <Check
                  className="absolute right-4 top-4"
                  size={20}
                  style={{
                    color: "rgb(var(--primary))",
                  }}
                />
              )}

              <Monitor size={28} />

              <h3 className="mt-4 font-semibold">
                System
              </h3>

              <p
                className="mt-1 text-sm"
                style={{
                  color: "var(--muted)",
                }}
              >
                Follow device settings
              </p>
            </button>

          </div>
        </section>

        {/* Accent Colors */}
        <section
          className="rounded-2xl border p-6"
          style={{
            backgroundColor: "var(--surface)",
            borderColor: "var(--border)",
          }}
        >
          <h2 className="mb-2 text-xl font-semibold">
            Accent Color
          </h2>

          <p
            className="mb-6 text-sm"
            style={{
              color: "var(--muted)",
            }}
          >
            Choose your favorite color for Droply.
          </p>

          <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">

            {colors.map((color) => (
              <button
                key={color.name}
                onClick={() => setAccent(color.name)}
                className="group relative flex flex-col items-center gap-2 rounded-xl border p-3 transition hover:scale-105"
                style={{
                  borderColor:
                    accent === color.name
                      ? color.value
                      : "var(--border)",
                }}
              >
                <span
                  className="h-10 w-10 rounded-full"
                  style={{
                    backgroundColor: color.value,
                  }}
                />

                <span className="text-sm capitalize">
                  {color.name}
                </span>

                {accent === color.name && (
                  <span
                    className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full text-white"
                    style={{
                      backgroundColor: color.value,
                    }}
                  >
                    <Check size={13} />
                  </span>
                )}
              </button>
            ))}

          </div>

          {/* Custom */}
          <div className="mt-8 border-t pt-6">
            <h3 className="mb-4 font-semibold">
              Custom Color
            </h3>

            <div className="flex flex-wrap items-center gap-4">

              <input
                type="color"
                value={customColor}
                onChange={(e) => {
                  setCustomColor(e.target.value);
                  setAccent("custom");
                }}
                className="h-12 w-16 cursor-pointer rounded-lg border"
              />

              <input
                type="text"
                value={customColor}
                onChange={(e) => {
                  setCustomColor(e.target.value);
                  setAccent("custom");
                }}
                className="rounded-xl border px-4 py-3 outline-none"
                style={{
                  backgroundColor: "var(--bg)",
                  borderColor: "var(--border)",
                  color: "var(--text)",
                }}
              />

              <div
                className="rounded-xl px-5 py-3 font-medium text-white"
                style={{
                  backgroundColor: "rgb(var(--primary))",
                }}
              >
                Preview
              </div>

            </div>
          </div>

        </section>

      </div>
    </main>
  );
}

export default Settings;