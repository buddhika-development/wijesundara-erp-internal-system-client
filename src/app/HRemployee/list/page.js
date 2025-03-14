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
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">Employee List</h1>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">ID</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">DOB</th>
            <th className="border p-2">City</th>
            <th className="border p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp._id} className="border">
              <td className="border p-2">{emp.employee_id}</td>
              <td className="border p-2">{emp.employee_name}</td>
              <td className="border p-2">{new Date(emp.employee_dob).toLocaleDateString()}</td>
              <td className="border p-2">{emp.employee_address_address_city}</td>
              <td className="border p-2">{emp.employee_status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
