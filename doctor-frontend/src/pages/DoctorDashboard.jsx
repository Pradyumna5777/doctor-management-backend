import { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const doctorName = localStorage.getItem("name"); // store name on login

 // DoctorDashboard.js - Replace the useEffect
// In DoctorDashboard.js - replace the useEffect
useEffect(() => {
  axiosInstance.get("/appointments", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  })
    .then(res => {
      setAppointments(res.data);
    })
    .catch(err => console.error(err));
}, []);

  return (
    <div className="max-w-4xl mx-auto p-8 md:p-16">
      <h2 className="text-3xl font-bold text-blue-800 mb-8">Doctor Dashboard</h2>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="px-4 py-2">Patient</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Phone</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map(appt => (
              <tr key={appt._id} className="border-b">
                <td className="px-4 py-2">{appt.name}</td>
                <td className="px-4 py-2">{new Date(appt.date).toLocaleDateString()}</td>
                <td className="px-4 py-2">{appt.email}</td>
                <td className="px-4 py-2">{appt.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
