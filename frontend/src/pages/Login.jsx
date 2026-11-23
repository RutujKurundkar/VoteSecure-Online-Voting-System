import { useState } from "react";
import { apiRequest } from "../services/api";

export default function Login({ setPage, setUser }) {
  const [loginType, setLoginType] = useState("VOTER");
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  async function submit(e) {
    e.preventDefault();
    setMessage("");
    try {
      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ ...form, login_type: loginType })
      });
      localStorage.setItem("votesecure_token", data.token);
      setUser(data.user);
      setPage(data.user.role === "ADMIN" ? "AdminDashboard" : "VoterDashboard");
    } catch (err) { setMessage(err.message); }
  }

  return <section className="form-panel">
    <h1>{loginType === "ADMIN" ? "Admin Login" : "Voter Login"}</h1>
    <p>Select your account type and sign in.</p>
    <div className="actions wrap">
      <button type="button" className={loginType === "VOTER" ? "primary" : "secondary"} onClick={() => { setLoginType("VOTER"); setMessage(""); }}>Voter Login</button>
      <button type="button" className={loginType === "ADMIN" ? "primary" : "secondary"} onClick={() => { setLoginType("ADMIN"); setMessage(""); }}>Admin Login</button>
    </div>
    <form onSubmit={submit}>
      <label>Email</label><input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
      <label>Password</label><input type="password" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
      <button className="primary" type="submit">Login</button>
    </form>
    {message && <p className="notice" role="alert">{message}</p>}
    {loginType === "VOTER" && <p>New voter? <button className="text-button" onClick={() => setPage("Register")}>Register</button></p>}
    {loginType === "ADMIN" && <p>Admin accounts are created by the system administrator. Public admin registration is not available.</p>}
  </section>;
}
