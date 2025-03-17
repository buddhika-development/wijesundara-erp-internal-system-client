"use client";
import { useState } from "react";
import axios from "axios";

export default function AttendanceSearch() {
  const [date, setDate] = useState("");
  const [attendance, setAttendance] = useState(null);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/attendance/date/${date}`);
      setAttendance(response.data);
      setError(""); // Reset error if search is successful
    } catch (err) {
      setAttendance(null);
      setError("No attendance records found for this date");
    }
  };

  return (
    <div>
      <h1>Search Attendance by Date</h1>
      <input
        type="text"
        placeholder="Enter date (YYYY-MM-DD)"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      {error && <p>{error}</p>}
      {attendance && (
        <pre>{JSON.stringify(attendance, null, 2)}</pre> // Display JSON in a readable format
      )}
    </div>
  );
}
