import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";
export default function Elections() {
  const [elections, setElections] = useState([]);
  const [message, setMessage] = useState("Loading elections...");
  useEffect(() => {
    apiRequest("/elections/active").then(data => { setElections(data); setMessage(data.length ? "" : "No active elections at the moment."); })
      .catch(err => setMessage(err.message));
  }, []);
  return <section className="panel"><h1>Active Elections</h1>{message && <p>{message}</p>}
    <div className="list">{elections.map(e => <article key={e.election_id}><h3>{e.election_name}</h3><p>{e.description}</p><small>{e.start_time} – {e.end_time}</small></article>)}</div>
  </section>;
}
