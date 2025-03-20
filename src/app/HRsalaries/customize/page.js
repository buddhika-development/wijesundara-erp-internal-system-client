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
      const response = await axios.get("http://localhost:5000/api/jobrole");
      setJobRoles(response.data);
    } catch (error) {
      console.error("Error fetching job roles:", error);
      setError("Failed to load job roles.");
    }
  };

  //edit button
  const handleEditClick = (jobRole) => {
    setEditJobRole(jobRole);
    setFormData({
      job_role_salary: jobRole.job_role_salary || "",
      monthly_bonus: jobRole.monthly_bonus || "",
      attendance_bonus_per_extra_day: jobRole.attendance_bonus_per_extra_day || "",
    });
    setError(null);
  };

  //input changes hadle
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
        //close form
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
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">Customize Salary Formula</h1>

      {/* Job Roles Table */}
      <table className="w-full border-collapse border border-gray-300 mb-4">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2 text-black">ID</th>
            <th className="border p-2 text-black">Job Role</th>
            <th className="border p-2 text-black">Base Salary</th>
            <th className="border p-2 text-black">Monthly Bonus</th>
            <th className="border p-2 text-black">Attendance Bonus/Day</th>
            <th className="border p-2 text-black">Action</th>
          </tr>
        </thead>
        <tbody>
          {jobRoles.map((jr) => (
            <tr key={jr._id} className="border">
              <td className="border p-2">{jr.job_role_id}</td>
              <td className="border p-2">{jr.job_role_name}</td>
              <td className="border p-2">{jr.job_role_salary.toLocaleString()}</td>
              <td className="border p-2">{jr.monthly_bonus.toLocaleString()}</td>
              <td className="border p-2">{jr.attendance_bonus_per_extra_day.toLocaleString()}</td>
              <td className="border p-2">
                <button
                  onClick={() => handleEditClick(jr)}
                  className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Form */}
      {editJobRole && (
        <div className="border p-4 rounded text-black bg-gray-50 mb-4">
          <h2 className="text-xl font-semibold mb-2 text-black">
            Edit Salary Formula for {editJobRole.job_role_name}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700" htmlFor="job_role_salary">
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
                className="mt-1 p-2 border border-gray-300 rounded w-full"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700" htmlFor="monthly_bonus">
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
                className="mt-1 p-2 border text-black border-gray-300 rounded w-full"
                required
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-sm font-medium text-gray-700"
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
                className="mt-1 p-2 border text-black border-gray-300 rounded w-full"
                required
              />
            </div>
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <div className="flex gap-2">
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
                onClick={() => setEditJobRole(null)}
                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}