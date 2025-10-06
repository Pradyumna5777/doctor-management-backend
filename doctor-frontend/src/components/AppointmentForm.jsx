import React, {useState} from 'react'
import axios from 'axios'


export default function AppointmentForm({doctorId}){
const [form, setForm] = useState({name:'', phone:'', email:'', date:'', note:''})
const [status, setStatus] = useState('')


const submit = async (e)=>{
e.preventDefault()
try{
const res = await axios.post('/api/appointments', {...form, doctor: doctorId})
setStatus('Appointment booked successfully')
setForm({name:'', phone:'', email:'', date:'', note:''})
}catch(err){
setStatus('Error booking appointment')
}
}


return (
<form onSubmit={submit} className="space-y-3 max-w-md">
<input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Full name" required className="w-full p-2 border rounded" />
<input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="Phone" required className="w-full p-2 border rounded" />
<input value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="Email" className="w-full p-2 border rounded" />
<input type="datetime-local" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} required className="w-full p-2 border rounded" />
<textarea value={form.note} onChange={e=>setForm({...form,note:e.target.value})} placeholder="Notes (optional)" className="w-full p-2 border rounded" />
<button className="bg-sky-600 text-white px-4 py-2 rounded">Book Appointment</button>
{status && <p className="text-sm mt-2">{status}</p>}
</form>
)
}