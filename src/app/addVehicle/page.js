"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddVehicleForm() {
  const [formData, setFormData] = useState({
    vehicle_Num: "",
    vehicle_Model: "",
    vehicle_Make: "",
    vehicle_Colour: "",
    vehicle_YOM: "",
    vehicle_YOR: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all required fields
    const requiredFields = [
      "vehicle_Num",
      "vehicle_Model",
      "vehicle_Make",
      "vehicle_Colour",
      "vehicle_YOM",
      "vehicle_YOR",
    ];
    for (const field of requiredFields) {
      if (!formData[field]) {
        setError(`Please fill in all required fields. Missing: ${field}`);
        return;
      }
    }

    // Convert YOM and YOR to numbers
    const submissionData = {
      ...formData,
      vehicle_YOM: Number(formData.vehicle_YOM),
      vehicle_YOR: Number(formData.vehicle_YOR),
    };

    // Validate that YOM and YOR are valid numbers
    if (isNaN(submissionData.vehicle_YOM) || isNaN(submissionData.vehicle_YOR)) {
      setError("Year of Manufacture and Year of Registration must be valid numbers.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      
      const response = await fetch("http://localhost:8080/api/vehicles/add", { // change port if needed

        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add vehicle");
      }

      const data = await response.json();
      console.log("Vehicle added:", data);

      // Redirect to home or vehicle list page after success
      router.push("/"); // Adjust this to your desired route
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-[400px]">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-700">Add Vehicle</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Vehicle Number */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Vehicle Number:</label>
            <input
              type="text"
              name="vehicle_Num"
              value={formData.vehicle_Num}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm"
            />
          </div>

          {/* Model */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Model:</label>
            <input
              type="text"
              name="vehicle_Model"
              value={formData.vehicle_Model}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm"
            />
          </div>

          {/* Make */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Make:</label>
            <input
              type="text"
              name="vehicle_Make"
              value={formData.vehicle_Make}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm"
            />
          </div>

          {/* Colour */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Colour:</label>
            <input
              type="text"
              name="vehicle_Colour"
              value={formData.vehicle_Colour}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm"
            />
          </div>

          {/* Year of Manufacture */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Year of Manufacture (YOM):</label>
            <input
              type="number"
              name="vehicle_YOM"
              value={formData.vehicle_YOM}
              onChange={handleChange}
              required
              min="1900"
              max="2099"
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm"
            />
          </div>

          {/* Year of Registration */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Year of Registration (YOR):</label>
            <input
              type="number"
              name="vehicle_YOR"
              value={formData.vehicle_YOR}
              onChange={handleChange}
              required
              min="1900"
              max="2099"
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-xl text-white transition transform hover:scale-105 cursor-pointer ${
              loading ? "bg-purple-300 cursor-not-allowed" : "bg-purple-500 hover:bg-purple-600"
            }`}
          >
            {loading ? "Submitting..." : "Submit"}
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