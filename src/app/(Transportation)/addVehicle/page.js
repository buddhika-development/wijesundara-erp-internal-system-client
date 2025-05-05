"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddVehicleForm() {
  const [formData, setFormData] = useState({
    vehicle_Num: "",
    vehicle_Model: "",
    vehicle_Make: "",
    vehicle_Colour: "White",
    custom_Colour: "",
    vehicle_YOM: "",
    vehicle_YOR: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const router = useRouter();
  const currentYear = new Date().getFullYear();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
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

    const vehicleNumberPattern = /^[A-Za-z0-9]{3}-\d{4}$/;
    if (!vehicleNumberPattern.test(formData.vehicle_Num)) {
      setError("Vehicle Number must follow the format: XXX-1234.");
      return;
    }

    const yom = Number(formData.vehicle_YOM);
    const yor = Number(formData.vehicle_YOR);

    if (isNaN(yom) || isNaN(yor) || yom > currentYear || yor > currentYear) {
      setError(`YOM and YOR must be valid and not in the future (max ${currentYear}).`);
      return;
    }

    const finalColour =
      formData.vehicle_Colour === "Other" ? formData.custom_Colour : formData.vehicle_Colour;

    const submissionData = {
      ...formData,
      vehicle_Colour: finalColour,
      vehicle_YOM: yom,
      vehicle_YOR: yor,
    };

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:5000/api/vehicles/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add vehicle");
      }

      setShowConfirmation(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const colorOptions = ["White", "Red", "Black", "Green", "Purple", "Gray"];

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-[400px] relative">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-700">Add Vehicle</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Vehicle Number */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Vehicle Number [ABC-1234]:</label>
            <input
              type="text"
              name="vehicle_Num"
              value={formData.vehicle_Num}
              onChange={handleChange}
              required
              maxLength={8}
              className="w-full px-4 py-2 border rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm"
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
              className="w-full px-4 py-2 border rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm"
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
              className="w-full px-4 py-2 border rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm"
            />
          </div>

          {/* Colour Dropdown */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Colour:</label>
            <select
              name="vehicle_Colour"
              value={formData.vehicle_Colour}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm"
              style={{
                backgroundColor:
                  formData.vehicle_Colour !== "Other"
                    ? formData.vehicle_Colour.toLowerCase()
                    : "#fff",
                color:
                  formData.vehicle_Colour.toLowerCase() === "white" ||
                  formData.vehicle_Colour === "Other"
                    ? "#000"
                    : "#fff",
              }}
            >
              {colorOptions.map((color) => (
                <option key={color} value={color}>
                  {color}
                </option>
              ))}
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Custom Colour Input */}
          {formData.vehicle_Colour === "Other" && (
            <div>
              <label className="block text-gray-700 font-medium mb-1">Custom Colour:</label>
              <input
                type="text"
                name="custom_Colour"
                value={formData.custom_Colour}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm"
                placeholder="Enter custom color"
              />
            </div>
          )}

          {/* YOM */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Year of Manufacture (YOM):</label>
            <input
              type="number"
              name="vehicle_YOM"
              value={formData.vehicle_YOM}
              onChange={handleChange}
              required
              min="1900"
              max={currentYear}
              className="w-full px-4 py-2 border rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm"
            />
          </div>

          {/* YOR */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Year of Registration (YOR):</label>
            <input
              type="number"
              name="vehicle_YOR"
              value={formData.vehicle_YOR}
              onChange={handleChange}
              required
              min="1900"
              max={currentYear}
              className="w-full px-4 py-2 border rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-xl text-white transition transform hover:scale-105 ${
              loading ? "bg-purple-300 cursor-not-allowed" : "bg-purple-500 hover:bg-purple-600"
            }`}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>

          {/* Back Button */}
          <button
            type="button"
            onClick={() => router.push("/transporthome")}
            className="w-full bg-gray-500 text-white py-2 rounded-xl mt-2 hover:bg-gray-600 transition transform hover:scale-105"
          >
            Back
          </button>
        </form>

        {/* Confirmation Modal */}
        {showConfirmation && (
          <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-xl shadow-xl w-80 text-center">
              <h3 className="text-2xl font-semibold mb-4 text-green-600">Success!</h3>
              <p className="text-gray-700 mb-4">Vehicle registered successfully.</p>
              <button
                onClick={() => router.push("/transporthome")}
                className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition transform hover:scale-105"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
