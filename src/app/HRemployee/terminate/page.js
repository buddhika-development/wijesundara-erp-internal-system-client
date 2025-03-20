"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function TerminateEmployee() {
  const [activeEmployees, setActiveEmployees] = useState([]);
  const [inactiveEmployees, setInactiveEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/employee");
      const allEmployees = response.data;
      setActiveEmployees(allEmployees.filter(emp => emp.employee_status === "active"));
      setInactiveEmployees(allEmployees.filter(emp => emp.employee_status === "Inactive"));
    } catch (error) {
      console.error("Error fetching employees:", error);
      setError("Failed to load employees.");
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
        employee_status: "Inactive",
      });
      console.log("Employee terminated:", response.data);

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
    <div className="min-h-screen bg-[#F6F8FF] p-5">
      <h1 className="text-2xl font-bold mb-4 text-black">Terminate Employee</h1>

      {/* Active Employees Section */}
      <div className="bg-gray-300 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-2 text-black">Active Employees</h2>
        <table className="w-full border-collapse border border-gray-500">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-500 p-2 text-black">ID</th>
              <th className="border border-gray-500 p-2 text-black">Name</th>
              <th className="border border-gray-500 p-2 text-black">DOB</th>
              <th className="border border-gray-500 p-2 text-black">Active Period</th>
              <th className="border border-gray-500 p-2 text-black">Days Active</th>
              <th className="border border-gray-500 p-2 text-black">Action</th>
            </tr>
          </thead>
          <tbody>
            {activeEmployees.map((emp) => {
              const { period, days } = calculateActivePeriod(emp.employee_dob);
              return (
                <tr key={emp._id} className="border border-gray-500 bg-white">
                  <td className="border border-gray-500 p-2 text-black">{emp.employee_id}</td>
                  <td className="border border-gray-500 p-2 text-black">{emp.employee_name}</td>
                  <td className="border border-gray-500 p-2 text-black">
                    {new Date(emp.employee_dob).toLocaleDateString()}
                  </td>
                  <td className="border border-gray-500 p-2 text-black">{period}</td>
                  <td className="border border-gray-500 p-2 text-black">{days}</td>
                  <td className="border border-gray-500 p-2">
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
          <p className="mt-2 text-black">No active employees found.</p>
        )}
      </div>

      {/* Inactive Employees Section */}
      <div className="bg-gray-300 p-4 rounded-lg mb-4">
        <h2 className="text-xl font-semibold mb-2 text-black">Inactive Employees</h2>
        <table className="w-full border-collapse border border-gray-500">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-500 p-2 text-black">ID</th>
              <th className="border border-gray-500 p-2 text-black">Name</th>
              <th className="border border-gray-500 p-2 text-black">DOB</th>
              <th className="border border-gray-500 p-2 text-black">Active Period</th>
              <th className="border border-gray-500 p-2 text-black">Days Active</th>
            </tr>
          </thead>
          <tbody>
            {inactiveEmployees.map((emp) => {
              const { period, days } = calculateActivePeriod(emp.employee_dob);
              return (
                <tr key={emp._id} className="border border-gray-500 bg-white">
                  <td className="border border-gray-500 p-2 text-black">{emp.employee_id}</td>
                  <td className="border border-gray-500 p-2 text-black">{emp.employee_name}</td>
                  <td className="border border-gray-500 p-2 text-black">
                    {new Date(emp.employee_dob).toLocaleDateString()}
                  </td>
                  <td className="border border-gray-500 p-2 text-black">{period}</td>
                  <td className="border border-gray-500 p-2 text-black">{days}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {inactiveEmployees.length === 0 && !loading && !error && (
          <p className="mt-2 text-black">No inactive employees found.</p>
        )}
      </div>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap');
        .min-h-screen {
          font-family: 'Poppins', sans-serif;
        }
      `}</style>
    </div>
  );
}