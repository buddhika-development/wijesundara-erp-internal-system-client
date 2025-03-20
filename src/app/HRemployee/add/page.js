"use client";
import { useState } from "react";
import axios from "axios";

export default function AddEmployee() {
  const [employeeData, setEmployeeData] = useState({
    employee_id: "",
    employee_name: "",
    employee_dob: "",
    employee_address_address_line_one: "",
    employee_address_address_line_two: "",
    employee_address_address_city: "",
    employee_bank_account_number: "",
    employee_status: "active",
  });

  const handleChange = (e) => {
    setEmployeeData({
      ...employeeData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/employee", employeeData);
      console.log("Employee Added: ", response.data);
      alert("Employee Added Successfully!");
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
    <div className="min-h-screen bg-[#F6F8FF] flex items-center justify-center p-5">
      <form 
        onSubmit={handleSubmit} 
        className="bg-gray-300 p-8 rounded-lg border border-gray-500 w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-4 text-black">Add New Employee</h1>

        {/* Employee ID */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-black">Employee ID</label>
          <input
            type="number"
            name="employee_id"
            value={employeeData.employee_id}
            onChange={handleChange}
            className="w-full p-2 border border-gray-500 rounded-md bg-white text-black"
            required
          />
        </div>

        {/* Employee Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-black">Employee Name</label>
          <input
            type="text"
            name="employee_name"
            value={employeeData.employee_name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-500 rounded-md bg-white text-black"
            required
          />
        </div>

        {/* Employee Date of Birth */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-black">Date of Birth</label>
          <input
            type="date"
            name="employee_dob"
            value={employeeData.employee_dob}
            onChange={handleChange}
            className="w-full p-2 border border-gray-500 rounded-md bg-white text-black"
            required
          />
        </div>

        {/* Address Line 1 */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-black">Address Line 1</label>
          <input
            type="text"
            name="employee_address_address_line_one"
            value={employeeData.employee_address_address_line_one}
            onChange={handleChange}
            className="w-full p-2 border border-gray-500 rounded-md bg-white text-black"
            required
          />
        </div>

        {/* Address Line 2 */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-black">Address Line 2</label>
          <input
            type="text"
            name="employee_address_address_line_two"
            value={employeeData.employee_address_address_line_two}
            onChange={handleChange}
            className="w-full p-2 border border-gray-500 rounded-md bg-white text-black"
          />
        </div>

        {/* City */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-black">City</label>
          <input
            type="text"
            name="employee_address_address_city"
            value={employeeData.employee_address_address_city}
            onChange={handleChange}
            className="w-full p-2 border border-gray-500 rounded-md bg-white text-black"
            required
          />
        </div>

        {/* Bank Account Number */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-black">Bank Account Number</label>
          <input
            type="number"
            name="employee_bank_account_number"
            value={employeeData.employee_bank_account_number}
            onChange={handleChange}
            className="w-full p-2 border border-gray-500 rounded-md bg-white text-black"
            required
          />
        </div>

        {/* Status */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-black">Status</label>
          <select
            name="employee_status"
            value={employeeData.employee_status}
            onChange={handleChange}
            className="w-full p-2 border border-gray-500 rounded-md bg-white text-black"
            required
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
        >
          Add Employee
        </button>
      </form>

      {/* <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap');
        .min-h-screen {
          font-family: 'Poppins', sans-serif;
        }
      `}</style> */}
    </div>
  );
}