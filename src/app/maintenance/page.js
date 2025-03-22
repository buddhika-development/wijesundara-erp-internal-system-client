"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from 'axios';

export default function MaintenanceVehicleForm() {
  const [formData, setFormData] = useState({
    vehicleNumber: "",
    maintenanceCost: "",
    description: "",
    date: "",
  });

  const router = useRouter();

  const todayDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.vehicleNumber || !formData.maintenanceCost || !formData.description || !formData.date) {
      alert("Please fill in all required fields.");
      return;
    }

    // Check if vehicle number length exceeds 8
    if (formData.vehicleNumber.length > 8) {
      alert("Vehicle number cannot exceed 8 characters.");
      return;
    }

    // Check date not future
    if (formData.date > todayDate) {
      alert("Future dates are not allowed!");
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/api/vehicle-maintenance/add', formData);
      alert(response.data.message);
      router.push("/");
    } catch (error) {
      if (error.response && error.response.status === 404) {
        alert(error.response.data.message); // Vehicle not found
      } else if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("Error adding maintenance data. Please try again.");
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-[400px]">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-700">Maintenance</h2>
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Vehicle Number */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Vehicle Number:</label>
            <input
              type="text"
              name="vehicleNumber"
              value={formData.vehicleNumber}
              onChange={handleChange}
              maxLength={8}
              required
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm"
            />
          </div>

          {/* Maintenance Cost */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Maintenance Cost:</label>
            <input
              type="number"
              name="maintenanceCost"
              value={formData.maintenanceCost}
              onChange={handleChange}
              required
              min="0"
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Maintenance Description:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm"
            ></textarea>
          </div>

          {/* Date */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Date:</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              max={todayDate}
              required
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-purple-500 text-white py-2 rounded-xl hover:bg-purple-600 transition transform hover:scale-105 cursor-pointer"
          >
            Submit
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
