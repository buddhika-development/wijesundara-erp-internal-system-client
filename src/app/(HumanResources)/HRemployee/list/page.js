"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get("http://localhost:5000/api/employee");
      setEmployees(response.data || []); // Fallback to empty array if no data
    } catch (error) {
      console.error("Error fetching employees:", error);
      setError("Failed to load employees.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Employee List</h1>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-700">
                  <th className="p-3 text-left font-medium">ID</th>
                  <th className="p-3 text-left font-medium">Name</th>
                  <th className="p-3 text-left font-medium">DOB</th>
                  <th className="p-3 text-left font-medium">City</th>
                  <th className="p-3 text-left font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp._id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="p-3 text-gray-700">{emp.employee_id || "N/A"}</td>
                    <td className="p-3 text-gray-700">{emp.employee_name || "N/A"}</td>
                    <td className="p-3 text-gray-700">
                      {emp.employee_dob
                        ? new Date(emp.employee_dob).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="p-3 text-gray-700">{emp.employee_address_address_city || "N/A"}</td>
                    <td className="p-3 text-gray-700">{emp.employee_status || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {loading && <p className="mt-4 text-gray-500">Loading employees...</p>}
          {!loading && employees.length === 0 && !error && (
            <p className="mt-4 text-gray-500">No employees found.</p>
          )}
          {!loading && error && <p className="mt-4 text-red-500">{error}</p>}
        </div>
      </div>

      {/* Styling */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap');
        .min-h-screen {
          font-family: 'Poppins', sans-serif;
        }
        .shadow-md {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }
      `}</style>
    </div>
  );
}