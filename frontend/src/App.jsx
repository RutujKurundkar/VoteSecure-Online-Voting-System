import { useState } from "react";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import VoterDashboard from "./pages/VoterDashboard.jsx";
import Elections from "./pages/Elections.jsx";
import Candidates from "./pages/Candidates.jsx";
import Results from "./pages/Results.jsx";
import Profile from "./pages/Profile.jsx";

const pages = {
  Home, Login, Register, About, Contact,
  AdminDashboard, VoterDashboard, Elections, Candidates, Results, Profile
};

export default function App() {
  const [page, setPage] = useState("Home");
  const [user, setUser] = useState(null);
  const Page = pages[page] || Home;
  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={() => setPage("Home")}>◈ VoteSecure</button>
        <nav>
          {["Home", "Elections", "Results", "About", "Contact"].map((name) =>
            <button key={name} onClick={() => setPage(name)}>{name}</button>
          )}
          {user?.role === "ADMIN" && <button onClick={() => setPage("AdminDashboard")}>Admin</button>}
          {user?.role === "VOTER" && <><button onClick={() => setPage("VoterDashboard")}>Dashboard</button><button onClick={() => setPage("Profile")}>My Profile</button></>}
          {!user && <><button onClick={() => setPage("Login")}>Login</button><button className="nav-cta" onClick={() => setPage("Register")}>Register</button></>}
          {user && <button onClick={() => { localStorage.removeItem("votesecure_token"); setUser(null); setPage("Home"); }}>Logout</button>}
        </nav>
      </header>
      <main>
        <Page setPage={setPage} user={user} setUser={setUser} />
      </main>
      <footer>VoteSecure · Educational mini project</footer>
    </div>
  );
}
