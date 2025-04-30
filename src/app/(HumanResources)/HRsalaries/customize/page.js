"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function CustomizeSalaryFormula() {
  const [jobRoles, setJobRoles] = useState([]);
  const [editJobRole, setEditJobRole] = useState(null);
  const [formData, setFormData] = useState({
    job_role_salary: "",
    monthly_bonus: "",
    attendance_bonus_per_extra_day: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchJobRoles();
  }, []);

  const fetchJobRoles = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/jobrole");
      setJobRoles(response.data || []);
      setError(null);
    } catch (error) {
      console.error("Error fetching job roles:", error);
      setError("Failed to load job roles.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (jobRole) => {
    setEditJobRole(jobRole);
    setFormData({
      job_role_salary: jobRole.job_role_salary || "",
      monthly_bonus: jobRole.monthly_bonus || "",
      attendance_bonus_per_extra_day: jobRole.attendance_bonus_per_extra_day || "",
    });
    setError(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === "" ? "" : Number(value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editJobRole) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.put(
        `http://localhost:5000/api/jobrole/${editJobRole._id}`,
        formData
      );
      console.log("Updated job role:", response.data);

      setJobRoles((prev) =>
        prev.map((jr) => (jr._id === editJobRole._id ? response.data : jr))
      );
      setEditJobRole(null);
      setFormData({
        job_role_salary: "",
        monthly_bonus: "",
        attendance_bonus_per_extra_day: "",
      });
    } catch (error) {
      console.error("Error updating job role:", error);
      setError(error.response?.data?.error || "Failed to update salary formula.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Customize Salary Formula</h1>

        {/* Job Roles Table */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Job Roles</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-700">
                  <th className="p-3 text-left font-medium">ID</th>
                  <th className="p-3 text-left font-medium">Job Role</th>
                  <th className="p-3 text-left font-medium">Base Salary</th>
                  <th className="p-3 text-left font-medium">Monthly Bonus</th>
                  <th className="p-3 text-left font-medium">Attendance Bonus/Day</th>
                  <th className="p-3 text-left font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {jobRoles.map((jr) => (
                  <tr key={jr._id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="p-3 text-gray-700">{jr.job_role_id || "N/A"}</td>
                    <td className="p-3 text-gray-700">{jr.job_role_name || "N/A"}</td>
                    <td className="p-3 text-gray-700">
                      {(jr.job_role_salary || 0).toLocaleString()}
                    </td>
                    <td className="p-3 text-gray-700">
                      {(jr.monthly_bonus || 0).toLocaleString()}
                    </td>
                    <td className="p-3 text-gray-700">
                      {(jr.attendance_bonus_per_extra_day || 0).toLocaleString()}
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => handleEditClick(jr)}
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
          {loading && <p className="mt-4 text-gray-500">Loading job roles...</p>}
          {!loading && jobRoles.length === 0 && !error && (
            <p className="mt-4 text-gray-500">No job roles found.</p>
          )}
          {!loading && error && <p className="mt-4 text-red-500 text-sm">{error}</p>}
        </div>

        {/* Edit Form */}
        {editJobRole && (
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Edit Salary Formula for {editJobRole.job_role_name || "Unknown"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-2"
                    htmlFor="job_role_salary"
                  >
                    Base Salary
                  </label>
                  <input
                    type="number"
                    id="job_role_salary"
                    name="job_role_salary"
                    value={formData.job_role_salary}
                    onChange={handleInputChange}
                    min="0"
                    step="1"
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-2"
                    htmlFor="monthly_bonus"
                  >
                    Monthly Bonus
                  </label>
                  <input
                    type="number"
                    id="monthly_bonus"
                    name="monthly_bonus"
                    value={formData.monthly_bonus}
                    onChange={handleInputChange}
                    min="0"
                    step="1"
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-2"
                    htmlFor="attendance_bonus_per_extra_day"
                  >
                    Attendance Bonus Per Extra Day
                  </label>
                  <input
                    type="number"
                    id="attendance_bonus_per_extra_day"
                    name="attendance_bonus_per_extra_day"
                    value={formData.attendance_bonus_per_extra_day}
                    onChange={handleInputChange}
                    min="0"
                    step="1"
                    className="input-field"
                    required
                  />
                </div>
              </div>
              {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}
              <div className="mt-6 flex justify-end gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={`btn-primary w-48 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={() => setEditJobRole(null)}
                  className="btn-accent w-48"
                >
                  Cancel
                </button>
              </div>
            </form>
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
  );
}