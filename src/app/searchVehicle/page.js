"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SearchVehicle() {
  const [vehicleData, setVehicleData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const vehicleNumber = searchParams.get("vehicleNumber");

  useEffect(() => {
    if (!vehicleNumber) {
      setError("No vehicle number provided.");
      return;
    }

    const fetchVehicleData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`http://localhost:8080/api/vehicles/search/${vehicleNumber}`);

        if (!response.ok) {
          throw new Error("Vehicle not found or an error occurred.");
        }

        const data = await response.json();
        setVehicleData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicleData();
  }, [vehicleNumber]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-[400px]">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-700">Vehicle Details</h2>

        {loading && <p className="text-center text-gray-600">Loading...</p>}

        {error && <p className="text-center text-red-500">{error}</p>}

        {vehicleData && (
          <div className="space-y-4">
            <p className="text-gray-700">
              <strong>Vehicle Number:</strong> {vehicleData.vehicle_Num}
            </p>
            <p className="text-gray-700">
              <strong>Model:</strong> {vehicleData.vehicle_Model}
            </p>
            <p className="text-gray-700">
              <strong>Make:</strong> {vehicleData.vehicle_Make}
            </p>
            <p className="text-gray-700">
              <strong>Colour:</strong> {vehicleData.vehicle_Colour}
            </p>
            <p className="text-gray-700">
              <strong>Year of Manufacture (YOM):</strong> {vehicleData.vehicle_YOM}
            </p>
            <p className="text-gray-700">
              <strong>Year of Registration (YOR):</strong> {vehicleData.vehicle_YOR}
            </p>
          </div>
        )}

        {/* Back Button */}
        <button
          type="button"
          onClick={() => router.push("/")}
          className="w-full bg-gray-500 text-white py-2 rounded-xl mt-6 hover:bg-gray-600 transition transform hover:scale-105 cursor-pointer"
        >
          Back
        </button>
      </div>
    </div>
  );
}
