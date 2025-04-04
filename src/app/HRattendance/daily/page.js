"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function TodayAttendance() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTodayAttendance = async () => {
      const today = new Date().toISOString().split("T")[0];
      try {
        setLoading(true);
        setError("");
        const response = await axios.get(`http://localhost:5000/api/attendance/date/${today}`);
        setAttendance(response.data || []);
      } catch (err) {
        setAttendance([]);
        setError("No attendance records found for today.");
      } finally {
        setLoading(false);
      }
    };

    fetchTodayAttendance();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Today's Attendance</h1>
        <div className="bg-white p-6 rounded-xl shadow-md">
          {loading && <p className="text-gray-500">Loading attendance data...</p>}
          {!loading && error && <p className="text-red-500 mb-4">{error}</p>}
          {!loading && !error && attendance.length > 0 ? (
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