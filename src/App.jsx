import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import CreateShare from "./pages/CreateShare";
import JoinShare from "./pages/JoinShare";
import Settings from "./pages/Settings";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* Home Page */}
        <Route
          path="/"
          element={<Home />}
        />

        {/* Create Share */}
        <Route
          path="/create"
          element={<CreateShare />}
        />

        {/* Join Share */}
        <Route
          path="/join"
          element={<JoinShare />}
        />

        {/* Settings */}
        <Route
          path="/settings"
          element={<Settings />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;