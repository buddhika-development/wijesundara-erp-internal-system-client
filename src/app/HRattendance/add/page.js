"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function AddAttendance() {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);

  
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setDate(today);
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/employee");
      setEmployees(response.data);
      fetchAttendanceForDate(); // Fetch attendance after employees are loaded
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const fetchAttendanceForDate = async () => {
    if (!date) return;
    try {
      const response = await axios.get(`http://localhost:5000/api/attendance/date/${date}`);
      const existingAttendance = response.data;

      const attendanceData = {};
      existingAttendance.forEach((attendanceRecord) => {
        attendanceData[attendanceRecord.employee_id] = attendanceRecord.attended;
      });

      setAttendance(attendanceData);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
      // Only reset if it's not a 404 (no records found)
      if (error.response?.status !== 404) {
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
    setLoading(true);

    const attendanceData = Object.keys(attendance).map((employeeId) => ({
      employee_id: employeeId,
      date,
      attended: attendance[employeeId],
    }));

    if (attendanceData.length === 0) {
      alert("No attendance selected!");
      setLoading(false);
      return;
    }

    try {
      const existingResponse = await axios.get(`http://localhost:5000/api/attendance/date/${date}`);
      const existingRecords = existingResponse.data.reduce((acc, record) => {
        acc[record.employee_id] = record;
        return acc;
      }, {});

      const responses = await Promise.all(
        attendanceData.map(async (data) => {
          if (existingRecords[data.employee_id]) {
            return axios.put(
              `http://localhost:5000/api/attendance/update/${data.employee_id}/${date}`,
              { attended: data.attended }
            );
          } else {
            return axios.post('http://localhost:5000/api/attendance/add', data);
          }
        })
      );

      console.log('Attendance updates:', responses.map(res => res.data));
      alert("Attendance marked successfully!");
      await fetchAttendanceForDate();
    } catch (error) {
      console.error('Error processing attendance:', error.response?.data || error.message);
      alert("There was an error marking attendance: " + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  // Fetch attendance when date changes
  useEffect(() => {
    fetchAttendanceForDate();
  }, [date]);

  return (
    <div className="min-h-screen bg-[#F6F8FF] p-5">
      <h1 className="text-2xl font-bold mb-4 text-black">Add/Update Attendance</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4 bg-gray-300 p-4 rounded-lg">
          <label className="block text-sm font-medium text-black" htmlFor="date">Date</label>
          <input 
            type="date" 
            id="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)}
            required
            className="mt-1 p-2 border border-gray-500 rounded bg-white text-black"
          />
        </div>
        <div className="bg-gray-300 p-4 rounded-lg mb-6">
          <table className="w-full border-collapse border border-gray-500">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-500 p-2 text-black">ID</th>
                <th className="border border-gray-500 p-2 text-black">Name</th>
                <th className="border border-gray-500 p-2 text-black">Present</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp._id} className="border border-gray-500 bg-white">
                  <td className="border border-gray-500 p-2 text-black">{emp.employee_id}</td>
                  <td className="border border-gray-500 p-2 text-black">{emp.employee_name}</td>
                  <td className="border border-gray-500 p-2">
                    <input
                      type="checkbox"
                      checked={attendance[emp._id] === true} // Explicitly check for true
                      onChange={(e) => handleCheckboxChange(emp._id, e.target.checked)}
                      disabled={loading}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button 
          type="submit" 
          className={`bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Updating..." : "Mark Attendance"}
        </button>
      </form>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap');
        .min-h-screen {
          font-family: 'Poppins', sans-serif;
        }
      `}</style>
    </div>
  );
}