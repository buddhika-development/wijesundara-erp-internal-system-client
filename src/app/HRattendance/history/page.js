"use client";
import { useState } from "react";
import axios from "axios";

export default function AttendanceSearch() {
  const [date, setDate] = useState("");
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!date) {
      setError("Please select a date to search.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setAttendance([]);
      const response = await axios.get(`http://localhost:5000/api/attendance/date/${date}`);
      setAttendance(response.data || []);
    } catch (err) {
      setAttendance([]);
      setError("No attendance records found for this date.");
    } finally {
      setLoading(false);
    }
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
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-700">
                    <th className="p-3 text-left font-medium">Employee ID</th>
                    <th className="p-3 text-left font-medium">Date</th>
                    <th className="p-3 text-left font-medium">Attended</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.map((record) => (
                    <tr key={record._id} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="p-3 text-gray-700">{record.employee_id || "N/A"}</td>
                      <td className="p-3 text-gray-700">
                        {record.date
                          ? new Date(record.date).toLocaleDateString()
                          : "N/A"}
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