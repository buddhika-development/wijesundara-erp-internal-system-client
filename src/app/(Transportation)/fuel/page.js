"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from 'axios';

export default function FuelMilageVehicleForm() {  
  const [formData, setFormData] = useState({
    vehicleNumber: "",
    fuelCost: "",
    mileage: "",
    date: "",
  });

  const router = useRouter();

  const handleChange = (e) => {
    // Restrict vehicle number to 8 characters max
    if (e.target.name === "vehicleNumber" && e.target.value.length > 8) {
      return; // prevent typing beyond 8 chars
    }
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.vehicleNumber || !formData.fuelCost || !formData.mileage || !formData.date) {
      alert("Please fill in all required fields.");
      return;
    }

    // Vehicle number length check
    if (formData.vehicleNumber.length > 8) {
      alert("Vehicle number must be 8 characters or less.");
      return;
    }

    // Date Validation - no future dates
    const selectedDate = new Date(formData.date);
    const today = new Date();
    selectedDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (selectedDate > today) {
      alert("Future dates are not allowed. Please select today or a past date.");
      return;
    }

    try {
      const response = await axios.post('http://localhost:5001/api/vehicle-fuel/add', formData);
      alert(response.data.message);
      router.push("/");
    } catch (error) {
      if (error.response && error.response.status === 404) {
        alert(error.response.data.message); // Vehicle not found
      } else if (error.response && error.response.status === 400) {
        alert(error.response.data.message); // Validation error
      } else {
        alert("Error adding fuel/mileage data. Please try again.");
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-[400px]">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-700">Fuel & Mileage</h2>
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Vehicle Number */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Vehicle Number:</label>
            <input
              type="text"
              name="vehicleNumber"
              value={formData.vehicleNumber}
              onChange={handleChange}
              maxLength={8} // Also enforce max length
              required
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm"
            />
            <p className="text-sm text-gray-500">Max 8 characters</p>
          </div>

          {/* Fuel Cost */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Fuel Cost:</label>
            <input
              type="number"
              name="fuelCost"
              value={formData.fuelCost}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm"
            />
          </div>

          {/* Mileage */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Mileage:</label>
            <input
              type="number"
              name="mileage"
              value={formData.mileage}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Date:</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
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
