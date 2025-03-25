"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter, usePathname } from "next/navigation";

const FinanceDashboard = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [data, setData] = useState([]);
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const newdata = { status: "pending" };
  const newdata1 = { status: "approve" };

  const getRequests = async () => {
    try {
      const response = await axios.get("http://localhost:8080/requests");
      const responseData = response.data.requests || response.data;
      setData(Array.isArray(responseData) ? responseData : [responseData]);
    } catch (error) {
      console.error("Fetching error", error);
    }
  };

  const getRequests4 = async () => {
    try {
      const response = await axios.get("http://localhost:8080/requests1", { params: newdata1 });
      const responseData = response.data.requests || response.data;
      setData2(Array.isArray(responseData) ? responseData : [responseData]);
    } catch (error) {
      console.error("Fetching error", error);
    }
  };

  const getRequests2 = async (newdata) => {
    try {
      const response = await axios.post("http://localhost:8080/pending", newdata);
      const responseData = response.data.requests || response.data;
      console.log("hi hi",responseData);
      setData1(Array.isArray(responseData) ? responseData : [responseData]);
    } catch (error) {
      console.error("Fetching error:", error);
    }
  };

  useEffect(() => {
    getRequests();
  }, [pathname]);

  useEffect(() => {
    getRequests2(newdata);
    getRequests4();
  }, []);

  const departmentMap = {
    HR123: "HR Department",
    Tra123: "Transport Department",
    IN123: "Income",
    ST123: "expense",
  };
  const find = {
    HR123: "Salary",
    Tra123: "Transportation",
    IN123: "Stock",
    ST123: "expense",
  };

  const pendings = (id) => {
    router.push(`/Transactions/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <style jsx>{`
        .custom-scroll::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: #e5e7eb;
          border-radius: 10px;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: #10b981;
          border-radius: 10px;
          border: 2px solid #e5e7eb;
        }
        .custom-scroll::-webkit-scrollbar-thumb:hover {
          background: #059669;
        }
      `}</style>

      <div className="max-w-5xl mx-auto">
        
        <div className="h-16 bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-3xl font-bold flex items-center px-6 rounded-xl shadow-lg mb-6">
          Finance Dashboard
        </div>


        <div className="grid grid-cols-2 gap-6 mb-6">
     
          <div className="bg-white rounded-xl shadow-lg p-6 h-64 flex flex-col">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Balance Summary</h2>
            <div className="flex-1 space-y-2">
              <div className="bg-gray-50 rounded-lg p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">💰</span>
                  <span className="text-base font-medium text-gray-600">Total Balance</span>
                </div>
                <span className="text-lg font-semibold text-gray-900">LKT 5,200</span>
              </div>
              <div className="bg-green-50 rounded-lg p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📥</span>
                  <span className="text-base font-medium text-green-700">Income</span>
                </div>
                <span className="text-lg font-semibold text-green-700">LKR 3,000</span>
              </div>
              <div className="bg-red-50 rounded-lg p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📤</span>
                  <span className="text-base font-medium text-red-700">Expenses</span>
                </div>
                <span className="text-lg font-semibold text-red-700">LKR 1,800</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 h-64 flex flex-col">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Transactions</h2>
            <div className="flex-1 overflow-y-auto custom-scroll space-y-3">
              {data2.length > 0 ? (
                data2.map((row, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-lg p-3 flex justify-between items-center hover:bg-gray-100 transition-colors"
                  >
                    <span className="text-gray-700 font-medium">
                      {row.departmentName ? row.sec_id : departmentMap[row.sec_id] || "N/A"}
                    </span>
                    <span className="text-green-600 font-semibold">LKR {row.amount || "0"}</span>
                  </div>
                ))
              ) : (
                <div className="text-gray-500 text-center py-4">No recent transactions</div>
              )}
            </div>
          </div>
        </div>

     
        <div className="grid grid-cols-2 gap-6">
         
          <div className="bg-white rounded-xl shadow-lg p-6 h-80 flex flex-col">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Notifications</h2>
            <div className="flex-1 overflow-y-auto custom-scroll space-y-3">
              {Array.isArray(data) && data.length > 0 ? (
                data.map((row, index) => (
                  <div
                    key={index}
                    onClick={() => pendings(row.departmentName ? row.sec_id : find[row.sec_id] || index)}
                    className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 cursor-pointer transition-colors"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600 font-medium">Department:</span>
                      <span className="text-gray-800">
                        {row.departmentName ? row.sec_id : departmentMap[row.sec_id] || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600 font-medium">Description:</span>
                      <span className="text-gray-800">{row.description || "No description"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">Amount:</span>
                      <span className="text-green-600 font-semibold">LKR {row.amount || "0"}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-gray-500 text-center py-4">No notifications available</div>
              )}
            </div>
          </div>

         
          <div className="bg-white rounded-xl shadow-lg p-6 h-80 flex flex-col">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Reminders</h2>
            <div className="flex-1 overflow-y-auto custom-scroll space-y-3">
              {Array.isArray(data1) && data1.length > 0 ? (
                data1.map((row, index) => (
                  <div
                    key={index}
                    onClick={() => pendings(row.departmentName ? row.sec_id : find[row.sec_id] || index)}
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
    </div>
  );
};

export default FinanceDashboard;