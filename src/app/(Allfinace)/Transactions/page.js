"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function TransactionsPage() {
  const router = useRouter();
  const [select, setSelectedTotalBank] = useState("");
  const [data1, setData1] = useState([]);
  const [data4, setData4] = useState([]);
  const [total, setTotal] = useState(0);
  const [notifications, setNotifications] = useState([]); 
  const [dismissedNotifications, setDismissedNotifications] = useState([]); 
  const newdata1 = { status: "pending" };

  const transactionTypes = [
    { name: "Income", path: "/Transactions/Income", color: "bg-green-600 hover:bg-green-700" },
    { name: "Expense", path: "/Transactions/expense", color: "bg-red-600 hover:bg-red-700" },
    { name: "Salary", path: "/Transactions/Salary", color: "bg-blue-600 hover:bg-blue-700" },
    { name: "Transportation", path: "/Transactions/Transportation", color: "bg-purple-600 hover:bg-purple-700" },
  ];

  const bankAccounts = [
    { value: "BO123", label: "BOC" },
    { value: "RD123", label: "RDB" },
    { value: "HN123", label: "HNB" },
  ];

  const calculateTotal = () => {
    if (!Array.isArray(data4) || data4.length === 0) return 0;

    const filteredData = select ? data4.filter((row) => row.bank_id === select) : data4;

    return filteredData.reduce((total, row) => {
      const amount = parseFloat(row.Bamount) || 0;
      return total + amount;
    }, 0);
  };

  const getRequests2 = async (newdata1) => {
    try {
      const response = await axios.post("http://localhost:5000/pending", newdata1);
      const responseData = response.data.requests || response.data;
      console.log("hi hi", responseData);
      setData1(Array.isArray(responseData) ? responseData : [responseData]);

    
      const todayReminders = (Array.isArray(responseData) ? responseData : [responseData]).filter((row) => {
        if (!row.date) return false;
        const currentDate = new Date("2025-05-01");
        const reminderDate = new Date(row.date);
        return (
          reminderDate.getFullYear() === currentDate.getFullYear() &&
          reminderDate.getMonth() === currentDate.getMonth() &&
          reminderDate.getDate() === currentDate.getDate()
        );
      });
      setNotifications(todayReminders);
    } catch (error) {
      console.error("Fetching error:", error);
    }
  };

  const bank = async (value) => {
    try {
      console.log("bank acc no", value);
      const response = await axios.post("http://localhost:5000/Bank", { bank_id: value });
      console.log("Bank API Response:", response.data);

      const responseData = response.data || [];
      const formattedData = Array.isArray(responseData) ? responseData : [responseData];
      setData4(formattedData);
    } catch (error) {
      console.error("Error calling Bank API:", error);
    } finally {
    }
  };

  const departmentMap = {
    HR123: "HR Department",
    Tra123: "Transport Department",
    IN123: "Income",
    ST123: "expense",
  };

  const handleBankChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedTotalBank(selectedValue);
    if (selectedValue) {
      bank(selectedValue);
    } else {
      setData4([]); 
    }
  };

 
  const dismissNotification = (index) => {
    setDismissedNotifications((prev) => [...prev, index]);
  };

  useEffect(() => {
    const newTotal = calculateTotal();
    setTotal(newTotal);
    getRequests2(newdata1);
  }, [data4, select]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {notifications.length > 0 && (
        <div className="max-w-4xl mx-auto mb-4 space-y-2">
          {notifications.map((reminder, index) => {
            if (dismissedNotifications.includes(index)) return null; 
            return (
              <div
                key={index}
                className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-lg shadow-md flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">Reminder Due Today!</p>
                  <p>
                    <span className="font-medium">Department:</span>{" "}
                    {reminder.departmentName ? reminder.sec_id : departmentMap[reminder.sec_id] || "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">Amount:</span>{" "}
                    <span className="text-green-600">LKR {reminder.amount || "0"}</span>
                  </p>
                  <p>
                    <span className="font-medium">Description:</span>{" "}
                    {reminder.description || "No description"}
                  </p>
                  <p>
                    <span className="font-medium">Date:</span> {reminder.date || "No date"}
                  </p>
                </div>
                <button
                  onClick={() => dismissNotification(index)}
                  className="text-yellow-700 hover:text-yellow-900 font-semibold focus:outline-none"
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <div className="h-16 bg-gradient-to-r from-gray-700 to-gray-900 text-white text-3xl font-bold flex items-center px-6 rounded-xl shadow-lg mb-6">
          Transactions Dashboard
        </div>

        <div className="flex gap-4 mb-6">
          <select
            className="bg-white text-gray-800 p-3 rounded-lg shadow-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
            id="bankSelect"
            value={select}
            onChange={handleBankChange}
          >
            <option value="">All Banks</option>
            {bankAccounts.map((account) => (
              <option key={account.value} value={account.value}>
                {account.label}
              </option>
            ))}
          </select>

          <div className="flex-1 bg-white h-12 rounded-lg shadow-md flex items-center px-4 text-gray-600">
            { (
              <span className="text-sm">
                Total: <span className="text-green-600 font-semibold">LKR {total.toFixed(2)}</span>
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          {transactionTypes.map((type) => (
            <button
              key={type.name}
              onClick={() => router.push(type.path)}
              className={`${type.color} h-28 rounded-xl flex items-center justify-center text-white text-xl font-semibold shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl`}
            >
              {type.name}
            </button>
          ))}
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 h-65 flex flex-col">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Reminders</h2>
            <div className="flex-1 overflow-y-auto custom-scroll space-y-3">
              {Array.isArray(data1) && data1.length > 0 ? (
                data1.map((row, index) => (
                  <div
                    key={index}
                    
                    className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 cursor-pointer transition-colors"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600 font-medium">Department:</span>
                      <span className="text-gray-800">
                        {row.departmentName ? row.sec_id : departmentMap[row.sec_id] || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600 font-medium">Amount:</span>
                      <span className="text-green-600 font-semibold">LKR {row.amount || "0"}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600 font-medium">Description:</span>
                      <span className="text-gray-800">{row.description || "No description"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">Date:</span>
                      <span className="text-gray-800">{row.date || "No date"}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-gray-500 text-center py-4">No pending transactions</div>
              )}
            </div>
          </div>
      </div>
    </div>
  );
}