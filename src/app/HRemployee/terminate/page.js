"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function TerminateEmployee() {
  const [activeEmployees, setActiveEmployees] = useState([]);
  const [inactiveEmployees, setInactiveEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch employees on component mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  // Fetch all employees from API and split by status
  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/employee");
      const allEmployees = response.data;
      setActiveEmployees(allEmployees.filter(emp => emp.employee_status === "Active"));
      setInactiveEmployees(allEmployees.filter(emp => emp.employee_status === "Inactive"));
    } catch (error) {
      console.error("Error fetching employees:", error);
      setError("Failed to load employees.");
    }
  };

  // Calculate active period and days (assuming hire date is needed)
  const calculateActivePeriod = (dob) => {
    const today = new Date(); // Using today as placeholder for termination date
    const startDate = new Date(dob); // Using dob as placeholder; replace with hire date if available
    const diffTime = today - startDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Days difference

    return {
      period: `${startDate.toLocaleDateString()} - ${today.toLocaleDateString()}`,
      days: diffDays,
    };
  };

  // Handle terminate button click
  const handleTerminate = async (employeeId) => {
    if (!confirm("Are you sure you want to terminate this employee?")) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.put(`http://localhost:5000/api/employee/${employeeId}`, {
        employee_status: "Inactive",
      });
      console.log("Employee terminated:", response.data);

      // Move the employee from active to inactive list
      const terminatedEmployee = activeEmployees.find(emp => emp._id === employeeId);
      setActiveEmployees((prev) => prev.filter((emp) => emp._id !== employeeId));
      setInactiveEmployees((prev) => [...prev, { ...terminatedEmployee, employee_status: "Inactive" }]);
    } catch (error) {
      console.error("Error terminating employee:", error);
      setError(error.response?.data?.error || "Failed to terminate employee.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">Terminate Employee</h1>

      {/* Active Employees Table */}
      <h2 className="text-xl font-semibold mb-2">Active Employees</h2>
      <table className="w-full border-collapse border border-gray-300 mb-6">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2 text-black">ID</th>
            <th className="border p-2 text-black">Name</th>
            <th className="border p-2 text-black">DOB</th>
            <th className="border p-2 text-black">Active Period</th>
            <th className="border p-2 text-black">Days Active</th>
            <th className="border p-2 text-black">Action</th>
          </tr>
        </thead>
        <tbody>
          {activeEmployees.map((emp) => {
            const { period, days } = calculateActivePeriod(emp.employee_dob);
            return (
              <tr key={emp._id} className="border">
                <td className="border p-2">{emp.employee_id}</td>
                <td className="border p-2">{emp.employee_name}</td>
                <td className="border p-2">{new Date(emp.employee_dob).toLocaleDateString()}</td>
                <td className="border p-2">{period}</td>
                <td className="border p-2">{days}</td>
                <td className="border p-2">
                  <button
                    onClick={() => handleTerminate(emp._id)}
                    disabled={loading}
                    className={`bg-red-500 text-white py-1 px-3 rounded ${
                      loading ? "opacity-50 cursor-not-allowed" : "hover:bg-red-600"
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
      {activeEmployees.length === 0 && !loading && !error && (
        <p className="mb-6">No active employees found.</p>
      )}

      {/* Inactive Employees Table */}
      <h2 className="text-xl font-semibold mb-2">Inactive Employees</h2>
      <table className="w-full border-collapse border border-gray-300 mb-4">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2 text-black">ID</th>
            <th className="border p-2 text-black">Name</th>
            <th className="border p-2 text-black">DOB</th>
            <th className="border p-2 text-black">Active Period</th>
            <th className="border p-2 text-black">Days Active</th>
          </tr>
        </thead>
        <tbody>
          {inactiveEmployees.map((emp) => {
            const { period, days } = calculateActivePeriod(emp.employee_dob);
            return (
              <tr key={emp._id} className="border">
                <td className="border p-2">{emp.employee_id}</td>
                <td className="border p-2">{emp.employee_name}</td>
                <td className="border p-2">{new Date(emp.employee_dob).toLocaleDateString()}</td>
                <td className="border p-2">{period}</td>
                <td className="border p-2">{days}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {inactiveEmployees.length === 0 && !loading && !error && (
        <p>No inactive employees found.</p>
      )}

      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}