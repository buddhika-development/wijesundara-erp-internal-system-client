"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function EditVehicleForm() {
  const [formData, setFormData] = useState({
    vehicleNumber: "",
    model: "",
    make: "",
    colour: "",
    yom: "",
    yor: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const vehicleNumberParam = searchParams.get("vehicleNumber");

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/vehicles/search/${vehicleNumberParam}`);
        if (res.status === 200) {
          const data = await res.json();
          setFormData({
            vehicleNumber: data.vehicle_Num,
            model: data.vehicle_Model,
            make: data.vehicle_Make,
            colour: data.vehicle_Colour,
            yom: data.vehicle_YOM,
            yor: data.vehicle_YOR,
          });
        } else {
          alert("Vehicle not found");
          router.push("/editHome");
        }
      } catch (err) {
        console.error(err);
      }
    };

    if (vehicleNumberParam) fetchVehicle();
  }, [vehicleNumberParam, router]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    const requiredFields = ["model", "make", "colour", "yom", "yor"];
    for (const field of requiredFields) {
      if (!formData[field]) {
        setError(`Please fill in all required fields. Missing: ${field}`);
        return;
      }
    }

    const currentYear = new Date().getFullYear();
    const yom = Number(formData.yom);
    const yor = Number(formData.yor);

    if (isNaN(yom) || isNaN(yor) || yom > currentYear || yor > currentYear) {
      setError(`YOM and YOR must be valid and not in the future (max ${currentYear}).`);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`http://localhost:8080/api/vehicles/edit/${formData.vehicleNumber}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicle_Model: formData.model,
          vehicle_Make: formData.make,
          vehicle_Colour: formData.colour,
          vehicle_YOM: yom,
          vehicle_YOR: yor,
        }),
      });
      if (res.ok) {
        setShowConfirmation(true);
      } else {
        setError("Error updating vehicle.");
      }
    } catch (error) {
      console.error("Error updating vehicle:", error);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-[400px] relative">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-700">Edit Vehicle</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Vehicle Number (read-only) */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Vehicle Number:</label>
            <input
              type="text"
              name="vehicleNumber"
              value={formData.vehicleNumber}
              readOnly
              className="w-full px-4 py-2 border rounded-xl bg-gray-200 text-black shadow-sm"
            />
          </div>

          {/* Model */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Model:</label>
            <input
              type="text"
              name="model"
              value={formData.model}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm"
            />
          </div>

          {/* Make */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Make:</label>
            <input
              type="text"
              name="make"
              value={formData.make}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm"
            />
          </div>

          {/* Colour */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Colour:</label>
            <input
              type="text"
              name="colour"
              value={formData.colour}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm"
            />
          </div>

          {/* YOM */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Year of Manufacture (YOM):</label>
            <input
              type="number"
              name="yom"
              value={formData.yom}
              onChange={handleChange}
              min="1900"
              max={new Date().getFullYear()}
              className="w-full px-4 py-2 border rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm"
            />
          </div>

          {/* YOR */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Year of Registration (YOR):</label>
            <input
              type="number"
              name="yor"
              value={formData.yor}
              onChange={handleChange}
              min="1900"
              max={new Date().getFullYear()}
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
            {loading ? "Updating..." : "Update"}
          </button>

          {/* Back Button */}
          <button
            type="button"
            onClick={() => router.push("/editHome")}
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
              <p className="text-gray-700 mb-4">Vehicle updated successfully.</p>
              <button
                onClick={() => router.push("/")}
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
