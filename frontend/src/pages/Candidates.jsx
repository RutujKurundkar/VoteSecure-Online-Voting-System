import { useState } from "react";
import { apiRequest } from "../services/api";
export default function Candidates() {
  const [id, setId] = useState("");
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState("");
  async function load(e) {
    e.preventDefault();
    try { const data = await apiRequest(`/candidates/election/${Number(id)}`); setItems(data); setMessage(data.length ? "" : "No candidates found for this election."); }
    catch (err) { setMessage(err.message); }
  }
  return <section className="panel"><h1>Candidates</h1><form className="inline-form" onSubmit={load}><label>Election ID</label><input type="number" min="1" required value={id} onChange={e=>setId(e.target.value)}/><button className="primary">Load candidates</button></form>
    {message && <p>{message}</p>}<div className="list">{items.map(c=><article key={c.candidate_id}><h3>{c.candidate_name}</h3><p>{c.party_name || "Independent"} {c.party_symbol ? `· ${c.party_symbol}` : ""}</p><small>{c.candidate_description}</small></article>)}</div>
  </section>;
}
