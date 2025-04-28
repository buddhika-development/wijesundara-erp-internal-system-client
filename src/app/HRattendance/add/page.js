"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function AddAttendance() {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setDate(today);
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/employee");
      setEmployees(response.data || []);
      fetchAttendanceForDate();
    } catch (error) {
      console.error("Error fetching employees:", error);
      setError("Failed to load employees.");
    }
  };

  const fetchAttendanceForDate = async () => {
    if (!date) return;
    try {
      const response = await axios.get(`http://localhost:5000/api/attendance/date/${date}`);
      const existingAttendance = response.data || [];

      const attendanceData = {};
      existingAttendance.forEach((attendanceRecord) => {
        attendanceData[attendanceRecord.employee_id] = attendanceRecord.attended;
      });

      setAttendance(attendanceData);
      setError("");
    } catch (error) {
      console.error("Error fetching attendance data:", error);
      if (error.response?.status !== 404) {
        setError("Failed to load attendance data.");
      } else {
        setAttendance({});
      }
    }
  };

  const handleCheckboxChange = (employeeId, checked) => {
    setAttendance((prevAttendance) => ({
      ...prevAttendance,
      [employeeId]: checked,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date) {
      setError("Please select a date.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Fetch existing attendance records for the selected date
      const existingResponse = await axios.get(`http://localhost:5000/api/attendance/date/${date}`);
      const existingRecords = existingResponse.data.reduce((acc, record) => {
        acc[record.employee_id] = record;
        return acc;
      }, {});

      // Create attendance data for ALL employees
      const attendanceData = employees.map((employee) => ({
        employee_id: employee._id,
        date,
        attended: attendance[employee._id] === true, // Default to false if not explicitly true
      }));

      if (attendanceData.length === 0) {
        setError("No employees to mark attendance for!");
        setLoading(false);
        return;
      }

      // Update or create attendance records for all employees
      const responses = await Promise.all(
        attendanceData.map(async (data) => {
          if (existingRecords[data.employee_id]) {
            // Update existing record
            return axios.put(
              `http://localhost:5000/api/attendance/update/${data.employee_id}/${date}`,
              { attended: data.attended }
            );
          } else {
            // Create new record
            return axios.post("http://localhost:5000/api/attendance/add", data);
          }
        })
      );

      console.log("Attendance updates:", responses.map((res) => res.data));
      alert("Attendance marked successfully!");
      await fetchAttendanceForDate();
    } catch (error) {
      console.error("Error processing attendance:", error.response?.data || error.message);
      setError("There was an error marking attendance: " + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceForDate();
  }, [date]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Add/Update Attendance</h1>
        <form onSubmit={handleSubmit}>
          <div className="bg-white p-6 rounded-xl shadow-md mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="date">
              Date
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="input-field w-full max-w-xs"
            />
          </div>
          {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
          {employees.length > 0 ? (
            <div className="bg-white p-6 rounded-xl shadow-md mb-8">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-700">
                      <th className="p-3 text-left font-medium">ID</th>
                      <th className="p-3 text-left font-medium">Name</th>
                      <th className="p-3 text-left font-medium">Present</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((emp) => (
                      <tr key={emp._id} className="border-t border-gray-100 hover:bg-gray-50">
                        <td className="p-3 text-gray-700">{emp.employee_id || "N/A"}</td>
                        <td className="p-3 text-gray-700">{emp.employee_name || "N/A"}</td>
                        <td className="p-3">
                          <input
                            type="checkbox"
                            checked={attendance[emp._id] === true}
                            onChange={(e) => handleCheckboxChange(emp._id, e.target.checked)}
                            disabled={loading}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            !error && <p className="text-gray-500">Loading employees...</p>
          )}
          <button
            type="submit"
            className={`btn-primary w-48 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={loading}
          >
            {loading ? "Updating..." : "Mark Attendance"}
          </button>
        </form>
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