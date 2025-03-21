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

      //to get only the employees whose currently working only working in the company

      const activeEmployees =response.data.filter(emp => emp.employee_status === 'active');
      setEmployees(activeEmployees);
    } catch (error) {
      console.error("error getting active employees:", error);
      setError("failed load active employees");
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
            monthly_salary: res.data.totalEmployerCost,
          }))
          .catch((err) => {
            return {
              employee_id: emp._id,
              employee_name: emp.employee_name,
              monthly_salary: 0,
            };
          })
      );

      const salaryData = await Promise.all(salaryPromises);
      const total = salaryData.reduce((sum, emp) => sum + emp.monthly_salary, 0);
      setSalaries(salaryData);
      setTotalSalary(total);
    } catch (error) {
      console.error("error getting the salaries:", error);
      setError("failed to get the  salary summary");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-5">
      <h1 className="text-2xl font-bold mb-4 text-black">Monthly Salary Summary</h1>

      {/* Year and Month Selection */}
      <div className="bg-gray-300 p-4 rounded-lg mb-4 flex gap-4">
        <div>
          <label className="block text-sm font-medium text-black mb-1" htmlFor="year">
            Year
          </label>
          <input
            type="number"
            id="year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            min="2020"
            max={new Date().getFullYear()}
            className="btn-light w-24"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-black mb-1" htmlFor="month">
            Month
          </label>
          <select
            id="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="btn-light"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={(i + 1).toString().padStart(2, "0")}>
                {new Date(0, i).toLocaleString("default", { month: "long" })}
              </option>
            ))}
          </select>
        </div>
      </div>
      {loading && <p className="text-black p-4">Loading salary summary...</p>}
      {error && <p className="text-red-500 p-4">{error}</p>}

      {/*salary summary*/}
      {salaries.length > 0 && (
        <div className="bg-gray-300 p-4 rounded-lg">
          <table className="w-full border-collapse bg-white rounded">
            <thead>
              <tr className="bg-gray-400">
                <th className="p-2 text-black text-left">Employee Name</th>
                <th className="p-2 text-black text-right">Monthly Salary (Total Employer Cost)</th>
              </tr>
            </thead>
            <tbody>
              {salaries.map((emp) => (
                <tr key={emp.employee_id} className="border-b border-gray-400">
                  <td className="p-2 text-black">{emp.employee_name}</td>
                  <td className="p-2 text-black text-right">
                    {emp.monthly_salary.toLocaleString()}
                  </td>
                </tr>
              ))}
              <tr className="font-bold bg-gray-200">
                <td className="p-2 text-black">Total</td>
                <td className="p-2 text-black text-right">
                  {totalSalary.toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Styling */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap');
        .min-h-screen {
          background-color: #F6F8FF;
          font-family: 'Poppins', sans-serif;
        }
        .btn-light {
          display: block;
          background-color: white;
          color: black;
          border: 1px solid black;
          padding: 10px;
          margin: 5px 0;
          border-radius: 5px;
          text-align: center;
          cursor: pointer;
          font-family: 'Poppins', sans-serif;
        }
        .btn-light:hover {
          background-color: #e0e0e0;
          border: 1px solid black;
        }
      `}</style>
    </div>
  );
}