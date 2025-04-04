"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function TodayAttendance() {
  const [attendance, setAttendance] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTodayAttendance = async () => {
      const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
      try {
        const response = await axios.get(`http://localhost:5000/api/attendance/date/${today}`);
        setAttendance(response.data);
        setError(""); // Reset error if successful
      } catch (err) {
        setAttendance(null);
        setError("No attendance records found for today");
      }
    };

    fetchTodayAttendance();
  }, []); // Runs only on component mount

  return (
    <div>
      <h1>Today's Attendance</h1>
      {error && <p>{error}</p>}
      {attendance && (
        <pre>{JSON.stringify(attendance, null, 2)}</pre> // Display JSON in a readable format
      )}
    </div>
  );
}
