"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function AddEmployee() {
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
  const [departments, setDepartments] = useState([]);
  const [jobRoles, setJobRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchDepartments();
    fetchJobRoles();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/department");
      setDepartments(response.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
      setError("Failed to load departments");
    }
  };

  const fetchJobRoles = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/jobrole");
      setJobRoles(response.data);
    } catch (error) {
      console.error("Error fetching job roles:", error);
      setError("Failed to load job roles");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("http://localhost:5000/api/employee", formData);
      console.log("Employee added:", response.data);
      alert("Employee added and linked successfully!");
      router.push("/HRemployees"); // Redirect to an employee list page
    } catch (error) {
      console.error("Error adding employee:", error);
      setError(error.response?.data?.error || "Failed to add employee");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h1 className="text-2xl font-semibold text-gray-800 mb-6">Add New Employee</h1>
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
                  onChange={handleChange}
                  required
                  className="input-field"
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
                  onChange={handleChange}
                  required
                  className="input-field"
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
                  onChange={handleChange}
                  required
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="employee_address_address_line_one">
                  Address Line 1
                </label>
                <input
                  type="text"
                  id="employee_address_address_line_one"
                  name="employee_address_address_line_one"
                  value={formData.employee_address_address_line_one}
                  onChange={handleChange}
                  required
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="employee_address_address_line_two">
                  Address Line 2
                </label>
                <input
                  type="text"
                  id="employee_address_address_line_two"
                  name="employee_address_address_line_two"
                  value={formData.employee_address_address_line_two}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="employee_address_address_city">
                  City
                </label>
                <input
                  type="text"
                  id="employee_address_address_city"
                  name="employee_address_address_city"
                  value={formData.employee_address_address_city}
                  onChange={handleChange}
                  required
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="employee_bank_account_number">
                  Bank Account Number
                </label>
                <input
                  type="number"
                  id="employee_bank_account_number"
                  name="employee_bank_account_number"
                  value={formData.employee_bank_account_number}
                  onChange={handleChange}
                  required
                  className="input-field"
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
                  onChange={handleChange}
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
                  onChange={handleChange}
                  required
                  className="input-field"
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
                  onChange={handleChange}
                  required
                  className="input-field"
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
            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                className={`btn-primary w-48 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={loading}
              >
                {loading ? "Adding..." : "Add Employee"}
              </button>
            </div>
          </form>
        </div>
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