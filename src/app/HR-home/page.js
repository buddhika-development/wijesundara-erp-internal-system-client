"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from 'next/dynamic';
import "react-calendar/dist/Calendar.css";

const Calendar = dynamic(() => import('react-calendar'), { ssr: false });

export default function Home() {
  const router = useRouter();

  const [date, setDate] = useState(null);
  
    const [reminders, setReminders] = useState({});
  
    useEffect(() => {
      setDate(new Date());
    }, []);
  
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
    <div className="min-h-screen bg-white p-5">
      <div className="grid grid-cols-12 gap-4 mb-4">

        {/* Employee Section */}
        <div className="bg-gray-300 p-4 rounded-lg col-span-3">
          <h2 className="font-bold mb-2 text-black">Employee</h2>
          <button className="btn-light" onClick={() => router.push('/HRemployee/add')}>Add</button>
          <button className="btn-light" onClick={() => router.push('/HRemployee/edit')}>Edit</button>
          <button className="btn-light" onClick={() => router.push('/HRemployee/list')}>Current list</button>
          <button className="btn-light" onClick={() => router.push('/HRemployee/terminate')}>Terminate</button>
        </div>

        {/* Attendance Section */}
        <div className="bg-gray-300 p-4 rounded-lg col-span-3">
          <h2 className="font-bold mb-2 text-black">Attendance</h2>
          <button className="btn-light" onClick={() => router.push('/HRattendance/daily')}>Daily Attendance</button>
          <button className="btn-light" onClick={() => router.push('/HRattendance/history')}>History</button>
          <button className="btn-light" onClick={() => router.push('/HRattendance/add')}>Add Manually</button>
        </div>

        {/* salarie Section */}
        <div className="bg-gray-300 p-4 rounded-lg col-span-3">
          <h2 className="font-bold mb-2 text-black">Salary Management</h2>
          <button className="btn-light" onClick={() => router.push('/HRsalaries/calculate')}>Calculate Salary</button>
          <button className="btn-light" onClick={() => router.push('/HRsalaries/approval')}>Get Approval</button>
          <button className="btn-light" onClick={() => router.push('/HRsalaries/customize')}>Customize Salary Formula</button>
          <button className="btn-light" onClick={() => router.push('/HRsalaries/payslip')}>Download Payslip</button>
        </div>

        
        {/* Analytics Section */}
                <div className="bg-gray-300 p-4 rounded-lg col-span-3 flex items-center justify-center">
          <button className="btn-dark text-black w-full" onClick={() => router.push('/HRanalytics')}>Analytics</button>
        </div>
      </div>

      
      {/* Second row */}
      <div className="grid grid-cols-12 gap-4">
        {/* Notifications */}
        <div className="bg-gray-300 p-4 rounded-lg col-span-6">
          <h2 className="font-bold mb-2 text-black">Notifications</h2>
          <div className="h-48 bg-gray-400 rounded"></div>
        </div>

        {/* Calendar and Reminders */}
        <div className="bg-gray-300 p-4 rounded-lg col-span-6">
          <h2 className="font-bold mb-2 text-black">Reminder / Calendar</h2>
          <div className="mt-4 bg-gray-400 p-4 rounded flex gap-4">
             {/*Calendar */}
            {date && (
              <div className="bg-white p-3 rounded shadow-md text-black">
                <Calendar
                  onChange={setDate}
                  value={date}
                  onClickDay={handleDateClick}
                  className="rounded"
                  locale="en-GB" 
                />
              </div>
            )}

            {/* Reminders */}
            <div className="flex-1 p-3 bg-white rounded shadow-md text-black">
              <h3 className="text-black font-bold mb-2">Reminders:</h3>
              {date && reminders[date.toDateString()] ? (
                   <p>{reminders[date.toDateString()]}</p>
               ) : (
                 <p>No reminders</p>
               )}
            </div>
          </div>
        </div>
      </div>

      {/* Styling */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap');
        .min-h-screen {
          background-color: #F6F8FF;
          font-family: 'Poppins', sans-serif;
        }
        .btn-light {


          display: block;
          width: 100%;
          background-color: white;
          color: black;
          border: 1px solid black;
          padding: 10px;
          margin: 5px 0;
          border-radius: 5px;
          text-align: center;
          cursor: pointer;
          font-family: 'Poppins', sans-serif;
        }
        .btn-light:hover {
          background-color: #e0e0e0;
          border: 1px solid black;
        }
      `}</style>
    </div>
  );
}