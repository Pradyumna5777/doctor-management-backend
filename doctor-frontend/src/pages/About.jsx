import { motion } from "framer-motion";

export default function About() {
  const doctors = [
    {
      name: "Dr. Pankaj Kumar Chaurasiya",
      qualifications: "B.A.M.S. (Ranchi), P.G.C.H. (Mumbai)",
      specialization: "Physician & Pediatrician",
      image: "/images/hos1.png",
    },
    {
      name: "Dr. Anita Chaurasiya",
      qualifications: "B.H.M.S. (Nasik), C.C.H. & C.G.O. (Mumbai)",
      specialization: "Gynecologist and Obstetrician",
      image: "/images/hosss.png",
    },
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="max-w-6xl mx-auto p-8 md:p-16"
      initial="hidden"
      animate="visible"
      transition={{ staggerChildren: 0.2 }}
    >
      <motion.h2
        className="text-4xl font-bold text-blue-800 mb-12 text-center"
        variants={fadeInUp}
      >
        About Us
      </motion.h2>

      <motion.p
        className="text-gray-700 mb-6 text-center max-w-3xl mx-auto"
        variants={fadeInUp}
      >
        At Madhuri Nidan Kendra Clinic, we have been delivering exceptional
        healthcare for over a decade. Our expert doctors and dedicated medical
        staff ensure every patient receives personalized, effective care in a
        comfortable and safe environment.
      </motion.p>

      <motion.p
        className="text-gray-700 mb-12 text-center max-w-3xl mx-auto"
        variants={fadeInUp}
      >
        Equipped with modern facilities and state-of-the-art equipment, our
        clinic provides accurate diagnosis and advanced treatments. Experience
        healthcare that truly cares, guided by the expertise of Dr. Pankaj and
        Dr. Anita.
      </motion.p>

      <motion.h3
        className="text-3xl font-semibold text-blue-700 mb-8 text-center"
        variants={fadeInUp}
      >
        Meet the Founders
      </motion.h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {doctors.map((doctor) => (
          <motion.div
            key={doctor.name}
            className="flex flex-col items-center text-center bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300"
            variants={fadeInUp}
            whileHover={{ scale: 1.03 }}
          >
            <img
              src={doctor.image}
              alt={doctor.name}
              className="w-40 h-40 object-cover rounded-full mb-4 border-4 border-blue-200"
            />
            <h4 className="text-xl font-bold text-gray-800">{doctor.name}</h4>
            <p className="text-gray-600 mt-2">{doctor.qualifications}</p>
            <span className="mt-1 text-blue-700 font-medium">
              {doctor.specialization}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
