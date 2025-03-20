"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/employee");
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F8FF] p-5">
      <h1 className="text-2xl font-bold mb-4 text-black">Employee List</h1>
      <div className="bg-gray-300 p-4 rounded-lg">
        <table className="w-full border-collapse border border-gray-500">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-500 p-2 text-black">ID</th>
              <th className="border border-gray-500 p-2 text-black">Name</th>
              <th className="border border-gray-500 p-2 text-black">DOB</th>
              <th className="border border-gray-500 p-2 text-black">City</th>
              <th className="border border-gray-500 p-2 text-black">Status</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp._id} className="border border-gray-500 bg-white">
                <td className="border border-gray-500 p-2 text-black">{emp.employee_id}</td>
                <td className="border border-gray-500 p-2 text-black">{emp.employee_name}</td>
                <td className="border border-gray-500 p-2 text-black">
                  {new Date(emp.employee_dob).toLocaleDateString()}
                </td>
                <td className="border border-gray-500 p-2 text-black">
                  {emp.employee_address_address_city}
                </td>
                <td className="border border-gray-500 p-2 text-black">{emp.employee_status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap');
        .min-h-screen {
          font-family: 'Poppins', sans-serif;
        }
      `}</style>
    </div>
  );
}