import React from 'react';

const teamMembers = [
  {
    name: 'Marsha Rasyida Al-Farabi',
    role: 'ML Lead & Data Scientist',
    university: 'Universitas Gadjah Mada',
    id: 'MC008D5X2348',
    skills: 'Analisis Data, Feature Engineering, Pengembangan Model',
  },
  {
    name: 'Syifa Azzahra Susilo',
    role: 'ML Engineer',
    university: 'Universitas Gadjah Mada',
    id: 'MC008D5X2087',
    skills: 'Pelatihan Model, Optimasi Hyperparameter',
  },
  {
    name: 'Indara Nurwulandari',
    role: 'Data Engineer',
    university: 'Universitas Gadjah Mada',
    id: 'MC008D5X2388',
    skills: 'Pra-pemrosesan Data, Evaluasi Model',
  },
  {
    name: 'Muhammad Novian',
    role: 'Full-Stack Lead',
    university: 'Universitas Muhammadiyah Yogyakarta',
    id: 'FC492D5Y2169',
    skills: 'Desain Frontend, Integrasi Backend',
  },
  {
    name: 'Muh Diaz Nazarudin Rahman',
    role: 'Backend Developer',
    university: 'Universitas Ahmad Dahlan',
    id: 'FC179D5Y0593',
    skills: 'Pengembangan API, Manajemen Basis Data',
  },
  {
    name: 'Aditya Navra Erlangga',
    role: 'Frontend Developer',
    university: 'Universitas Ahmad Dahlan',
    id: 'FC179D5Y1055',
    skills: 'Desain UI/UX, Pengembangan Web Responsif',
  },
];

const AboutPage = () => {
  return (
    <div className="px-6 py-10 bg-white min-h-screen text-gray-800">
      <h1 className="text-4xl font-bold text-center mb-4">🌟 Tim Pengembang IllDetect - CC25-CF225 🌟</h1>
      <p className="text-center text-lg mb-10">Menghadirkan Inovasi untuk Deteksi Kesehatan Kardiovaskular</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {teamMembers.map((member, index) => (
          <div key={index} className="bg-gray-100 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold text-indigo-700">{member.name}</h2>
            <p className="text-sm text-gray-600">{member.role}</p>
            <p className="text-sm mt-2">🏫 {member.university}</p>
            <p className="text-sm">🆔 {member.id}</p>
            <p className="text-sm mt-2">💡 <strong>Keahlian:</strong> {member.skills}</p>
            <div className="mt-4 flex gap-3 text-xl text-gray-500">
              <span>📸</span>
              <span>💼</span>
              <span>🌐</span>
            </div>
          </div>
        ))}
      </div>

      <p className="text-center text-lg font-semibold mt-12 text-pink-600">
        💪 Bersama, kami membangun masa depan skrining kesehatan kardiovaskular! 💪
      </p>
    </div>
  );
};

export default AboutPage;
