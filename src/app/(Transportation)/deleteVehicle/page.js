"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteVehicleForm() {
  const [formData, setFormData] = useState({
    vehicleNumber: "",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const vehicleNumberPattern = /^[A-Za-z0-9]{3}-\d{4}$/;
    // Validation
    if (!formData.vehicleNumber) {
        setError("Please fill in the vehicle number.");
        return;
      }
      
      if (!vehicleNumberPattern.test(formData.vehicleNumber)) {
        setError("Vehicle number must follow the format: XXX-1234 (3 alphanumeric characters followed by a dash and 4 digits).");
        return;
      }

    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:5000/api/vehicles/delete/${formData.vehicleNumber}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        setShowConfirmation(true);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Error deleting vehicle: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-red-100 via-yellow-100 to-orange-100">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-[400px] relative">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-700">Delete Vehicle</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Vehicle Number */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Vehicle Number:</label>
            <input
              type="text"
              name="vehicleNumber"
              value={formData.vehicleNumber}
              onChange={handleChange}
              placeholder="Enter Vehicle Number"
              required
              maxLength={8}
              className="w-full px-4 py-2 border rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-red-400 shadow-sm"
            />
          </div>

          {/* Delete Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-xl text-white transition transform hover:scale-105 ${
              loading ? "bg-red-300 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"
            }`}
          >
            {loading ? "Deleting..." : "Delete"}
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
              <p className="text-gray-700 mb-4">Vehicle deleted successfully.</p>
              <button
                onClick={() => router.push("/transporthome")}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition transform hover:scale-105"
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
