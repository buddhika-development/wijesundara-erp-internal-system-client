"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import axios from "axios";
import "react-calendar/dist/Calendar.css";

const Calendar = dynamic(() => import("react-calendar"), { ssr: false });

export default function Home() {
  const router = useRouter();
  const [date, setDate] = useState(null);
  const [reminders, setReminders] = useState({});
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setDate(new Date());
    fetchApprovedRequests();
  }, []);

  const fetchApprovedRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://localhost:5000/api/salary/approvedRequests");
      setApprovedRequests(response.data || []);
    } catch (err) {
      console.error("Error fetching approved requests:", err.message);
      setError("Failed to load approved payment requests.");
    } finally {
      setLoading(false);
    }
  };

  const handleDateClick = (selectedDate) => {
    const reminder = prompt("Enter a reminder:");
    if (reminder) {
      setReminders((prev) => ({
        ...prev,
        [selectedDate.toDateString()]: reminder,
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* First Row - Sections */}
        <div className="grid grid-cols-12 gap-6 mb-8">
          {/* Employee Section */}
          <div className="col-span-3 bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-5">Employee</h2>
            <button className="btn-primary" onClick={() => router.push("/HRemployee/add")}>
              Add
            </button>
            <button className="btn-primary" onClick={() => router.push("/HRemployee/edit")}>
              Edit
            </button>
            <button className="btn-primary" onClick={() => router.push("/HRemployee/list")}>
              Current List
            </button>
            <button className="btn-primary" onClick={() => router.push("/HRemployee/terminate")}>
              Terminate
            </button>
          </div>

          {/* Attendance Section */}
          <div className="col-span-3 bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-5">Attendance</h2>
            <button className="btn-primary" onClick={() => router.push("/HRattendance/daily")}>
              Daily Attendance
            </button>
            <button className="btn-primary" onClick={() => router.push("/HRattendance/history")}>
              History
            </button>
            <button className="btn-primary" onClick={() => router.push("/HRattendance/add")}>
              Add Manually
            </button>
          </div>

          {/* Salary Management Section */}
          <div className="col-span-3 bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-5">Salary Management</h2>
            <button className="btn-primary" onClick={() => router.push("/HRsalaries/calculate")}>
              Calculate Salary
            </button>
            <button className="btn-primary" onClick={() => router.push("/HRsalaries/approval")}>
              Get Approval
            </button>
            <button className="btn-primary" onClick={() => router.push("/HRsalaries/customize")}>
              Customize Formula
            </button>
            <button className="btn-primary" onClick={() => router.push("/HRsalaries/payslip")}>
              Download Payslip
            </button>
          </div>

          {/* Analytics Section */}
          <div className="col-span-3 bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 flex items-center justify-center">
            <button className="btn-accent w-full" onClick={() => router.push("/HRanalytics")}>
              Analytics
            </button>
          </div>
        </div>

        {/* Second Row - Notifications and Calendar */}
        <div className="grid grid-cols-12 gap-6">
          {/* Notifications */}
          <div className="col-span-6 bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-5">Notifications</h2>
            <div className="h-64 bg-gray-50 rounded-lg overflow-y-auto p-4">
              {loading ? (
                <p className="text-gray-500">Loading approved payments...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : approvedRequests.length === 0 ? (
                <p className="text-gray-500">No approved payment requests found.</p>
              ) : (
                <ul className="space-y-3">
                  {approvedRequests.map((request, index) => (
                    <li
                      key={index}
                      className="p-3 bg-white rounded-lg shadow-sm border border-gray-100 flex justify-between items-center"
                    >
                      <div>
                        <p className="text-gray-800 font-medium">{request.description}</p>
                        <p className="text-gray-600 text-sm">
                          Amount: {request.amount.toLocaleString()} | Bank Account: {request.bankAccount || "N/A"}
                        </p>
                        <p className="text-green-600 text-sm font-medium">Status: Approved</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Calendar and Reminders */}
          <div className="col-span-6 bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-5">Reminder / Calendar</h2>
            <div className="flex gap-6">
              {/* Calendar */}
              {date && (
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <Calendar
                    onChange={setDate}
                    value={date}
                    onClickDay={handleDateClick}
                    className="rounded-lg border-none text-gray-900"
                    locale="en-GB"
                  />
                </div>
              )}

              {/* Reminders */}
              <div className="flex-1 bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Reminders</h3>
                {date && reminders[date.toDateString()] ? (
                  <p className="text-gray-700">{reminders[date.toDateString()]}</p>
                ) : (
                  <p className="text-gray-500 italic">No reminders for this date</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Styling */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap');
        .min-h-screen {
          font-family: 'Poppins', sans-serif;
        }
        .btn-primary {
          display: block;
          width: 100%;
          background-color: #3b82f6; /* Blue */
          color: white;
          padding: 11px;
          margin: 8px 0;
          border-radius: 8px;
          text-align: center;
          cursor: pointer;
          transition: background-color 0.2s ease, box-shadow 0.2s ease;
        }
        .btn-primary:hover {
          background-color: #2563eb;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
        }
        .btn-accent {
          display: block;
          width: 100%;
          background-color: #64748b; /* Slate */
          color: white;
          padding: 12px;
          margin: 8px 0;
          border-radius: 8px;
          text-align: center;
          cursor: pointer;
          transition: background-color 0.2s ease, box-shadow 0.2s ease;
        }
        .btn-accent:hover {
          background-color: #475569;
          box-shadow: 0 2px 8px rgba(100, 116, 139, 0.3);
        }
        .shadow-md {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }
        .shadow-sm {
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
        }
        .shadow-lg {
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.12);
        }
        .hover\:shadow-lg:hover {
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.12);
        }
        .border-gray-100 {
          border-color: #f3f4f6;
        }
        .overflow-y-auto {
          overflow-y: auto;
        }
        .space-y-3 > * + * {
          margin-top: 0.75rem;
        }
      `}</style>
    </div>
  );
}