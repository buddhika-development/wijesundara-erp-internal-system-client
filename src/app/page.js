"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

const buttons = [
  { label: "Add Vehicle", image: "/images/add.jpeg", route: "/addVehicle" },
  { label: "Edit Vehicle", image: "/images/edit.png", route: "/editVehicle" },
  { label: "Delete Vehicle", image: "/images/delete.png",route: "/deleteVehicle" },
  { label: "Maintenance", image: "/images/maintenance.webp" ,route: "/maintenance"},
  { label: "Fuel & Mileage", image: "/images/fuel.jpg" ,route: "/fuel"},
  { label: "Search Data", image: "/images/search.jpeg" ,route: "/search"},
  { label: "Statistics", image: "/images/statistics.jpg", centered: true },
];

export default function VehicleManagementPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-6">Vehicle Management</h1>
      <div className="grid grid-cols-3 gap-6">
        {buttons.map((button) => (
          <button
            key={button.label}
            onClick={() => button.route && router.push(button.route)}
            className={`flex flex-col items-center bg-white p-4 rounded-lg shadow-lg hover:scale-105 transition ${
              button.centered ? "col-span-3 flex justify-center" : ""
            }`}
          >
            <Image src={button.image} alt={button.label} width={64} height={64} className="mb-2" />
            <span className="text-lg font-medium">{button.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
