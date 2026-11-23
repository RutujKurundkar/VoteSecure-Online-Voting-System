export default function Home({ setPage }) {
  return <section className="hero">
    <div className="eyebrow">ONLINE VOTING MANAGEMENT SYSTEM</div>
    <h1>Your vote.<br /><span>Your voice.</span></h1>
    <p>A student mini-project for managing elections, candidates, and voting records.</p>
    <div className="actions">
      <button className="primary" onClick={() => setPage("Register")}>Create Voter Account</button>
      <button className="secondary" onClick={() => setPage("Login")}>Sign In</button>
    </div>
    <div className="cards">
      <article><b>01 · Secure Access</b><p>Password hashing and token-based authentication starter.</p></article>
      <article><b>02 · Elections</b><p>View election information and candidate details.</p></article>
      <article><b>03 · Voting Integrity</b><p>Database constraint to prevent duplicate votes per election.</p></article>
    </div>
  </section>;
}
