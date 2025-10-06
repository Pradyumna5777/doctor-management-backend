export default function DoctorCard({doctor}){
return (
<div className="border rounded-lg p-4 shadow-sm">
<img src={doctor.photo || '/default-doc.jpg'} alt={doctor.name} className="w-32 h-32 object-cover rounded-full mx-auto" />
<h3 className="text-center font-semibold mt-3">{doctor.name}</h3>
<p className="text-center text-sm">{doctor.specialty}</p>
<div className="mt-4 text-center">
<a href={`/book?doctor=${doctor._id}`} className="text-sky-600">Book</a>
</div>
</div>
)
}