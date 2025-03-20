"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function TodayAttendance() {
  const [attendance, setAttendance] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTodayAttendance = async () => {
      const today = new Date().toISOString().split("T")[0];
      try {
        const response = await axios.get(`http://localhost:5000/api/attendance/date/${today}`);
        setAttendance(response.data);
        setError("");
      } catch (err) {
        setAttendance(null);
        setError("No attendance records found for today");
      }
    };

    fetchTodayAttendance();
  }, []);

  return (
    <div className="min-h-screen bg-[#F6F8FF] p-5">
      <h1 className="text-2xl font-bold mb-4 text-black">Today's Attendance</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {attendance && attendance.length > 0 ? (
        <div className="bg-gray-300 p-4 rounded-lg border border-gray-500">
          <table className="w-full border-collapse border border-gray-500">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-500 p-2 text-black">Employee ID</th>
                <th className="border border-gray-500 p-2 text-black">Date</th>
                <th className="border border-gray-500 p-2 text-black">Attended</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((record) => (
                <tr key={record._id} className="border border-gray-500 bg-white">
                  <td className="border border-gray-500 p-2 text-black">{record.employee_id}</td>
                  <td className="border border-gray-500 p-2 text-black">{record.date}</td>
                  <td className="border border-gray-500 p-2 text-black">
                    {record.attended ? "Yes" : "No"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !error && <p className="text-black">Loading attendance data...</p>
      )}

      {/* <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap');
        .min-h-screen {
          font-family: 'Poppins', sans-serif;
        }
      `}</style> */}
    </div>
  );
}