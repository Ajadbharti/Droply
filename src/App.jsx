import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Settings from "./pages/Settings";

function Home() {
  return (
    <main
      className="min-h-[calc(100vh-73px)] px-6 py-20"
      style={{
        backgroundColor: "var(--bg)",
        color: "var(--text)",
      }}
    >
      <div className="mx-auto max-w-5xl text-center">

        <p
          className="mb-4 font-medium"
          style={{
            color: "rgb(var(--primary))",
          }}
        >
          Fast • Private • Temporary
        </p>

        <h1 className="text-5xl font-bold tracking-tight md:text-7xl">
          Drop anything.
          <br />

          <span
            style={{
              color: "rgb(var(--primary))",
            }}
          >
            Share anywhere.
          </span>
        </h1>

        <p
          className="mx-auto mt-6 max-w-2xl text-lg"
          style={{
            color: "var(--muted)",
          }}
        >
          Share files, text, code and links instantly
          without complicated setup.
        </p>

      </div>
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>

      <Navbar />

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/settings"
          element={<Settings />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;