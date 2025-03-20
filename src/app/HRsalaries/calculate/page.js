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
      setEmployees(response.data);
    } catch (error) {
      console.error("error fetching employees:", error);
      setError("failed to load employees");
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
      setSalaryData(response.data);
    } catch (error) {
      console.error("Error fetching salary:", error.response?.data || error.message);
      setError(error.response?.data?.message || "Failed to fetch salary deta");
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
    <div className="min-h-screen bg-[#F6F8FF] p-5">
      <h1 className="text-2xl font-bold mb-4 text-black">View Employee Salary</h1>

      {/* select year and month */}
      <div className="mb-4 flex gap-4 bg-gray-300 p-4 rounded-lg">
        <div>
          <label className="block text-sm font-medium text-black" htmlFor="year">
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
            className="mt-1 p-2 border border-gray-500 rounded w-24 bg-white text-black"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-black" htmlFor="month">
            Month
          </label>
          <select
            id="month"
            value={month}
            onChange={(e) => {
              setMonth(e.target.value);
              handleDateChange();
            }}
            className="mt-1 p-2 border border-gray-500 rounded bg-white text-black"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={(i + 1).toString().padStart(2, "0")}>
                {new Date(0, i).toLocaleString("default", { month: "long" })}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Employee List */}
      <div className="bg-gray-300 p-4 rounded-lg mb-6">
        <table className="w-full border-collapse border border-gray-500">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-500 p-2 text-black">ID</th>
              <th className="border border-gray-500 p-2 text-black">Name</th>
              <th className="border border-gray-500 p-2 text-black">Select</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp._id} className="border border-gray-500 bg-white">
                <td className="border border-gray-500 p-2 text-black">{emp.employee_id}</td>
                <td className="border border-gray-500 p-2 text-black">{emp.employee_name}</td>
                <td className="border border-gray-500 p-2">
                  <button
                    onClick={() => handleEmployeeSelect(emp._id)}
                    className={`py-1 px-3 rounded ${
                      selectedEmployee?._id === emp._id
                        ? "bg-red-600 text-white"
                        : "bg-red-500 text-white hover:bg-red-600"
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

      {/* Salary Details */}
      {loading && <p className="text-black">Loading salary details...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {salaryData && (
        <div className="border border-gray-500 p-4 rounded-lg bg-gray-300">
          <h2 className="text-xl font-semibold mb-2 text-black">
            Salary Details for {selectedEmployee?.employee_name} ({salaryData.month})
          </h2>
          <table className="w-full border-collapse border border-gray-500">
            <tbody>
              <tr className="bg-white">
                <td className="border border-gray-500 p-2 font-medium text-black">Job Role</td>
                <td className="border border-gray-500 p-2 text-black">{salaryData.job_role}</td>
              </tr>
              <tr className="bg-white">
                <td className="border border-gray-500 p-2 font-medium text-black">Base Salary</td>
                <td className="border border-gray-500 p-2 text-black">{salaryData.baseSalary.toLocaleString()}</td>
              </tr>
              <tr className="bg-white">
                <td className="border border-gray-500 p-2 font-medium text-black">Total Days Attended</td>
                <td className="border border-gray-500 p-2 text-black">{salaryData.totalDaysAttended}</td>
              </tr>
              <tr className="bg-white">
                <td className="border border-gray-500 p-2 font-medium text-black">Extra Days</td>
                <td className="border border-gray-500 p-2 text-black">{salaryData.extraDays}</td>
              </tr>
              <tr className="bg-white">
                <td className="border border-gray-500 p-2 font-medium text-black">Attendance Bonus</td>
                <td className="border border-gray-500 p-2 text-black">{salaryData.attendanceBonus.toLocaleString()}</td>
              </tr>
              <tr className="bg-white">
                <td className="border border-gray-500 p-2 font-medium text-black">Monthly Bonus</td>
                <td className="border border-gray-500 p-2 text-black">{salaryData.monthlyBonus.toLocaleString()}</td>
              </tr>
              <tr className="bg-white">
                <td className="border border-gray-500 p-2 font-medium text-black">Employee EPF</td>
                <td className="border border-gray-500 p-2 text-black">{salaryData.employeeEPF.toLocaleString()}</td>
              </tr>
              <tr className="bg-white">
                <td className="border border-gray-500 p-2 font-medium text-black">Employer EPF</td>
                <td className="border border-gray-500 p-2 text-black">{salaryData.employerEPF.toLocaleString()}</td>
              </tr>
              <tr className="bg-white">
                <td className="border border-gray-500 p-2 font-medium text-black">Employer ETF</td>
                <td className="border border-gray-500 p-2 text-black">{salaryData.employerETF.toLocaleString()}</td>
              </tr>
              <tr className="bg-white">
                <td className="border border-gray-500 p-2 font-medium text-black">Net Salary</td>
                <td className="border border-gray-500 p-2 font-bold text-black">
                  {salaryData.netSalary.toLocaleString()}
                </td>
              </tr>
              <tr className="bg-white">
                <td className="border border-gray-500 p-2 font-medium text-black">Total Employer Cost</td>
                <td className="border border-gray-500 p-2 text-black">{salaryData.totalEmployerCost.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}