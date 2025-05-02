"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function TodayAttendance() {
  const [attendance, setAttendance] = useState([]);
  const [employees, setEmployees] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortOption, setSortOption] = useState("name-asc");

  useEffect(() => {
    const fetchData = async () => {
      const today = new Date().toISOString().split("T")[0];
      try {
        setLoading(true);
        setError("");

        // Fetch attendance records for today
        const attendanceResponse = await axios.get(`http://localhost:5000/api/attendance/date/${today}`);
        setAttendance(attendanceResponse.data || []);

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
        setError("No attendance records found for today.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Today's Attendance</h1>
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

          {loading && <p className="text-gray-500">Loading attendance data...</p>}
          {!loading && error && <p className="text-red-500 mb-4">{error}</p>}
          {!loading && !error && attendance.length > 0 ? (
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
          ) : (
            !loading && !error && <p className="text-gray-500">No attendance records found for today.</p>
          )}
        </div>
      </div>

      {/* Styling */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap');
        .min-h-screen {
          font-family: 'Poppins', sans-serif;
        }
        .shadow-md {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }
      `}</style>
    </div>
  );
}