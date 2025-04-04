"use client"; // Ensure Next.js App Router compatibility

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchVehicleForm() {
  const [formData, setFormData] = useState({
    vehicleNumber: "",
  });

  const router = useRouter(); // Get router instance

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple validation
    if (!formData.vehicleNumber) {
      alert("Please fill in the Vehicle Number.");
      return;
    }

    console.log("Form Data:", formData);

    // Navigate to the search page after submission
    router.push(`/searchVehicle?vehicleNumber=${formData.vehicleNumber}`);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-[400px]">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-700">Search Vehicle</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Vehicle Number */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Vehicle Number:</label>
            <input
              type="text"
              name="vehicleNumber"
              value={formData.vehicleNumber}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm"
            />
          </div>

          {/* Search Button */}
          <button
            type="submit"
            className="w-full bg-purple-500 text-white py-2 rounded-xl hover:bg-purple-600 transition transform hover:scale-105 cursor-pointer"
          >
            Search
          </button>

          {/* Back Button */}
          <button
            type="button"
            onClick={() => router.push("/")}
            className="w-full bg-gray-500 text-white py-2 rounded-xl mt-2 hover:bg-gray-600 transition transform hover:scale-105 cursor-pointer"
          >
            Back
          </button>
        </form>
      </div>
    </div>
  );
}
