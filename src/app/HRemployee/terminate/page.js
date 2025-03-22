"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function TerminateEmployee() {
  const [activeEmployees, setActiveEmployees] = useState([]);
  const [inactiveEmployees, setInactiveEmployees] = useState([]);
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
      const allEmployees = response.data || [];
      setActiveEmployees(allEmployees.filter((emp) => emp.employee_status === "active"));
      setInactiveEmployees(allEmployees.filter((emp) => emp.employee_status === "inactive")); // Fixed case sensitivity
    } catch (error) {
      console.error("Error fetching employees:", error);
      setError("Failed to load employees.");
    } finally {
      setLoading(false);
    }
  };

  const calculateActivePeriod = (dob) => {
    const today = new Date();
    const startDate = new Date(dob);
    const diffTime = today - startDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return {
      period: `${startDate.toLocaleDateString()} - ${today.toLocaleDateString()}`,
      days: diffDays,
    };
  };

  const handleTerminate = async (employeeId) => {
    if (!confirm("Are you sure you want to terminate this employee?")) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.put(`http://localhost:5000/api/employee/${employeeId}`, {
        employee_status: "inactive", // Consistent lowercase as per common practice
      });
      console.log("Employee terminated:", response.data);

      const terminatedEmployee = activeEmployees.find((emp) => emp._id === employeeId);
      setActiveEmployees((prev) => prev.filter((emp) => emp._id !== employeeId));
      setInactiveEmployees((prev) => [
        ...prev,
        { ...terminatedEmployee, employee_status: "inactive" },
      ]);
    } catch (error) {
      console.error("Error terminating employee:", error);
      setError(error.response?.data?.error || "Failed to terminate employee.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Terminate Employee</h1>

        {/* Active Employees Section */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Active Employees</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-700">
                  <th className="p-3 text-left font-medium">ID</th>
                  <th className="p-3 text-left font-medium">Name</th>
                  <th className="p-3 text-left font-medium">DOB</th>
                  <th className="p-3 text-left font-medium">Active Period</th>
                  <th className="p-3 text-left font-medium">Days Active</th>
                  <th className="p-3 text-left font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {activeEmployees.map((emp) => {
                  const { period, days } = calculateActivePeriod(emp.employee_dob || new Date());
                  return (
                    <tr key={emp._id} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="p-3 text-gray-700">{emp.employee_id || "N/A"}</td>
                      <td className="p-3 text-gray-700">{emp.employee_name || "N/A"}</td>
                      <td className="p-3 text-gray-700">
                        {emp.employee_dob
                          ? new Date(emp.employee_dob).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="p-3 text-gray-700">{period}</td>
                      <td className="p-3 text-gray-700">{days}</td>
                      <td className="p-3">
                        <button
                          onClick={() => handleTerminate(emp._id)}
                          disabled={loading}
                          className={`btn-terminate px-4 py-2 text-sm ${
                            loading ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          {loading ? "Terminating..." : "Terminate"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {loading && <p className="mt-4 text-gray-500">Loading active employees...</p>}
          {!loading && activeEmployees.length === 0 && !error && (
            <p className="mt-4 text-gray-500">No active employees found.</p>
          )}
          {!loading && error && <p className="mt-4 text-red-500">{error}</p>}
        </div>

        {/* Inactive Employees Section */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Inactive Employees</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-700">
                  <th className="p-3 text-left font-medium">ID</th>
                  <th className="p-3 text-left font-medium">Name</th>
                  <th className="p-3 text-left font-medium">DOB</th>
                  <th className="p-3 text-left font-medium">Active Period</th>
                  <th className="p-3 text-left font-medium">Days Active</th>
                </tr>
              </thead>
              <tbody>
                {inactiveEmployees.map((emp) => {
                  const { period, days } = calculateActivePeriod(emp.employee_dob || new Date());
                  return (
                    <tr key={emp._id} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="p-3 text-gray-700">{emp.employee_id || "N/A"}</td>
                      <td className="p-3 text-gray-700">{emp.employee_name || "N/A"}</td>
                      <td className="p-3 text-gray-700">
                        {emp.employee_dob
                          ? new Date(emp.employee_dob).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="p-3 text-gray-700">{period}</td>
                      <td className="p-3 text-gray-700">{days}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {loading && <p className="mt-4 text-gray-500">Loading inactive employees...</p>}
          {!loading && inactiveEmployees.length === 0 && !error && (
            <p className="mt-4 text-gray-500">No inactive employees found.</p>
          )}
          {!loading && error && <p className="mt-4 text-red-500">{error}</p>}
        </div>

        {/* Styling */}
        <style jsx>{`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap');
          .min-h-screen {
            font-family: 'Poppins', sans-serif;
          }
          .btn-terminate {
            display: inline-block;
            background-color: #ef4444; /* Red */
            color: white;
            padding: 11px 20px;
            border-radius: 8px;
            text-align: center;
            cursor: pointer;
            transition: background-color 0.2s ease, box-shadow 0.2s ease;
          }
          .btn-terminate:hover:not(:disabled) {
            background-color: #dc2626;
            box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
          }
          .shadow-md {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          }
        `}</style>
      </div>
    </div>
  );
}