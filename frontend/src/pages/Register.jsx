import { useState } from "react";
import { apiRequest } from "../services/api";
export default function Register({ setPage }) {
  const [form,setForm]=useState({full_name:"",email:"",mobile:"",date_of_birth:"",password:""}); const [message,setMessage]=useState("");
  async function submit(e){e.preventDefault();try{const d=await apiRequest("/auth/register",{method:"POST",body:JSON.stringify(form)});setMessage(d.message+". You can now log in.");}catch(err){setMessage(err.message)}}
  return <section className="form-panel"><h1>Voter Registration</h1><p>Only people aged 18 or above can register to vote.</p><form onSubmit={submit}>
  <label>Full name</label><input required value={form.full_name} onChange={e=>setForm({...form,full_name:e.target.value})}/>
  <label>Email</label><input type="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
  <label>Mobile number</label><input type="tel" pattern="[0-9]{10}" maxLength="10" required value={form.mobile} onChange={e=>setForm({...form,mobile:e.target.value})}/>
  <label>Date of birth</label><input type="date" required max={new Date().toISOString().slice(0,10)} value={form.date_of_birth} onChange={e=>setForm({...form,date_of_birth:e.target.value})}/>
  <label>Password (minimum 8 characters)</label><input type="password" minLength="8" required value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/>
  <button className="primary" type="submit">Register</button></form>{message&&<p className="notice">{message}</p>}<p>Already registered? <button className="text-button" onClick={()=>setPage("Login")}>Login</button></p></section>;
}
