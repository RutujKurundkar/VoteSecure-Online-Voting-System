import { useState } from "react";
import { apiRequest } from "../services/api";
export default function Contact() {
  const [form, setForm] = useState({ sender_name: "", sender_email: "", subject: "", message: "" });
  const [notice, setNotice] = useState("");
  async function submit(e) {
    e.preventDefault();
    try {
      const data = await apiRequest("/contact", { method: "POST", body: JSON.stringify(form) });
      setNotice(data.message);
      setForm({ sender_name: "", sender_email: "", subject: "", message: "" });
    } catch (err) { setNotice(err.message); }
  }
  return <section className="form-panel"><h1>Contact Us</h1><p>Send the team a message.</p>
    <form onSubmit={submit}><label>Name</label><input required value={form.sender_name} onChange={e=>setForm({...form,sender_name:e.target.value})}/>
    <label>Email</label><input type="email" required value={form.sender_email} onChange={e=>setForm({...form,sender_email:e.target.value})}/>
    <label>Subject</label><input required value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})}/>
    <label>Message</label><textarea required rows="4" value={form.message} onChange={e=>setForm({...form,message:e.target.value})}/>
    <button className="primary">Send message</button></form>{notice && <p className="notice">{notice}</p>}</section>;
}
