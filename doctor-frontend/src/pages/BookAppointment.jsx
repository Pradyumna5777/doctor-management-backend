import { useState, useEffect } from "react";
import axiosInstance from "../axiosInstance";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function BookAppointment() {
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: localStorage.getItem("email") || "", // pre-fill with logged-in email
    phone: "",
    doctor: "",
    date: "",
    time: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance
      .get("/doctors")
      .then((res) => {
        setDoctors(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch doctors.");
        setLoading(false);
      });
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dateTime = new Date(`${form.date}T${form.time}`);
      const appointmentData = {
        name: form.name,
        email: form.email, // email is included
        phone: form.phone,
        doctorId: form.doctor,
        date: dateTime,
      };

      await axiosInstance.post("/appointments", appointmentData);

      setMessage("Appointment booked successfully!");
      setForm({ ...form, name: "", phone: "", doctor: "", date: "", time: "" });
    } catch (err) {
      console.error(err);
      setMessage(
        "Failed to book appointment: " + (err.response?.data?.error || err.message)
      );
    }
  };

  const fadeInUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };
  const container = { hidden: {}, visible: { transition: { staggerChildren: 0.2 } } };

  if (loading) return <p className="text-center mt-10">Loading doctors...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto px-4">

      <motion.div
        className="bg-white rounded shadow mt-12 p-8"
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.h2
          className="text-3xl font-bold text-blue-800 mb-6 text-center"
          variants={fadeInUp}
        >
          Book an Appointment
        </motion.h2>

        {message && (
          <motion.p className="mb-4 text-green-600 text-center" variants={fadeInUp}>
            {message}
          </motion.p>
        )}

        <motion.form className="space-y-4" onSubmit={handleSubmit} variants={fadeInUp}>
          {/* Name field */}
          <motion.div variants={fadeInUp}>
            <input
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="Name"
              className="w-full p-3 border rounded"
              required
            />
          </motion.div>

          {/* Email field (disabled) */}
          <motion.div variants={fadeInUp}>
            <input
              name="email"
              type="email"
              value={form.email}
              disabled
              className="w-full p-3 border rounded bg-gray-100"
            />
          </motion.div>

          {/* Phone field */}
          <motion.div variants={fadeInUp}>
            <input
              name="phone"
              type="text"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone"
              className="w-full p-3 border rounded"
              required
            />
          </motion.div>

          {/* Date field */}
          <motion.div variants={fadeInUp}>
            <input
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              className="w-full p-3 border rounded"
              required
            />
          </motion.div>

          {/* Time field */}
          <motion.div variants={fadeInUp}>
            <input
              name="time"
              type="time"
              value={form.time}
              onChange={handleChange}
              className="w-full p-3 border rounded"
              required
            />
          </motion.div>

          {/* Doctor select */}
          <motion.div variants={fadeInUp}>
            <select
              name="doctor"
              value={form.doctor}
              onChange={handleChange}
              className="w-full p-3 border rounded"
              required
            >
              <option value="">Select Doctor</option>
              {doctors.map((doc) => (
                <option key={doc._id} value={doc._id}>
                  {doc.name} ({doc.specialty})
                </option>
              ))}
            </select>
          </motion.div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
            variants={fadeInUp}
          >
            Book Appointment
          </motion.button>
        </motion.form>

        <motion.button
          type="button"
          onClick={() => navigate("/patient/dashboard")}
          whileHover={{ scale: 1.05 }}
          className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 transition mt-4"
          variants={fadeInUp}
        >
          View All Appointments
        </motion.button>
      </motion.div>
    </div>
  );
}
