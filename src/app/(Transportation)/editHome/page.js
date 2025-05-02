"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EditVehicleForm() {
  const [vehicleNumber, setVehicleNumber] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!vehicleNumber) {
      alert("Please enter vehicle number.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5001/api/vehicles/search/${vehicleNumber}`);
      if (res.status === 200) {
        const vehicleData = await res.json();
        // Redirect to edit page with vehicle data
        router.push(`/editVehicle?vehicleNumber=${vehicleData.vehicle_Num}`);
      } else {
        alert("Vehicle is not registered in the system!");
      }
    } catch (error) {
      console.error("Error checking vehicle:", error);
      alert("Error connecting to server. Try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-[400px]">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-700">Edit Vehicle</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Vehicle Number:</label>
            <input
              type="text"
              name="vehicleNumber"
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-500 text-white py-2 rounded-xl hover:bg-purple-600 transition transform hover:scale-105 cursor-pointer"
          >
            Edit
          </button>

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
