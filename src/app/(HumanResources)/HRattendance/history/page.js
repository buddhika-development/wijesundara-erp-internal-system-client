"use client";
import { useState } from "react";
import axios from "axios";

export default function AttendanceSearch() {
  const [date, setDate] = useState("");
  const [attendance, setAttendance] = useState([]);
  const [employees, setEmployees] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sortOption, setSortOption] = useState("name-asc");

  const handleSearch = async () => {
    if (!date) {
      setError("Please select a date to search.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setAttendance([]);

      // Fetch attendance records for the selected date
      const response = await axios.get(`http://localhost:5000/api/attendance/date/${date}`);
      setAttendance(response.data || []);

      // Fetch all employees to map employee_id to employee_name
      const employeeResponse = await axios.get(`http://localhost:5000/api/employee`);
      const employeeMap = employeeResponse.data.reduce((map, employee) => {
        map[employee._id] = employee.employee_name;
        return map;
      }, {});
      setEmployees(employeeMap);
    } catch (err) {
      setAttendance([]);
      setEmployees({});
      setError("No attendance records found for this date.");
    } finally {
      setLoading(false);
    }
  };

  // Handle sorting
  const handleSort = (option) => {
    setSortOption(option);
    const sortedAttendance = [...attendance].sort((a, b) => {
      const nameA = employees[a.employee_id] || "Unknown Employee";
      const nameB = employees[b.employee_id] || "Unknown Employee";

      switch (option) {
        case "name-asc":
          return nameA.localeCompare(nameB);
        case "name-desc":
          return nameB.localeCompare(nameA);
        case "attended-first":
          return b.attended - a.attended;
        case "absent-first":
          return a.attended - b.attended;
        default:
          return 0;
      }
    });
    setAttendance(sortedAttendance);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Search Attendance by Date</h1>
        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
          <div className="flex gap-4">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="input-field flex-1"
              placeholder="Select a date"
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className={`btn-primary w-32 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </div>

        {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
        {!loading && attendance.length > 0 ? (
          <div className="bg-white p-6 rounded-xl shadow-md">
            {/* Sort Dropdown */}
            <div className="mb-4">
              <label htmlFor="sort" className="mr-2 text-gray-700 font-medium">
                Sort by:
              </label>
              <select
                id="sort"
                value={sortOption}
                onChange={(e) => handleSort(e.target.value)}
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="attended-first">Attended First</option>
                <option value="absent-first">Absent First</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-700">
                    <th className="p-3 text-left font-medium">Employee Name</th>
                    <th className="p-3 text-left font-medium">Attended</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.map((record) => (
                    <tr key={record._id} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="p-3 text-gray-700">
                        {employees[record.employee_id] || "Unknown Employee"}
                      </td>
                      <td className="p-3 text-gray-700">
                        {record.attended !== undefined ? (record.attended ? "Yes" : "No") : "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          !loading && !error && date && (
            <p className="text-gray-500">No attendance records found for this date.</p>
          )
        )}
        {loading && <p className="text-gray-500">Loading attendance data...</p>}
        {!loading && !error && !date && (
          <p className="text-gray-500">Please select a date to search.</p>
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
        .shadow-md {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }
      `}</style>
    </div>
  );
}