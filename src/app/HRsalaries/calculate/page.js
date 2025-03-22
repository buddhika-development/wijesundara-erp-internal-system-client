"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function ViewSalary() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [month, setMonth] = useState((new Date().getMonth() + 1).toString().padStart(2, "0"));
  const [salaryData, setSalaryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/employee");
      setEmployees(response.data || []);
    } catch (error) {
      console.error("Error fetching employees:", error);
      setError("Failed to load employees.");
    }
  };

  const fetchSalary = async (employeeId, selectedYear, selectedMonth) => {
    setLoading(true);
    setError(null);
    setSalaryData(null);

    try {
      console.log(`Fetching salary for: /api/salary/${employeeId}/${selectedYear}/${selectedMonth}`);
      const response = await axios.get(
        `http://localhost:5000/api/salary/${employeeId}/${selectedYear}/${selectedMonth}`
      );
      console.log("Salary data received:", response.data);
      setSalaryData(response.data || {});
    } catch (error) {
      console.error("Error fetching salary:", error.response?.data || error.message);
      setError(error.response?.data?.message || "Failed to fetch salary details.");
    } finally {
      setLoading(false);
    }
  };

  const handleEmployeeSelect = (employeeId) => {
    const employee = employees.find((emp) => emp._id === employeeId);
    setSelectedEmployee(employee);
    if (employee) {
      fetchSalary(employee._id, year, month);
    }
  };

  const handleDateChange = () => {
    if (selectedEmployee) {
      fetchSalary(selectedEmployee._id, year, month);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">View Employee Salary</h1>

        {/* Select Year and Month */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
          <div className="flex gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="year">
                Year
              </label>
              <input
                type="number"
                id="year"
                value={year}
                onChange={(e) => {
                  setYear(e.target.value);
                  handleDateChange();
                }}
                min="2000"
                max={new Date().getFullYear()}
                className="input-field w-24"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="month">
                Month
              </label>
              <select
                id="month"
                value={month}
                onChange={(e) => {
                  setMonth(e.target.value);
                  handleDateChange();
                }}
                className="input-field w-32"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={(i + 1).toString().padStart(2, "0")}>
                    {new Date(0, i).toLocaleString("default", { month: "long" })}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Employee List */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Employee List</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-700">
                  <th className="p-3 text-left font-medium">ID</th>
                  <th className="p-3 text-left font-medium">Name</th>
                  <th className="p-3 text-left font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp._id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="p-3 text-gray-700">{emp.employee_id || "N/A"}</td>
                    <td className="p-3 text-gray-700">{emp.employee_name || "N/A"}</td>
                    <td className="p-3">
                      <button
                        onClick={() => handleEmployeeSelect(emp._id)}
                        className={`btn-primary px-4 py-2 text-sm ${
                          selectedEmployee?._id === emp._id ? "bg-blue-600" : ""
                        }`}
                      >
                        {selectedEmployee?._id === emp._id ? "Selected" : "View"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {employees.length === 0 && !error && (
            <p className="mt-4 text-gray-500">No employees found.</p>
          )}
          {error && !loading && <p className="mt-4 text-red-500 text-sm">{error}</p>}
        </div>

        {/* Salary Details */}
        {loading && <p className="text-gray-500">Loading salary details...</p>}
        {salaryData && !loading && (
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Salary Details for {selectedEmployee?.employee_name || "Unknown"} ({salaryData.month || "N/A"})
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <tbody>
                  <tr className="border-t border-gray-100">
                    <td className="p-3 text-gray-700 font-medium">Job Role</td>
                    <td className="p-3 text-gray-700">{salaryData.job_role || "N/A"}</td>
                  </tr>
                  <tr className="border-t border-gray-100">
                    <td className="p-3 text-gray-700 font-medium">Base Salary</td>
                    <td className="p-3 text-gray-700">
                      {(salaryData.baseSalary || 0).toLocaleString()}
                    </td>
                  </tr>
                  <tr className="border-t border-gray-100">
                    <td className="p-3 text-gray-700 font-medium">Total Days Attended</td>
                    <td className="p-3 text-gray-700">{salaryData.totalDaysAttended || "N/A"}</td>
                  </tr>
                  <tr className="border-t border-gray-100">
                    <td className="p-3 text-gray-700 font-medium">Extra Days</td>
                    <td className="p-3 text-gray-700">{salaryData.extraDays || "N/A"}</td>
                  </tr>
                  <tr className="border-t border-gray-100">
                    <td className="p-3 text-gray-700 font-medium">Attendance Bonus</td>
                    <td className="p-3 text-gray-700">
                      {(salaryData.attendanceBonus || 0).toLocaleString()}
                    </td>
                  </tr>
                  <tr className="border-t border-gray-100">
                    <td className="p-3 text-gray-700 font-medium">Monthly Bonus</td>
                    <td className="p-3 text-gray-700">
                      {(salaryData.monthlyBonus || 0).toLocaleString()}
                    </td>
                  </tr>
                  <tr className="border-t border-gray-100">
                    <td className="p-3 text-gray-700 font-medium">Employee EPF</td>
                    <td className="p-3 text-gray-700">
                      {(salaryData.employeeEPF || 0).toLocaleString()}
                    </td>
                  </tr>
                  <tr className="border-t border-gray-100">
                    <td className="p-3 text-gray-700 font-medium">Employer EPF</td>
                    <td className="p-3 text-gray-700">
                      {(salaryData.employerEPF || 0).toLocaleString()}
                    </td>
                  </tr>
                  <tr className="border-t border-gray-100">
                    <td className="p-3 text-gray-700 font-medium">Employer ETF</td>
                    <td className="p-3 text-gray-700">
                      {(salaryData.employerETF || 0).toLocaleString()}
                    </td>
                  </tr>
                  <tr className="border-t border-gray-100">
                    <td className="p-3 text-gray-700 font-medium">Net Salary</td>
                    <td className="p-3 text-gray-700 font-bold">
                      {(salaryData.netSalary || 0).toLocaleString()}
                    </td>
                  </tr>
                  <tr className="border-t border-gray-100">
                    <td className="p-3 text-gray-700 font-medium">Total Employer Cost</td>
                    <td className="p-3 text-gray-700">
                      {(salaryData.totalEmployerCost || 0).toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Styling */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap');
        .min-h-screen {
          font-family: 'Poppins', sans-serif;
        }
        .input-field {
          display: block;
          width: 100%;
          background-color: #f9fafb;
          color: #1f2937;
          border: 1px solid #d1d5db;
          padding: 10px;
          border-radius: 8px;
          font-size: 14px;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .input-field:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
        }
        .btn-primary {
          display: inline-block;
          background-color: #3b82f6; /* Blue */
          color: white;
          padding: 11px 20px;
          border-radius: 8px;
          text-align: center;
          cursor: pointer;
          transition: background-color 0.2s ease, box-shadow 0.2s ease;
        }
        .btn-primary:hover:not(:disabled) {
          background-color: #2563eb;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
        }
        .shadow-md {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }
      `}</style>
    </div>
  );
}