"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

const buttons = [
  { label: "Add Vehicle", image: "/images/add.jpeg", route: "/addVehicle" },
  { label: "Edit Vehicle", image: "/images/edit.png", route: "/editHome" },
  { label: "Delete Vehicle", image: "/images/delete.png", route: "/deleteVehicle" },
  { label: "Maintenance", image: "/images/maintenance.webp", route: "/maintenance" },
  { label: "Fuel & Mileage", image: "/images/fuel.jpg", route: "/fuel" },
  { label: "Search Data", image: "/images/search.jpeg", route: "/search" },
  { label: "Statistics", image: "/images/statistics.jpg", route: "/statistics",centered: true },
];

export default function VehicleManagementPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center min-h-screen p-10 bg-gradient-to-br from-gray-100 to-gray-300">
      <h1 className="text-4xl font-bold mb-10 text-gray-800">Vehicle Management</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-5xl">
        {buttons.map((button) => (
          <button
            key={button.label}
            onClick={() => button.route && router.push(button.route)}
            className={`flex flex-col items-center bg-white p-6 rounded-2xl shadow-md hover:shadow-xl hover:bg-gray-50 transform transition-all duration-300 cursor-pointer ${
              button.centered ? "col-span-3 flex justify-center" : ""
            }`}
          >
            <Image
              src={button.image}
              alt={button.label}
              width={80}
              height={80}
              className="mb-4 rounded-lg"
            />
            <span className="text-lg font-semibold text-gray-700">{button.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
