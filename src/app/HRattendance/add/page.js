"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function AddAttendance() {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [date, setDate] = useState('');

  // Fetch employee data on component mount
  useEffect(() => {
    fetchEmployees();
    setDate(new Date().toISOString().split('T')[0]);  // Set the default date to today
  }, []);

  // Fetch employee data from API
  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/employee");
      setEmployees(response.data);
      // Fetch attendance for the selected date
      fetchAttendanceForDate();
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  // Fetch attendance data for the selected date
  const fetchAttendanceForDate = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/attendance?date=${date}`);
      const existingAttendance = response.data;

      // Map the existing attendance data to set checkboxes accordingly
      const attendanceData = {};
      existingAttendance.forEach((attendanceRecord) => {
        attendanceData[attendanceRecord.employee_id] = attendanceRecord.attended;
      });

      setAttendance(attendanceData);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    }
  };

  // Handle checkbox change for marking attendance
  const handleCheckboxChange = (employeeId, checked) => {
    setAttendance((prevAttendance) => ({
      ...prevAttendance,
      [employeeId]: checked, // Update the attendance for the specific employee
    }));
  };

  // Handle form submission to record attendance
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if there is any change in attendance state before submitting
    const attendanceData = Object.keys(attendance).map((employeeId) => ({
      employee_id: employeeId,
      date,
      attended: attendance[employeeId], // true if checked, false if unchecked
    }));

    // If no attendance is changed (empty attendance data), do not submit
    if (attendanceData.length === 0) {
      alert("No attendance selected!");
      return;
    }

    try {
      // Loop through attendance and submit data one by one
      for (const data of attendanceData) {
        const response = await axios.post('http://localhost:5000/api/attendance/add', data);
        console.log('Attendance added for employee:', data.employee_id, response.data);
      }

      // Clear the attendance state after successful submission
      setAttendance({});
      alert("Attendance marked successfully!");
    } catch (error) {
      console.error('Error adding attendance:', error);
      alert("There was an error marking attendance!");
    }
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">Add Attendance</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="date">Date</label>
          <input 
            type="date" 
            id="date" 
            value={date} 
            onChange={(e) => {
              setDate(e.target.value);
              fetchAttendanceForDate();  // Fetch attendance data when the date changes
            }} 
            required
            min={date}  // Restrict date picker to today
            className="mt-1 p-2 border border-gray-300 rounded"
          />
        </div>
        <table className="w-full border-collapse border border-gray-300 mb-4">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2 text-black">ID</th>
              <th className="border p-2 text-black">Name</th>
              <th className="border p-2 text-black">Select</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp._id} className="border">
                <td className="border p-2">{emp.employee_id}</td>
                <td className="border p-2">{emp.employee_name}</td>
                <td className="border p-2">
                  <input
                    type="checkbox"
                    checked={attendance[emp._id] || false}  // Pre-check the checkbox if the employee attended
                    onChange={(e) => handleCheckboxChange(emp._id, e.target.checked)}  // Pass checked value
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">Mark Attendance</button>
      </form>
    </div>
  );
}
