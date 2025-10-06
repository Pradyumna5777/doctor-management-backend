import { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";

export default function AdminDashboard() {
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "doctor",
      specialty: "",   // ✅ add this
    image: null,
    id: null, // track editing
  });
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]); // 👈 add this
  const token = localStorage.getItem("token");
console.log("doctors",doctors);
const [apptPage, setApptPage] = useState(1);
const [apptPages, setApptPages] = useState(1);

const [msgPage, setMsgPage] = useState(1);
const [msgPages, setMsgPages] = useState(1);

// In AdminDashboard.js - replace the fetchData function
const fetchData = () => {
  axiosInstance
    .get("/doctors", { headers: { Authorization: `Bearer ${token}` } })
    .then((res) => setDoctors(res.data))
    .catch((err) => console.error(err));

axiosInstance
  .get(`/appointments?page=${apptPage}&limit=5`, { headers: { Authorization: `Bearer ${token}` } })
  .then(res => {
    setAppointments(res.data.appointments);
    setApptPages(res.data.pages);
  });

axiosInstance
  .get(`/contact?page=${msgPage}&limit=5`, { headers: { Authorization: `Bearer ${token}` } })
  .then(res => {
    setMessages(res.data.messages);
    setMsgPages(res.data.pages);
  });

};

  useEffect(() => fetchData(), [apptPage, msgPage]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      setMessage('Please select an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB
      setMessage('Image size should be less than 5MB');
      return;
    }
    setForm({ ...form, image: file });
  } else {
    setForm({ ...form, image: null });
  }
};

const handleSubmit = async (e) => {
  e.preventDefault();
  if (form.id) return handleUpdate();

   // Check if token exists and is valid
  if (!token) {
    setMessage("Please log in again");
    return;
  }
  
  try {
    // Debug: Check form values
    console.log('Form values:', {
      name: form.name,
      email: form.email,
      password: form.password,
      role: form.role,
      image: form.image
    });

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("password", form.password);
    formData.append("specialty", form.specialty);
    formData.append("role", form.role);
    
    // Debug FormData
    if (form.image) {
      formData.append("image", form.image);
      console.log('Image appended:', form.image.name, form.image.type, form.image.size);
    }

    // Log FormData contents
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    const res = await axiosInstance.post("/doctors", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    setMessage(res.data.message);
    setForm({
      name: "",
      email: "",
      password: "",
      role: "doctor",
        specialty: "", // Add this
      image: null,
      id: null,
    });
    fetchData();
  } catch (err) {
    console.error('Full error object:', err);
    console.error('Response data:', err.response?.data);
    console.error('Response status:', err.response?.status);
    setMessage(err.response?.data?.error || "Failed to create doctor");
  }
};

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    await axiosInstance.delete(`/doctors/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchData();
  };

  const handleEdit = (doctor) => {
    setForm({
      name: doctor.name,
      email: doctor.email,
      password: "",
      role: doctor.role,
          specialty: doctor.specialty || "",  // ✅ include specialty
      image: null,
      id: doctor._id,
    });
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      if (form.password) formData.append("password", form.password);
      formData.append("role", form.role);
      if (form.image) formData.append("image", form.image);
      formData.append("specialty", form.specialty);

      await axiosInstance.put(`/doctors/${form.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage("Doctor updated successfully!");
      setForm({
        name: "",
        email: "",
        password: "",
        role: "doctor",
        image: null,
        id: null,
      });
      fetchData();
    } catch (err) {
      console.error(err);
      setMessage("Failed to update doctor");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-8 md:p-16">
      <h2 className="text-3xl font-bold text-blue-800 mb-8">Admin Dashboard</h2>

      {/* Add/Edit Doctor Form */}
      <section className="mb-12 bg-white p-6 rounded shadow">
        <h3 className="text-2xl font-semibold mb-4">
          {form.id ? "Edit Doctor/Admin" : "Add Doctor/Admin"}
        </h3>
        {message && (
          <p
            className={`mb-4 text-center ${
              message.includes("success") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          onSubmit={handleSubmit}
        >
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full p-3 border rounded"
            required
          />
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-3 border rounded"
            required
          />
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder={
              form.id ? "Leave blank to keep current password" : "Password"
            }
            className="w-full p-3 border rounded"
          />
<input
  name="specialty"
  value={form.specialty}
  onChange={handleChange}
  placeholder="Specialty"
  className="w-full p-3 border rounded"
/>
          <input
            type="file"
            name="image"
            onChange={handleFileChange}
            className="w-full p-2 border rounded"
          />
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full p-3 border rounded"
            required
          >
            <option value="doctor">Doctor</option>
            <option value="admin">Admin</option>
          </select>
          <button
            type="submit"
            className="w-full md:col-span-2 bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
          >
            {form.id ? "Update User" : "Create User"}
          </button>
        </form>
      </section>

      {/* Doctors/Admins List */}
      <section className="mb-12">
        <h3 className="text-2xl font-semibold mb-4">Doctors/Admins</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {doctors.map((doc) => (
            <div key={doc._id} className="bg-white p-4 rounded shadow relative">
              {doc.image && (
                <img
                  src={doc.image}
                  alt={doc.name}
                  className="w-24 h-24 rounded-full mb-2"
                />
              )}
              <h4 className="font-bold">{doc.name}</h4>
              <p className="text-gray-600">{doc.specialty || "N/A"}</p>
              <p className="text-sm text-gray-500 capitalize">
                Role: {doc.role}
              </p>
              <div className="absolute top-2 right-2 flex space-x-2">
                <button
                  className="bg-yellow-400 text-white px-2 py-1 rounded"
                  onClick={() => handleEdit(doc)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => handleDelete(doc._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Appointments Section */}
      <section>
        <h3 className="text-2xl font-semibold mb-4">Appointments</h3>
        <div className="overflow-x-auto">
          <table className="w-full table-auto border">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="px-4 py-2">Patient</th>
                <th className="px-4 py-2">Doctor</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Phone</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt) => (
                <tr key={appt._id} className="border-b">
                  <td className="px-4 py-2">{appt.name}</td>
                  <td className="px-4 py-2">{appt.doctor?.name}</td>
                  <td className="px-4 py-2">
                    {new Date(appt.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">{appt.email}</td>
                  <td className="px-4 py-2">{appt.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Appointments Pagination */}
<div className="flex justify-center mt-4 space-x-2">
  <button
    disabled={apptPage === 1}
    onClick={() => setApptPage(apptPage - 1)}
    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
  >
    Prev
  </button>
  <span>Page {apptPage} of {apptPages}</span>
  <button
    disabled={apptPage === apptPages}
    onClick={() => setApptPage(apptPage + 1)}
    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
  >
    Next
  </button>
</div>

        </div>
      </section>

      {/* Contact Messages Section */}
<section className="mt-12">
  <h3 className="text-2xl font-semibold mb-4">Contact Messages</h3>
  <div className="overflow-x-auto bg-white shadow-md rounded-lg">
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-blue-100 text-left">
          <th className="p-3 border">Name</th>
          <th className="p-3 border">Email</th>
          <th className="p-3 border">Subject</th>
          <th className="p-3 border">Message</th>
          <th className="p-3 border">Date</th>
        </tr>
      </thead>
      <tbody>
        {messages.length > 0 ? (
          messages.map((msg) => (
            <tr key={msg._id} className="hover:bg-gray-50">
              <td className="p-3 border">{msg.name}</td>
              <td className="p-3 border">{msg.email}</td>
              <td className="p-3 border">{msg.subject}</td>
              <td className="p-3 border">{msg.message}</td>
              <td className="p-3 border">
                {new Date(msg.createdAt).toLocaleString()}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td className="p-3 border text-center" colSpan="5">
              No messages yet
            </td>
          </tr>
        )}
      </tbody>
    </table>
    {/* Appointments Pagination */}
<div className="flex justify-center mt-4 space-x-2">
  <button
    disabled={apptPage === 1}
    onClick={() => setApptPage(apptPage - 1)}
    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
  >
    Prev
  </button>
  <span>Page {apptPage} of {apptPages}</span>
  <button
    disabled={apptPage === apptPages}
    onClick={() => setApptPage(apptPage + 1)}
    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
  >
    Next
  </button>
</div>

  </div>
</section>

    </div>
  );
}
