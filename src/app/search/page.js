"use client"; // Ensure Next.js App Router compatibility

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EditVehicleForm() {
  const [formData, setFormData] = useState({
    vehicleNumber: "",
    model: "",
    make: "",
    colour: "",
    yom: "",
    yor: "",
  });

  const router = useRouter(); // Get router instance

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple validation
    if (!formData.vehicleNumber || !formData.model || !formData.make || !formData.colour) {
      alert("Please fill in all required fields.");
      return;
    }

    console.log("Form Data:", formData);

    // Navigate back to the main page after submission
    router.push("/");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-300">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
        <h2 className="text-xl font-semibold text-center mb-4">Search Details</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Vehicle Number */}
          <div>
            <label className="block text-gray-700">Vehicle Number:</label>
            <input
              type="text"
              name="vehicleNumber"
              value={formData.vehicleNumber}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Search Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Search
          </button>

          {/* Back Button */}
          <button
            type="button"
            onClick={() => router.push("/")}
            className="w-full bg-gray-400 text-white py-2 rounded-lg mt-2 hover:bg-gray-500 transition"
          >
            Back
          </button>
        </form>
      </div>
    </div>
  );
}
