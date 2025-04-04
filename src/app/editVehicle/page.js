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
        <h2 className="text-xl font-semibold text-center mb-4">Edit Vehicle</h2>
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

          {/* Model */}
          <div>
            <label className="block text-gray-700">Model:</label>
            <input
              type="text"
              name="model"
              value={formData.model}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Make */}
          <div>
            <label className="block text-gray-700">Make:</label>
            <input
              type="text"
              name="make"
              value={formData.make}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Colour */}
          <div>
            <label className="block text-gray-700">Colour:</label>
            <input
              type="text"
              name="colour"
              value={formData.colour}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Year of Manufacture (YOM) */}
          <div>
            <label className="block text-gray-700">YOM:</label>
            <input
              type="number"
              name="yom"
              value={formData.yom}
              onChange={handleChange}
              min="1900"
              max="2099"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Year of Registration (YOR) */}
          <div>
            <label className="block text-gray-700">YOR:</label>
            <input
              type="number"
              name="yor"
              value={formData.yor}
              onChange={handleChange}
              min="1900"
              max="2099"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Submit
          </button>

          {/* Back Button */}
          <button
            type="button"
            onClick={() => router.push("/editHome")}
            className="w-full bg-gray-400 text-white py-2 rounded-lg mt-2 hover:bg-gray-500 transition"
          >
            Back
          </button>
        </form>
      </div>
    </div>
  );
}
