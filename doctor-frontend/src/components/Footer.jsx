import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter, FaPhone } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-12">
      <div className="container mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* About */}
        <div>
          <h3 className="text-xl font-bold mb-4">Madhuri Nidan Kendra</h3>
          <p>Providing top-notch healthcare services with experienced doctors.</p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-bold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link to="/" className="hover:text-blue-400 transition">Home</Link></li>
            <li><Link to="/doctors" className="hover:text-blue-400 transition">Doctors</Link></li>
            <li><Link to="/book" className="hover:text-blue-400 transition">Book Appointment</Link></li>
            <li><Link to="/contact" className="hover:text-blue-400 transition">Contact</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-xl font-bold mb-4">Contact</h3>
          <p className="flex items-center"><FaPhone className="mr-2"/> +91 9939497429</p>
          <div className="flex space-x-4 mt-4">
            <a href="#" className="hover:text-blue-400 transition"><FaFacebook /></a>
            <a href="#" className="hover:text-pink-500 transition"><FaInstagram /></a>
            <a href="#" className="hover:text-blue-300 transition"><FaTwitter /></a>
          </div>
        </div>
      </div>

      <div className="text-center text-gray-400 text-sm py-4 border-t border-gray-700">
        &copy; {new Date().getFullYear()} Madhuri Nidan Kendra. All rights reserved.
      </div>
    </footer>
  );
}
