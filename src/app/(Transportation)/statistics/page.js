"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function StatisticsPage() {
  const [vehicles, setVehicles] = useState([]);
  const [fuelRecords, setFuelRecords] = useState([]);
  const [maintenanceRecords, setMaintenanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Search by vehicle number
  const [vehicleFilter, setVehicleFilter] = useState({ model: "", make: "" }); // Filter vehicles by model/make
  const [fuelDateRange, setFuelDateRange] = useState([null, null]); // Fuel date range
  const [maintenanceDateRange, setMaintenanceDateRange] = useState([null, null]); // Maintenance date range
  const contentRef = useRef(null); // Ref to capture content for PDF
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Build query parameters
        const queryParams = new URLSearchParams();
        if (searchTerm) queryParams.append("vehicleNum", searchTerm);
        if (vehicleFilter.model) queryParams.append("model", vehicleFilter.model);
        if (vehicleFilter.make) queryParams.append("make", vehicleFilter.make);
        if (fuelDateRange[0]) queryParams.append("dateFrom", fuelDateRange[0].toISOString());
        if (fuelDateRange[1]) queryParams.append("dateTo", fuelDateRange[1].toISOString());
        if (maintenanceDateRange[0]) queryParams.append("dateFrom", maintenanceDateRange[0].toISOString());
        if (maintenanceDateRange[1]) queryParams.append("dateTo", maintenanceDateRange[1].toISOString());

        // Fetch vehicles
        const vehiclesRes = await fetch(`http://localhost:5000/api/vehicles?${queryParams}`);
        if (!vehiclesRes.ok) throw new Error("Failed to fetch vehicles");
        const vehiclesData = await vehiclesRes.json();
        setVehicles(vehiclesData);

        // Fetch fuel/mileage records
        const fuelRes = await fetch(`http://localhost:5000/api/vehicle-fuel?${queryParams}`);
        if (!fuelRes.ok) throw new Error("Failed to fetch fuel records");
        const fuelData = await fuelRes.json();
        setFuelRecords(fuelData);

        // Fetch maintenance records
        const maintenanceRes = await fetch(`http://localhost:5000/api/vehicle-maintenance?${queryParams}`);
        if (!maintenanceRes.ok) throw new Error("Failed to fetch maintenance records");
        const maintenanceData = await maintenanceRes.json();
        setMaintenanceRecords(maintenanceData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchTerm, vehicleFilter, fuelDateRange, maintenanceDateRange]);

  // Function to export content as PDF
  const exportToPDF = async () => {
    const element = contentRef.current;
    try {
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgScaledWidth = imgWidth * ratio;
      const imgScaledHeight = imgHeight * ratio;

      pdf.addImage(imgData, "PNG", 0, 0, imgScaledWidth, imgScaledHeight);
      pdf.save("statistics-report.pdf");
    } catch (err) {
      console.error("PDF export failed:", err);
      alert("Failed to export PDF. Please try again.");
    }
  };

  // Get unique models and makes for filter dropdowns
  const uniqueModels = [...new Set(vehicles.map((v) => v.vehicle_Model))].filter(Boolean);
  const uniqueMakes = [...new Set(vehicles.map((v) => v.vehicle_Make))].filter(Boolean);

  // Prepare data for charts
  const vehicleNumbers = vehicles.map((v) => v.vehicle_Num);

  // Fuel Costs Chart Data
  const fuelCostsData = {
    labels: vehicleNumbers,
    datasets: [
      {
        label: "Total Fuel Cost ($)",
        data: vehicleNumbers.map((num) => {
          const totalFuel = fuelRecords
            .filter((record) => record.vehicle_Num === num)
            .reduce((sum, record) => sum + Number(record.vehicle_Fuel || 0), 0);
          return totalFuel;
        }),
        backgroundColor: "rgba(59, 130, 246, 0.6)", // Blue (#3B82F6)
        borderColor: "#3B82F6",
        borderWidth: 1,
      },
    ],
  };

  // Maintenance Costs Chart Data
  const maintenanceCostsData = {
    labels: vehicleNumbers,
    datasets: [
      {
        label: "Total Maintenance Cost ($)",
        data: vehicleNumbers.map((num) => {
          const totalMaintenance = maintenanceRecords
            .filter((record) => record.vehicle_Num === num)
            .reduce((sum, record) => sum + Number(record.vehicle_MainCost || 0), 0);
          return totalMaintenance;
        }),
        backgroundColor: "rgba(239, 68, 68, 0.6)", // Red (#EF4444)
        borderColor: "#EF4444",
        borderWidth: 1,
      },
    ],
  };

  // Mileage Chart Data
  const mileageData = {
    labels: vehicleNumbers,
    datasets: [
      {
        label: "Total Mileage (km)",
        data: vehicleNumbers.map((num) => {
          const totalMileage = fuelRecords
            .filter((record) => record.vehicle_Num === num)
            .reduce((sum, record) => sum + Number(record.vehicle_Milage || 0), 0);
          return totalMileage;
        }),
        backgroundColor: "rgba(16, 185, 129, 0.6)", // Green (#10B981)
        borderColor: "#10B981",
        borderWidth: 1,
      },
    ],
  };

  // Chart Options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Value",
        },
      },
      x: {
        title: {
          display: true,
          text: "Vehicle Number",
        },
      },
    },
  };

  return (
    <div
      className="flex flex-col items-center min-h-screen p-10"
      style={{ backgroundColor: "#F9FAFB" }} // Gray-50
    >
      {/* Search and Filter Controls */}
      <div className="w-full max-w-5xl mb-6">
        <h2 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "1rem", color: "#1F2937" }}>
          Search & Filter
        </h2>
        <div
          style={{
            backgroundColor: "#FFFFFF",
            padding: "1.5rem",
            borderRadius: "1rem",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          }}
        >
          {/* Search Input */}
          <div className="mb-4">
            <label style={{ display: "block", marginBottom: "0.5rem", color: "#374151" }}>
              Search by Vehicle Number
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Enter vehicle number (e.g., ABC-1234)"
              style={{
                width: "100%",
                padding: "0.5rem",
                border: "1px solid #E5E7EB",
                borderRadius: "0.5rem",
                color: "#374151",
              }}
            />
          </div>

          {/* Vehicle Filters */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", color: "#374151" }}>
                Filter by Model
              </label>
              <select
                value={vehicleFilter.model}
                onChange={(e) => setVehicleFilter({ ...vehicleFilter, model: e.target.value })}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #E5E7EB",
                  borderRadius: "0.5rem",
                  color: "#374151",
                }}
              >
                <option value="">All Models</option>
                {uniqueModels.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", color: "#374151" }}>
                Filter by Make
              </label>
              <select
                value={vehicleFilter.make}
                onChange={(e) => setVehicleFilter({ ...vehicleFilter, make: e.target.value })}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #E5E7EB",
                  borderRadius: "0.5rem",
                  color: "#374151",
                }}
              >
                <option value="">All Makes</option>
                {uniqueMakes.map((make) => (
                  <option key={make} value={make}>
                    {make}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date Range Filters */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", color: "#374151" }}>
                Fuel Records Date Range
              </label>
              <DatePicker
                selectsRange
                startDate={fuelDateRange[0]}
                endDate={fuelDateRange[1]}
                onChange={(update) => setFuelDateRange(update)}
                isClearable
                placeholderText="Select date range"
                className="w-full p-2 border border-gray-300 rounded-lg"
                style={{ color: "#374151" }}
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", color: "#374151" }}>
                Maintenance Records Date Range
              </label>
              <DatePicker
                selectsRange
                startDate={maintenanceDateRange[0]}
                endDate={maintenanceDateRange[1]}
                onChange={(update) => setMaintenanceDateRange(update)}
                isClearable
                placeholderText="Select date range"
                className="w-full p-2 border border-gray-300 rounded-lg"
                style={{ color: "#374151" }}
              />
            </div>
          </div>
        </div>
      </div>

      <div ref={contentRef}>
        <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", marginBottom: "2.5rem", color: "#111827" }}>
          Statistics
        </h1>

        {loading && <p style={{ color: "#4B5563" }}>Loading data...</p>}
        {error && <p style={{ color: "#DC2626", marginBottom: "1.5rem" }}>{error}</p>}

        {/* Vehicles Table */}
        <div className="w-full max-w-5xl mb-10">
          <h2 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "1rem", color: "#1F2937" }}>
            Vehicles
          </h2>
          <div
            style={{
              backgroundColor: "#FFFFFF",
              padding: "1.5rem",
              borderRadius: "1rem",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              overflowX: "auto",
            }}
          >
            <table className="w-full text-left" style={{ color: "#374151" }}>
              <thead>
                <tr style={{ backgroundColor: "#E5E7EB" }}>
                  <th style={{ padding: "0.75rem" }}>Vehicle Number</th>
                  <th style={{ padding: "0.75rem" }}>Model</th>
                  <th style={{ padding: "0.75rem" }}>Make</th>
                  <th style={{ padding: "0.75rem" }}>Colour</th>
                  <th style={{ padding: "0.75rem" }}>YOM</th>
                  <th style={{ padding: "0.75rem" }}>YOR</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.length > 0 ? (
                  vehicles.map((vehicle) => (
                    <tr
                      key={vehicle._id}
                      className="border-b"
                      style={{ ":hover": { backgroundColor: "#F3F4F6" } }}
                    >
                      <td style={{ padding: "0.75rem" }}>{vehicle.vehicle_Num}</td>
                      <td style={{ padding: "0.75rem" }}>{vehicle.vehicle_Model}</td>
                      <td style={{ padding: "0.75rem" }}>{vehicle.vehicle_Make}</td>
                      <td style={{ padding: "0.75rem" }}>{vehicle.vehicle_Colour}</td>
                      <td style={{ padding: "0.75rem" }}>{vehicle.vehicle_YOM}</td>
                      <td style={{ padding: "0.75rem" }}>{vehicle.vehicle_YOR}</td>
                    </tr>
                  ))
                ) : (
                  <tr key="no-vehicles">
                    <td colSpan="6" style={{ padding: "0.75rem", textAlign: "center" }}>
                      No vehicles found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Fuel/Mileage Table */}
        <div className="w-full max-w-5xl mb-10">
          <h2 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "1rem", color: "#1F2937" }}>
            Fuel & Mileage Records
          </h2>
          <div
            style={{
              backgroundColor: "#FFFFFF",
              padding: "1.5rem",
              borderRadius: "1rem",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              overflowX: "auto",
            }}
          >
            <table className="w-full text-left" style={{ color: "#374151" }}>
              <thead>
                <tr style={{ backgroundColor: "#E5E7EB" }}>
                  <th style={{ padding: "0.75rem" }}>Vehicle Number</th>
                  <th style={{ padding: "0.75rem" }}>Mileage (km)</th>
                  <th style={{ padding: "0.75rem" }}>Fuel Cost (LKR)</th>
                  <th style={{ padding: "0.75rem" }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {fuelRecords.length > 0 ? (
                  fuelRecords.map((record) => (
                    <tr
                      key={record._id}
                      className="border-b"
                      style={{ ":hover": { backgroundColor: "#F3F4F6" } }}
                    >
                      <td style={{ padding: "0.75rem" }}>{record.vehicle_Num}</td>
                      <td style={{ padding: "0.75rem" }}>{record.vehicle_Milage}</td>
                      <td style={{ padding: "0.75rem" }}>{record.vehicle_Fuel}</td>
                      <td style={{ padding: "0.75rem" }}>
                        {new Date(record.vehicle_FuelDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr key="no-fuel-records">
                    <td colSpan="4" style={{ padding: "0.75rem", textAlign: "center" }}>
                      No fuel/mileage records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Maintenance Table */}
        <div className="w-full max-w-5xl mb-10">
          <h2 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "1rem", color: "#1F2937" }}>
            Maintenance Records
          </h2>
          <div
            style={{
              backgroundColor: "#FFFFFF",
              padding: "1.5rem",
              borderRadius: "1rem",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              overflowX: "auto",
            }}
          >
            <table className="w-full text-left" style={{ color: "#374151" }}>
              <thead>
                <tr style={{ backgroundColor: "#E5E7EB" }}>
                  <th style={{ padding: "0.75rem" }}>Vehicle Number</th>
                  <th style={{ padding: "0.75rem" }}>Cost (LKR)</th>
                  <th style={{ padding: "0.75rem" }}>Description</th>
                  <th style={{ padding: "0.75rem" }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {maintenanceRecords.length > 0 ? (
                  maintenanceRecords.map((record) => (
                    <tr
                      key={record._id}
                      className="border-b"
                      style={{ ":hover": { backgroundColor: "#F3F4F6" } }}
                    >
                      <td style={{ padding: "0.75rem" }}>{record.vehicle_Num}</td>
                      <td style={{ padding: "0.75rem" }}>{record.vehicle_MainCost}</td>
                      <td style={{ padding: "0.75rem" }}>{record.vehicle_Description}</td>
                      <td style={{ padding: "0.75rem" }}>
                        {new Date(record.vehicle_MainDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr key="no-maintenance-records">
                    <td colSpan="4" style={{ padding: "0.75rem", textAlign: "center" }}>
                      No maintenance records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Charts Section */}
        <div className="w-full max-w-5xl mb-10">
          <h2 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "1rem", color: "#1F2937" }}>
            Data Visualizations
          </h2>

          {/* Fuel Costs Chart */}
          <div
            style={{
              backgroundColor: "#FFFFFF",
              padding: "1.5rem",
              borderRadius: "1rem",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              marginBottom: "1.5rem",
            }}
          >
            <h3 style={{ fontSize: "1.25rem", fontWeight: "500", marginBottom: "1rem", color: "#1F2937" }}>
              Fuel Costs per Vehicle
            </h3>
            {vehicleNumbers.length > 0 ? (
              <Bar
                data={fuelCostsData}
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    title: { display: true, text: "Fuel Costs per Vehicle" },
                  },
                }}
              />
            ) : (
              <p style={{ color: "#4B5563", textAlign: "center" }}>
                No data available for fuel costs chart.
              </p>
            )}
          </div>

          {/* Maintenance Costs Chart */}
          <div
            style={{
              backgroundColor: "#FFFFFF",
              padding: "1.5rem",
              borderRadius: "1rem",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              marginBottom: "1.5rem",
            }}
          >
            <h3 style={{ fontSize: "1.25rem", fontWeight: "500", marginBottom: "1rem", color: "#1F2937" }}>
              Maintenance Costs per Vehicle
            </h3>
            {vehicleNumbers.length > 0 ? (
              <Bar
                data={maintenanceCostsData}
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    title: { display: true, text: "Maintenance Costs per Vehicle" },
                  },
                }}
              />
            ) : (
              <p style={{ color: "#4B5563", textAlign: "center" }}>
                No data available for maintenance costs chart.
              </p>
            )}
          </div>

          {/* Mileage Chart */}
          <div
            style={{
              backgroundColor: "#FFFFFF",
              padding: "1.5rem",
              borderRadius: "1rem",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            }}
          >
            <h3 style={{ fontSize: "1.25rem", fontWeight: "500", marginBottom: "1rem", color: "#1F2937" }}>
              Mileage per Vehicle
            </h3>
            {vehicleNumbers.length > 0 ? (
              <Bar
                data={mileageData}
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    title: { display: true, text: "Mileage per Vehicle" },
                  },
                }}
              />
            ) : (
              <p style={{ color: "#4B5563", textAlign: "center" }}>
                No data available for mileage chart.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex space-x-4">
        <button
          type="button"
          onClick={exportToPDF}
          style={{
            backgroundColor: "#2563EB",
            color: "#FFFFFF",
            padding: "0.5rem 1rem",
            borderRadius: "0.75rem",
            transition: "background-color 0.2s",
            transform: "scale(1)",
            cursor: "pointer",
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#1D4ED8")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#2563EB")}
        >
          Export to PDF
        </button>
        <button
          type="button"
          onClick={() => router.push("/transporthome")}
          style={{
            backgroundColor: "#4B5563",
            color: "#FFFFFF",
            padding: "0.5rem 1rem",
            borderRadius: "0.75rem",
            transition: "background-color 0.2s",
            transform: "scale(1)",
            cursor: "pointer",
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#374151")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#4B5563")}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}