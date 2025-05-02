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
      setEmployees(response.data || []); // Ensure fallback to empty array
    } catch (error) {
      console.error("Error fetching employees:", error);
      setError("Failed to load employees.");
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/department");
      setDepartments(response.data || []); // Ensure fallback to empty array
    } catch (error) {
      console.error("Error fetching departments:", error);
      setError("Failed to load departments.");
    }
  };

  const fetchJobRoles = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/jobrole");
      setJobRoles(response.data || []); // Ensure fallback to empty array
    } catch (error) {
      console.error("Error fetching job roles:", error);
      setError("Failed to load job roles.");
    }
  };

  const handleEditClick = async (employee) => {
    try {
      const relationResponse = await axios.get("http://localhost:5000/api/relation");
      const relation = relationResponse.data.find((rel) => rel.employee_id?._id === employee._id);

      setEditEmployee(employee);
      setFormData({
        employee_id: employee.employee_id || "",
        employee_name: employee.employee_name || "",
        employee_dob: employee.employee_dob
          ? new Date(employee.employee_dob).toISOString().split("T")[0]
          : "",
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
      const response = await axios.put(`http://localhost:5000/api/employee/${editEmployee._id}`, formData);
      const updatedEmployee = response.data.employee || response.data; // Handle varying response structures

      setEmployees((prev) =>
        prev.map((emp) => (emp._id === editEmployee._id ? { ...emp, ...updatedEmployee } : emp))
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Employee Management</h1>

        {/* Employees Table */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Employee List</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-700">
                  <th className="p-3 text-left font-medium">ID</th>
                  <th className="p-3 text-left font-medium">Name</th>
                  <th className="p-3 text-left font-medium">DOB</th>
                  <th className="p-3 text-left font-medium">City</th>
                  <th className="p-3 text-left font-medium">Status</th>
                  <th className="p-3 text-left font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp._id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="p-3 text-gray-700">{emp.employee_id}</td>
                    <td className="p-3 text-gray-700">{emp.employee_name}</td>
                    <td className="p-3 text-gray-700">
                      {emp.employee_dob
                        ? new Date(emp.employee_dob).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="p-3 text-gray-700">{emp.employee_address_address_city || "N/A"}</td>
                    <td className="p-3 text-gray-700">{emp.employee_status}</td>
                    <td className="p-3">
                      <button
                        onClick={() => handleEditClick(emp)}
                        className="btn-primary px-4 py-2 text-sm"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {employees.length === 0 && !loading && !error && (
            <p className="mt-4 text-gray-500">No employees found.</p>
          )}
          {loading && <p className="mt-4 text-gray-500">Loading...</p>}
          {error && !loading && <p className="mt-4 text-red-500">{error}</p>}
        </div>

        {/* Edit Form */}
        {editEmployee && (
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-5">
              Edit Employee: {editEmployee.employee_name}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="employee_id">
                    Employee ID
                  </label>
                  <input
                    type="number"
                    id="employee_id"
                    name="employee_id"
                    value={formData.employee_id}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="employee_name">
                    Name
                  </label>
                  <input
                    type="text"
                    id="employee_name"
                    name="employee_name"
                    value={formData.employee_name}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="employee_dob">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    id="employee_dob"
                    name="employee_dob"
                    value={formData.employee_dob}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-2"
                    htmlFor="employee_address_address_line_one"
                  >
                    Address Line 1
                  </label>
                  <input
                    type="text"
                    id="employee_address_address_line_one"
                    name="employee_address_address_line_one"
                    value={formData.employee_address_address_line_one}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-2"
                    htmlFor="employee_address_address_line_two"
                  >
                    Address Line 2
                  </label>
                  <input
                    type="text"
                    id="employee_address_address_line_two"
                    name="employee_address_address_line_two"
                    value={formData.employee_address_address_line_two}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-2"
                    htmlFor="employee_address_address_city"
                  >
                    City
                  </label>
                  <input
                    type="text"
                    id="employee_address_address_city"
                    name="employee_address_address_city"
                    value={formData.employee_address_address_city}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-2"
                    htmlFor="employee_bank_account_number"
                  >
                    Bank Account Number
                  </label>
                  <input
                    type="number"
                    id="employee_bank_account_number"
                    name="employee_bank_account_number"
                    value={formData.employee_bank_account_number}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="employee_status">
                    Status
                  </label>
                  <select
                    id="employee_status"
                    name="employee_status"
                    value={formData.employee_status}
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="department_id">
                    Department
                  </label>
                  <select
                    id="department_id"
                    name="department_id"
                    value={formData.department_id}
                    onChange={handleInputChange}
                    className="input-field"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="jobrole_id">
                    Job Role
                  </label>
                  <select
                    id="jobrole_id"
                    name="jobrole_id"
                    value={formData.jobrole_id}
                    onChange={handleInputChange}
                    className="input-field"
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
              {error && <p className="text-red-500 mt-6 text-sm">{error}</p>}
              <div className="mt-8 flex justify-end gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={`btn-primary w-48 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={() => setEditEmployee(null)}
                  className="btn-accent w-48"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

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
          .btn-accent {
            display: inline-block;
            background-color: #64748b; /* Slate */
            color: white;
            padding: 11px 20px;
            border-radius: 8px;
            text-align: center;
            cursor: pointer;
            transition: background-color 0.2s ease, box-shadow 0.2s ease;
          }
          .btn-accent:hover {
            background-color: #475569;
            box-shadow: 0 2px 8px rgba(100, 116, 139, 0.3);
          }
          .shadow-md {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          }
        `}</style>
      </div>
    </div>
  );
}