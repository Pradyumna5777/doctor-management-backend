import React from 'react'


export default function Hero(){
return (
<section className="bg-gradient-to-r from-sky-100 to-white py-16">
<div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-8">
<div className="md:w-1/2">
<h1 className="text-4xl font-bold mb-4">Compassionate Care, Expert Doctors</h1>
<p className="mb-6">Book appointments online, learn about our services, and contact us quickly.</p>
<a href="/book" className="inline-block bg-sky-600 text-white px-6 py-2 rounded">Book Appointment</a>
</div>
<div className="md:w-1/2">
<img src="/doctor-illustration.svg" alt="doctor" className="w-full max-w-md" />
</div>
</div>
</section>
)
}