import { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";
import { motion } from "framer-motion";
import { FaCalendarAlt, FaClock, FaPhoneAlt, FaUserMd } from "react-icons/fa";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export default function PatientDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    axiosInstance
      .get("/appointments", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => setAppointments(res.data.appointments))
      .catch((err) =>
        console.error("Error fetching appointments:", err.response?.data || err)
      );

    // Fetch doctors for edit dropdown
    axiosInstance
      .get("/doctors")
      .then((res) => setDoctors(res.data))
      .catch((err) => console.error("Error fetching doctors:", err.response?.data || err));
  }, []);

  const fadeInUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

  const handleCancel = async (id) => {
    const confirm = await MySwal.fire({
      title: "Are you sure?",
      text: "Do you want to cancel this appointment?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel it!",
      cancelButtonText: "No",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axiosInstance.put(`/appointments/cancel/${id}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setAppointments((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status: "cancelled" } : a))
      );
      MySwal.fire("Cancelled!", "Your appointment has been cancelled.", "success");
    } catch (err) {
      console.error("Cancel error:", err.response?.data || err.message);
      MySwal.fire("Error", "Failed to cancel appointment", "error");
    }
  };


  return (
    <motion.div
      className="max-w-5xl mx-auto p-6 md:p-12"
      initial="hidden"
      animate="visible"
      transition={{ staggerChildren: 0.1 }}
    >
      <motion.h2
        className="text-3xl md:text-4xl font-bold text-blue-800 mb-10 text-center"
        variants={fadeInUp}
      >
        My Appointments
      </motion.h2>

      {appointments.length === 0 ? (
        <motion.p className="text-center text-gray-500" variants={fadeInUp}>
          No appointments booked yet.
        </motion.p>
      ) : (
        <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6" variants={fadeInUp}>
          {appointments.map((appt) => {
            const apptDate = new Date(appt.date);
            const dateStr = apptDate.toLocaleDateString();
            const timeStr = apptDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

            return (
              <motion.div
                key={appt._id}
                className="bg-white rounded-lg shadow-md p-5 hover:shadow-xl transition cursor-pointer"
                variants={fadeInUp}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center mb-3">
                  <FaUserMd className="text-blue-600 text-xl mr-2" />
                  <h3 className="text-xl font-semibold">{appt.doctor?.name}</h3>
                </div>

                <div className="flex items-center mb-2 text-gray-600">
                  <FaCalendarAlt className="mr-2" />
                  <span>{dateStr}</span>
                </div>

                <div className="flex items-center mb-2 text-gray-600">
                  <FaClock className="mr-2" />
                  <span>{timeStr}</span>
                </div>

                <div className="flex items-center text-gray-600">
                  <FaPhoneAlt className="mr-2" />
                  <span>{appt.phone}</span>
                </div>

                <div className="flex justify-between mt-4">
                  {appt.status !== "cancelled" && (
                    <>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        onClick={() => handleCancel(appt._id)}
                      >
                        Cancel
                      </button>
                      
                    </>
                  )}
                  {appt.status === "cancelled" && (
                    <span className="text-red-600 font-bold">Cancelled</span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </motion.div>
  );
}
