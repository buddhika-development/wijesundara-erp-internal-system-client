"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function EmployeeManagement() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [jobRoles, setJobRoles] = useState([]);
  const [editEmployee, setEditEmployee] = useState(null);
  const [formData, setFormData] = useState({
    employee_id: "",
    employee_name: "",
    employee_dob: "",
    employee_address_address_line_one: "",
    employee_address_address_line_two: "",
    employee_address_address_city: "",
    employee_bank_account_number: "",
    employee_status: "active",
    department_id: "",
    jobrole_id: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
    fetchJobRoles();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/employee");
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
      setError("Failed to load employees.");
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/department");
      setDepartments(response.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
      setError("Failed to load departments.");
    }
  };

  const fetchJobRoles = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/jobrole");
      setJobRoles(response.data);
    } catch (error) {
      console.error("Error fetching job roles:", error);
      setError("Failed to load job roles.");
    }
  };

  const handleEditClick = async (employee) => {
    try {
      const relationResponse = await axios.get("http://localhost:5000/api/relation");
      const relation = relationResponse.data.find(rel => rel.employee_id._id === employee._id);

      setEditEmployee(employee);
      setFormData({
        employee_id: employee.employee_id || "",
        employee_name: employee.employee_name || "",
        employee_dob: employee.employee_dob ? new Date(employee.employee_dob).toISOString().split('T')[0] : "",
        employee_address_address_line_one: employee.employee_address_address_line_one || "",
        employee_address_address_line_two: employee.employee_address_address_line_two || "",
        employee_address_address_city: employee.employee_address_address_city || "",
        employee_bank_account_number: employee.employee_bank_account_number || "",
        employee_status: employee.employee_status || "active",
        department_id: relation?.department_id?._id || "",
        jobrole_id: relation?.jobrole_id?._id || "",
      });
      setError(null);
    } catch (error) {
      console.error("Error fetching relation data:", error);
      setError("Failed to load employee relation data.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name.includes("number") || name === "employee_id" ? (value === "" ? "" : Number(value)) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editEmployee) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.put(
        `http://localhost:5000/api/employee/${editEmployee._id}`,
        formData
      );
      console.log("Updated employee:", response.data);

      setEmployees((prev) =>
        prev.map((emp) => (emp._id === editEmployee._id ? response.data.employee : emp))
      );
      setEditEmployee(null);
      setFormData({
        employee_id: "",
        employee_name: "",
        employee_dob: "",
        employee_address_address_line_one: "",
        employee_address_address_line_two: "",
        employee_address_address_city: "",
        employee_bank_account_number: "",
        employee_status: "active",
        department_id: "",
        jobrole_id: "",
      });
    } catch (error) {
      console.error("Error updating employee:", error);
      setError(error.response?.data?.error || "Failed to update employee.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F8FF] p-5">
      <h1 className="text-2xl font-bold mb-4 text-black">Employee Management</h1>

      {/* Employees Table */}
      <div className="bg-gray-300 p-4 rounded-lg mb-6">
        <table className="w-full border-collapse border border-gray-500">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-500 p-2 text-black">ID</th>
              <th className="border border-gray-500 p-2 text-black">Name</th>
              <th className="border border-gray-500 p-2 text-black">DOB</th>
              <th className="border border-gray-500 p-2 text-black">City</th>
              <th className="border border-gray-500 p-2 text-black">Status</th>
              <th className="border border-gray-500 p-2 text-black">Action</th>
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
                <td className="border border-gray-500 p-2 text-black">{emp.employee_address_address_city}</td>
                <td className="border border-gray-500 p-2 text-black">{emp.employee_status}</td>
                <td className="border border-gray-500 p-2">
                  <button
                    onClick={() => handleEditClick(emp)}
                    className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {employees.length === 0 && !loading && !error && (
          <p className="mt-2 text-black">No employees found.</p>
        )}
      </div>

      {/* Edit Form */}
      {editEmployee && (
        <div className="border border-gray-500 p-4 rounded-lg bg-gray-300 mb-4">
          <h2 className="text-xl font-semibold mb-2 text-black">
            Edit Employee: {editEmployee.employee_name}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-black" htmlFor="employee_id">
                  Employee ID
                </label>
                <input
                  type="number"
                  id="employee_id"
                  name="employee_id"
                  value={formData.employee_id}
                  onChange={handleInputChange}
                  className="mt-1 p-2 border border-gray-500 rounded w-full bg-white text-black"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black" htmlFor="employee_name">
                  Name
                </label>
                <input
                  type="text"
                  id="employee_name"
                  name="employee_name"
                  value={formData.employee_name}
                  onChange={handleInputChange}
                  className="mt-1 p-2 border border-gray-500 rounded w-full bg-white text-black"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black" htmlFor="employee_dob">
                  Date of Birth
                </label>
                <input
                  type="date"
                  id="employee_dob"
                  name="employee_dob"
                  value={formData.employee_dob}
                  onChange={handleInputChange}
                  className="mt-1 p-2 border border-gray-500 rounded w-full bg-white text-black"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black" htmlFor="employee_address_address_line_one">
                  Address Line 1
                </label>
                <input
                  type="text"
                  id="employee_address_address_line_one"
                  name="employee_address_address_line_one"
                  value={formData.employee_address_address_line_one}
                  onChange={handleInputChange}
                  className="mt-1 p-2 border border-gray-500 rounded w-full bg-white text-black"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black" htmlFor="employee_address_address_line_two">
                  Address Line 2
                </label>
                <input
                  type="text"
                  id="employee_address_address_line_two"
                  name="employee_address_address_line_two"
                  value={formData.employee_address_address_line_two}
                  onChange={handleInputChange}
                  className="mt-1 p-2 border border-gray-500 rounded w-full bg-white text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black" htmlFor="employee_address_address_city">
                  City
                </label>
                <input
                  type="text"
                  id="employee_address_address_city"
                  name="employee_address_address_city"
                  value={formData.employee_address_address_city}
                  onChange={handleInputChange}
                  className="mt-1 p-2 border border-gray-500 rounded w-full bg-white text-black"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black" htmlFor="employee_bank_account_number">
                  Bank Account Number
                </label>
                <input
                  type="number"
                  id="employee_bank_account_number"
                  name="employee_bank_account_number"
                  value={formData.employee_bank_account_number}
                  onChange={handleInputChange}
                  className="mt-1 p-2 border border-gray-500 rounded w-full bg-white text-black"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black" htmlFor="employee_status">
                  Status
                </label>
                <select
                  id="employee_status"
                  name="employee_status"
                  value={formData.employee_status}
                  onChange={handleInputChange}
                  className="mt-1 p-2 border border-gray-500 rounded w-full bg-white text-black"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-black" htmlFor="department_id">
                  Department
                </label>
                <select
                  id="department_id"
                  name="department_id"
                  value={formData.department_id}
                  onChange={handleInputChange}
                  className="mt-1 p-2 border border-gray-500 rounded w-full bg-white text-black"
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept._id} value={dept._id}>
                      {dept.department_name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-black" htmlFor="jobrole_id">
                  Job Role
                </label>
                <select
                  id="jobrole_id"
                  name="jobrole_id"
                  value={formData.jobrole_id}
                  onChange={handleInputChange}
                  className="mt-1 p-2 border border-gray-500 rounded w-full bg-white text-black"
                  required
                >
                  <option value="">Select Job Role</option>
                  {jobRoles.map((role) => (
                    <option key={role._id} value={role._id}>
                      {role.job_role_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>}
            <div className="flex gap-2 mt-4">
              <button
                type="submit"
                disabled={loading}
                className={`bg-blue-500 text-white py-2 px-4 rounded ${
                  loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
                }`}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={() => setEditEmployee(null)}
                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap');
        .min-h-screen {
          font-family: 'Poppins', sans-serif;
        }
      `}</style>
    </div>
  );
}