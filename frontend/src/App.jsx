
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AddEvent from "./pages/AddEvent";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <nav className="navbar">
          <NavLink to="/" className="brand">
            <span className="brand-icon">✿</span>
            <span>EventSphere</span>
          </NavLink>

          <div className="nav-links">
            <NavLink to="/" end>
              Dashboard
            </NavLink>
            <NavLink to="/add-event">
              Add Event
            </NavLink>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add-event" element={<AddEvent />} />
          <Route
            path="/edit-event/:id"
            element={<AddEvent />}
          />
        </Routes>

        <footer className="footer">
          Made for moments that matter <span>♡</span>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
