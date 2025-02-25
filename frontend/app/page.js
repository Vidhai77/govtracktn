'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Navbar from '../components/Navbar';

const Home = () => {
  const [role, setRole] = useState('');
  const [district, setDistrict] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const districts = [
    "Ariyalur", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul", "Erode", "Kallakurichi",
    "Kancheepuram", "Karur", "Krishnagiri", "Madurai", "Nagapattinam", "Namakkal", "Perambalur",
    "Pudukkottai", "Ramanathapuram", "Salem", "Sivagangai", "Thanjavur", "The Nilgiris", "Theni",
    "Thoothukudi", "Tiruchirappalli", "Tirunelveli", "Tiruppur", "Tiruvallur", "Tiruvannamalai",
    "Tenkasi", "Villupuram", "Virudhunagar", "Vellore"
  ].sort(); 

  const handleSubmit = async () => {
    if (!email || !password) {
      alert("Email and Password are required!");
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });

      const { token, role: backendRole } = response.data;
      
      if (token) {
        localStorage.setItem('authToken', token);
      }

      if (
        (role === "gov" && backendRole !== "Collector" && backendRole !== "Department_Head") ||
        (role === "tenderer" && backendRole !== "Tender_Group")
      ) {
        alert("Selected role does not match your account role. Please select the correct role.");
        return;
      }

      if (backendRole === "Collector") {
        router.push('/collector');
      } else if (backendRole === "Department_Head") {
        router.push('/dhead');
      } else if (backendRole === "Tender_Group") {
        router.push('/tenderer');
      } else {
        alert("Unauthorized Role!");
      }
      
    } catch (error) {
      alert(error.response?.data?.message || "Login failed!");
    }
  };

  return (
    <div>
      <Navbar />
      <hr />
      <div className="flex flex-col w-[50%] mt-20 mx-auto items-center gap-4">
        <h1 className="text-4xl font-bold text-center">Select Your Role</h1>
        <select 
          className="mt-2 p-2 rounded-md border border-gray-300 w-full text-center" 
          value={role} 
          onChange={(e) => {
            setRole(e.target.value);
            setDistrict('');
          }}
        >
          <option value="">-- Select Role --</option>
          <option value="gov">Government Officials</option>
          <option value="tenderer">Tenderer</option>
        </select>

        {role === "gov" && (
          <select 
            className="mt-2 p-2 rounded-md border border-gray-300 w-full text-center" 
            value={district} 
            onChange={(e) => setDistrict(e.target.value)}
          >
            <option value="">-- Select District --</option>
            {districts.map((district) => (
              <option key={district} value={district}>{district}</option>
            ))}
          </select>
        )}

        {(role === "tenderer" || district) && (
          <div className="flex flex-col w-full gap-4">
            <input 
              type="email" 
              placeholder="Email" 
              className="p-2 rounded-md border border-gray-300 text-center" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
            />
            <input 
              type="password" 
              placeholder="Password" 
              className="p-2 rounded-md border border-gray-300 text-center" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        )}

        <button 
          type="button" 
          className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>

      {/* Project Concept Section */}
      <div className="mt-16 p-6 bg-gray-100 text-gray-800 w-[90%] mx-auto rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center text-green-700">GovTrack TN - A Smarter Way to Manage Government Projects</h2>
        
        <p className="mt-4 text-lg">
          <strong>GovTrack TN</strong> is a digital platform designed to streamline government project management in Tamil Nadu. It enables transparent, real-time monitoring and collaboration among different administrative levels, ensuring timely and efficient project execution.
        </p>

        <h3 className="mt-6 text-2xl font-semibold text-gray-900">🚀 Key Features</h3>
        
        <ul className="list-disc list-inside mt-4 text-lg">
          <li><strong>Role-Based Access Control:</strong> Secure logins for different user types, ensuring proper delegation of responsibilities.</li>
          <li><strong>Real-Time Project Tracking:</strong> Monitor project progress, update statuses, and manage tenders seamlessly.</li>
          <li><strong>Integrated Dashboard:</strong> Provides real-time insights, tracking all active projects and assigned tenders.</li>
          <li><strong>Workflow Automation:</strong> Reduces paperwork, automates project approvals, and ensures accountability.</li>
        </ul>

        <h3 className="mt-6 text-2xl font-semibold text-gray-900">👥 User Roles & Responsibilities</h3>

        <div className="mt-4 text-lg">
          <h4 className="font-bold text-green-700">📌 District Collector</h4>
          <p>➡️ Has an overview of all ongoing projects, creates new projects, and assigns Department Heads.</p>

          <h4 className="font-bold text-green-700 mt-4">📌 Department Head</h4>
          <p>➡️ Responsible for updating project tenders and assigning them to the Tender Groups.</p>

          <h4 className="font-bold text-green-700 mt-4">📌 Tender Group</h4>
          <p>➡️ Updates the status of assigned projects and submits progress reports.</p>
        </div>

        <h3 className="mt-6 text-2xl font-semibold text-gray-900">🔍 Why GovTrack TN?</h3>
        <ul className="list-disc list-inside mt-4 text-lg">
          <li><strong>Boosts Transparency:</strong> Eliminates manual record-keeping and improves project accountability.</li>
          <li><strong>Enhances Efficiency:</strong> Reduces delays by providing real-time project tracking.</li>
          <li><strong>Ensures Fair Tender Management:</strong> Keeps tendering processes streamlined and free from errors.</li>
        </ul>

        <p className="mt-6 text-lg font-semibold text-gray-900">
          ✅ <strong>GovTrack TN</strong> is designed to enhance governance, ensuring timely project delivery, better coordination, and seamless execution of public projects.
        </p>
      </div>
    </div>
  );
};

export default Home;
