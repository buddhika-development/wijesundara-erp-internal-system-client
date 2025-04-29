"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function MonthlySalarySummary() {
  const [employees, setEmployees] = useState([]);
  const [salaries, setSalaries] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [month, setMonth] = useState((new Date().getMonth() + 1).toString().padStart(2, "0"));
  const [totalSalary, setTotalSalary] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [requestSent, setRequestSent] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (employees.length > 0) {
      fetchAllSalaries();
    }
  }, [year, month, employees]);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/employee");
      const activeEmployees = (response.data || []).filter(
        (emp) => emp.employee_status.toLowerCase() === "active"
      );
      setEmployees(activeEmployees);
    } catch (error) {
      console.error("Error getting active employees:", error);
      setError("Failed to load active employees.");
    }
  };

  const fetchAllSalaries = async () => {
    setLoading(true);
    setError(null);
    setSalaries([]);
    setTotalSalary(0);
    try {
      const salaryPromises = employees.map((emp) =>
        axios
          .get(`http://localhost:5000/api/salary/${emp._id}/${year}/${month}`)
          .then((res) => ({
            employee_id: emp._id,
            employee_name: emp.employee_name,
            monthly_salary: res.data.totalEmployerCost || 0,
          }))
          .catch((err) => ({
            employee_id: emp._id,
            employee_name: emp.employee_name,
            monthly_salary: 0,
          }))
      );

      const salaryData = await Promise.all(salaryPromises);
      const total = salaryData.reduce((sum, emp) => sum + emp.monthly_salary, 0);
      setSalaries(salaryData);
      setTotalSalary(total);
    } catch (error) {
      console.error("Error getting the salaries:", error);
      setError("Failed to fetch salary summary.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendApproval = async () => {
    setLoading(true);
    setError(null);
    try {
      const monthName = new Date(0, parseInt(month) - 1).toLocaleString("default", { month: "long" });
      const response = await axios.post("http://localhost:5000/api/salary/requestApproval", {
        year,
        month: monthName,
        totalSalary,
      });
      console.log("Approval request response:", response.data);
      setRequestSent(true);
      alert("Salary approval request sent successfully!");
    } catch (error) {
      console.error("Error sending approval request:", error);
      setError(error.response?.data?.error || "Failed to send approval request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Monthly Salary Summary</h1>

        {/* Year and Month Selection */}
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
                onChange={(e) => setYear(e.target.value)}
                min="2020"
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
                onChange={(e) => setMonth(e.target.value)}
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

        {/* Loading, Error, and Success States */}
        {loading && (
          <p className="text-gray-500 flex items-center">
            <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="gray" strokeWidth="4" fill="none" />
              <path fill="currentColor" d="M4 12a8 8 0 018-8v8h-8z" />
            </svg>
            Loading salary summary...
          </p>
        )}
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {!loading && !error && salaries.length === 0 && (
          <p className="text-gray-500">No active employees or salary data for this month.</p>
        )}

        {/* Salary Summary */}
        {salaries.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-700">
                    <th className="p-3 text-left font-medium">Employee Name</th>
                    <th className="p-3 text-right font-medium">Monthly Salary (Total Employer Cost)</th>
                  </tr>
                </thead>
                <tbody>
                  {salaries.map((emp) => (
                    <tr key={emp.employee_id} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="p-3 text-gray-700">{emp.employee_name || "N/A"}</td>
                      <td className="p-3 text-gray-700 text-right">
                        {emp.monthly_salary.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  <tr className="border-t border-gray-100 bg-gray-50 font-bold">
                    <td className="p-3 text-gray-700">Total</td>
                    <td className="p-3 text-gray-700 text-right">
                      {totalSalary.toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Send for Approval Button */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSendApproval}
                className={`btn-primary w-48 ${loading || requestSent ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={loading || requestSent}
              >
                {requestSent ? "Request Sent" : "Send for Approval"}
              </button>
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