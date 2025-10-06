import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const doctors = [
  {
      name: "Dr. Pankaj Kumar Chaurasiya",
    specialty: "Physician & Pediatrician",
          qualifications: "B.A.M.S. (Ranchi), C.C.H. (Mumbai)",
      image: "/images/hos1.png", // replace with actual path
  },
  {
      name: "Dr. Anita Chaurasiya",
    specialty: "Gynecologist and Obstetrician",
          qualifications: "B.H.M.S. (Nasik), C.C.H. & C.G.O. (Mumbai)",
      image: "/images/hosss.png", // replace with actual path
  },
];

const services = [
  "Operations", // New service added
  "Child Vaccination",
  "Health Checkups",
  "Laboratory Tests",
];

const testimonials = [
  { text: "The doctors are very professional and caring. Booking appointments online is a breeze!", author: "Sita R." },
  { text: "Excellent healthcare facilities and very supportive staff. Highly recommended!", author: "Ramesh K." },
  { text: "I felt truly cared for during my visit. The team is amazing!", author: "Anjali P." },
  { text: "Very clean and organized clinic. Doctors explained everything patiently.", author: "Vikram S." },
  { text: "Quick appointments and friendly staff. Totally satisfied!", author: "Neha M." },
  { text: "Best pediatric care I have ever seen. Highly recommend Dr. Pankaj.", author: "Ritu S." },
  { text: "I appreciated the professionalism and warmth. Great experience!", author: "Amit K." },
  { text: "State-of-the-art facilities and supportive doctors. Feeling healthy again!", author: "Priya T." },
  { text: "Excellent consultation and follow-up. Very happy with the service.", author: "Sanjay D." },
  { text: "The staff made me feel comfortable and well-informed about my treatment.", author: "Kiran B." },
  { text: "Amazing experience! Friendly doctors and smooth process.", author: "Alok C." },
  { text: "Highly skilled doctors with great patient care. Would recommend to all.", author: "Shweta R." },
];

  const fadeInUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };

const galleryImages = [
  "/images/a1.jpg",
  "/images/a2.jpg",
  "/images/a1.jpg",
];


export default function Home() {

  
const scrollRef = useRef(null);

  // inside Home.jsx
const [currentIndex, setCurrentIndex] = useState(0);

useEffect(() => {
  if (!scrollRef.current || testimonials.length === 0) return;

  const interval = setInterval(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  }, 4000); // 4 seconds delay

  return () => clearInterval(interval);
}, [testimonials]);

// Scroll effect when index changes
useEffect(() => {
  if (scrollRef.current) {
    const container = scrollRef.current;
    const cardWidth = container.firstChild?.offsetWidth + 24; // 24px gap (gap-6)
    container.scrollTo({
      left: currentIndex * cardWidth,
      behavior: "smooth",
    });
  }
}, [currentIndex]);

  return (
    <div className="relative bg-blue-50 min-h-screen flex flex-col items-center text-center px-4">
{/* Hospital Image before Hero */}
{/* Hero Section with Hospital Sign */}
<motion.div
  initial={{ opacity: 0, y: -30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 1 }}
  className="w-full py-6 flex flex-col items-center justify-center bg-[url('/images/clinic.webp')] bg-cover bg-center rounded-lg shadow-md relative"
>

  
  {/* ✅ Logo for mobile (above white box) */}
  <motion.img
          src="/images/health.png"
          alt="Hospital Logo"
          className="w-20 h-20 mb-4 block md:hidden relative z-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        />

  {/* Hospital Sign with Image */}
  <motion.div
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 1, delay: 0.3, type: "spring", stiffness: 120 }}
    className="flex items-center bg-white px-6 py-3 rounded-full mb-6 shadow-lg"
  >
    {/* ✅ Logo only on desktop (inside white box) */}
    <motion.img
      src="/images/health.png"
      alt="Hospital Logo"
      className="hidden md:block w-12 h-12 mr-3"
      initial={{ opacity: 0, rotate: -20 }}
      animate={{ opacity: 1, rotate: 0 }}
      transition={{ duration: 1, delay: 0.5 }}
    />
    <span className="text-red-600 text-2xl md:text-3xl font-extrabold uppercase tracking-wider">
      Madhuri Nidan Kendra
    </span>
  </motion.div>

  {/* Hero Text */}
  <motion.h1
    initial={{ scale: 0.9, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 1, delay: 0.6 }}
    className="text-4xl md:text-5xl font-bold text-blue-800 mb-4"
  >
    Welcome to Our Clinic
  </motion.h1>

  <motion.p
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1, delay: 0.9 }}
    className="text-lg md:text-xl text-white mb-6 max-w-2xl text-center"
  >
    Your health is our priority. Book appointments with top doctors easily.
  </motion.p>

  <motion.div whileHover={{ scale: 1.05 }}>
    <Link
      to="/book"
      className="bg-blue-600 text-white px-6 py-3 rounded shadow hover:bg-blue-700 transition"
    >
      Book an Appointment
    </Link>
  </motion.div>
</motion.div>



      {/* Highlights Section */}
      <motion.div
        className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        transition={{ staggerChildren: 0.2 }}
      >
        {[
          { title: "Expert Doctors", desc: "Consult with certified and experienced medical professionals." },
          { title: "Modern Facilities", desc: "State-of-the-art equipment for accurate diagnosis & treatment." },
          { title: "Easy Booking", desc: "Book your appointments online in just a few clicks." },
        ].map((item, idx) => (
          <motion.div
            key={idx}
            variants={fadeInUp}
            className="bg-white p-6 rounded shadow hover:shadow-lg hover:scale-105 transition"
          >
            <h3 className="text-xl font-bold mb-2">{item.title}</h3>
            <p>{item.desc}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Doctors Section */}
      <motion.div
        className="mt-16 w-full max-w-5xl"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        transition={{ staggerChildren: 0.2 }}
      >
        <h2 className="text-3xl font-bold text-blue-800 mb-8">Meet Our Doctors</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {doctors.map((doctor) => (
              <motion.div
              key={doctor.name}
              variants={fadeInUp}
              whileHover={{ scale: 1.05 }}
              className="bg-white p-4 rounded shadow flex flex-col items-center"
            >
            <img
              src={doctor.image}
              alt={doctor.name}
              className="w-50 h-50 object-cover rounded-full mb-4 border-4 border-blue-200"
            />
            <h4 className="text-xl font-bold text-gray-800">{doctor.name}</h4>
            <p className="text-gray-600 mt-2">{doctor.qualifications}</p>
            <span className="mt-1 text-blue-700 font-medium">
              {doctor.specialty}
            </span>
 </motion.div>
        ))}
        </div>
      </motion.div>

      {/* Services Section */}
      <motion.div
        className="mt-16 w-full max-w-5xl"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        transition={{ staggerChildren: 0.15 }}
      >
        <h2 className="text-3xl font-bold text-blue-800 mb-8">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {services.map((service) => (
            <motion.div
              key={service}
              variants={fadeInUp}
              whileHover={{ scale: 1.05 }}
              className="bg-white p-4 rounded shadow text-center transition"
            >
              <h4 className="font-bold mb-2">{service}</h4>
            </motion.div>
          ))}
        </div>
      </motion.div>

{/* Why Choose Us Section */}
<motion.div
  className="mt-16 w-full max-w-5xl"
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.3 }}
  transition={{ staggerChildren: 0.2 }}
>
  <h2 className="text-3xl font-bold text-blue-800 mb-8 text-center">Why Choose Us?</h2>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {[
      { title: "Trusted Care", desc: "Over 10 years of experience serving families with compassion." },
      { title: "Affordable Services", desc: "Quality healthcare at reasonable costs for everyone." },
      { title: "24/7 Support", desc: "Emergency care and patient support anytime you need." },
    ].map((item, idx) => (
      <motion.div
        key={idx}
        variants={fadeInUp}
        className="bg-white p-6 rounded shadow hover:shadow-lg hover:scale-105 transition"
      >
        <h3 className="text-xl font-bold mb-2">{item.title}</h3>
        <p className="text-gray-600">{item.desc}</p>
      </motion.div>
    ))}
  </div>
</motion.div>

{/* FAQ Section */}
<motion.div
  className="mt-16 w-full max-w-4xl"
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.3 }}
  transition={{ staggerChildren: 0.15 }}
>
  <h2 className="text-3xl font-bold text-blue-800 mb-8 text-center">Frequently Asked Questions</h2>
  <div className="space-y-4">
    {[
      { q: "Do you accept walk-ins?", a: "Yes, but we recommend booking an appointment for faster service." },
      { q: "What are your clinic timings?", a: "We are open from 9 AM – 9 PM, Monday to Saturday." },
      { q: "Do you provide emergency services?", a: "Yes, we provide urgent care and emergency consultation." },
    ].map((faq, idx) => (
      <motion.div
        key={idx}
        variants={fadeInUp}
        className="bg-white p-4 rounded shadow"
      >
        <h4 className="font-bold text-gray-800">{faq.q}</h4>
        <p className="text-gray-600 mt-2">{faq.a}</p>
      </motion.div>
    ))}
  </div>
</motion.div>

     {/* Testimonials Section */}
<motion.div
  className="mt-16 w-full max-w-6xl mx-auto p-6"
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.3 }}
  transition={{ staggerChildren: 0.2 }}
>
  <h2 className="text-3xl font-bold text-blue-800 mb-6 text-center">
    What Our Patients Say
  </h2>

<div
  ref={scrollRef}
  className="flex gap-6 overflow-x-hidden px-4 py-6 snap-x snap-mandatory"
  style={{ scrollBehavior: "smooth" }}
>

    {testimonials.map((t, idx) => (
      <motion.div
        key={idx}
        className="min-w-[250px] md:min-w-[300px] bg-white p-6 rounded-lg shadow-lg flex-shrink-0 snap-start"
        variants={fadeInUp}
        whileHover={{ scale: 1.05 }}
      >
        <p className="italic text-gray-700">"{t.text}"</p>
        <footer className="mt-4 font-bold text-gray-900 text-right">
          - {t.author}
        </footer>
      </motion.div>
    ))}
  </div>
</motion.div>


      {/* Gallery Section */}
      <motion.div
        className="mt-16 w-full max-w-5xl"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        transition={{ staggerChildren: 0.15 }}
      >
        <h2 className="text-3xl font-bold text-blue-800 mb-6">Our Clinic</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {galleryImages.map((img, idx) => (
            <motion.img
              key={idx}
              src={img}
              alt={`Clinic ${idx + 1}`}
              variants={fadeInUp}
              whileHover={{ scale: 1.05 }}
              className="rounded shadow object-cover w-full h-64"
            />
          ))}
        </div>
      </motion.div>


      {/* Contact / CTA Section */}
      <motion.div
        className="mt-16 bg-blue-600 text-white p-8 rounded shadow text-center w-full max-w-3xl mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-2xl font-bold mb-4">Need Help?</h2>
        <p>Call us at <a href="tel:+919939497429" className="underline">+91 9939497429</a></p>
        <Link
          to="/contact"
          className="mt-4 inline-block bg-white text-blue-600 px-6 py-2 rounded hover:bg-gray-100 transition"
        >
          Contact Us
        </Link>
      </motion.div>
    </div>
  );
}
