"use client"

import { useState } from "react";
import axios from "axios";

export default function AddEmployee() {
  const [employeeData, setEmployeeData] = useState({
    employee_id: "", // unique employee ID
    employee_name: "",
    employee_dob: "",
    employee_address_address_line_one: "",
    employee_address_address_line_two: "",
    employee_address_address_city: "",
    employee_bank_account_number: "",
    employee_status: "active", // default status "active"
  });

  // Handle form input change
  const handleChange = (e) => {
    setEmployeeData({
      ...employeeData,
      [e.target.name]: e.target.value,
    });
  };

  // Submit the form data
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Sending the employee data to the backend via Axios
      const response = await axios.post("http://localhost:5000/api/employee", employeeData);
      
      // Log response from the backend
      console.log("Employee Added: ", response.data);
      alert("Employee Added Successfully!");

      // Reset the form after successful submission
      setEmployeeData({
        employee_id: "",
        employee_name: "",
        employee_dob: "",
        employee_address_address_line_one: "",
        employee_address_address_line_two: "",
        employee_address_address_city: "",
        employee_bank_account_number: "",
        employee_status: "active",
      });
    } catch (err) {
      console.error(err.response ? err.response.data : err.message);
      alert("Error adding employee. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Add New Employee</h1>

        {/* Employee ID */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Employee ID</label>
          <input
            type="number"
            name="employee_id"
            value={employeeData.employee_id}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Employee Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Employee Name</label>
          <input
            type="text"
            name="employee_name"
            value={employeeData.employee_name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Employee Date of Birth */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Date of Birth</label>
          <input
            type="date"
            name="employee_dob"
            value={employeeData.employee_dob}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Address Line 1 */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Address Line 1</label>
          <input
            type="text"
            name="employee_address_address_line_one"
            value={employeeData.employee_address_address_line_one}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Address Line 2 */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Address Line 2</label>
          <input
            type="text"
            name="employee_address_address_line_two"
            value={employeeData.employee_address_address_line_two}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* City */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">City</label>
          <input
            type="text"
            name="employee_address_address_city"
            value={employeeData.employee_address_address_city}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Bank Account Number */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Bank Account Number</label>
          <input
            type="number"
            name="employee_bank_account_number"
            value={employeeData.employee_bank_account_number}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Status */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            name="employee_status"
            value={employeeData.employee_status}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700"
        >
          Add Employee
        </button>
      </form>
    </div>
  );
}
