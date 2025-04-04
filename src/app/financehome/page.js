"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter, usePathname } from "next/navigation";

const FinanceDashboard = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [data, setData] = useState([]); // Initial state as an array

  const getRequests = async () => {
    try {
      const response = await axios.get("http://localhost:8080/requests");
      
      console.log("API Response:", response.data);

      const responseData = response.data.requests || response.data; 
      
      setData(Array.isArray(responseData) ? responseData : [responseData]);

      console.log("Updated State:", data);
    } catch (error) {
      console.error("Fetching error", error);
    }
};

  useEffect(() => {
    getRequests();
  }, [pathname]);

  return (
    <div className="p-4">
      <div className="flex-1 flex flex-col gap-4">
        
        <div className="h-16 bg-gray-500 rounded-lg flex items-center p-4 text-white text-lg">
          Finance Dashboard
        </div>

        <div className="flex gap-4">
          <div className="flex-1 bg-gray-400 rounded-lg p-4 text-white text-lg">
            Balance Summary
            <div className="mt-4">
              <div className="h-12 bg-gray-500 rounded-md flex items-center px-4">
                <span className="text-xl">💰 Total Balance: $5,200</span>
              </div>
              <div className="h-12 bg-green-500 rounded-md flex items-center px-4 mt-2">
                <span className="text-lg">📥 Income: $3,000</span>
              </div>
              <div className="h-12 bg-red-500 rounded-md flex items-center px-4 mt-2">
                <span className="text-lg">📤 Expenses: $1,800</span>
              </div>
            </div>
          </div>

          <div className="flex-1 bg-gray-400 rounded-lg p-4 text-white text-lg">
            Recent Transactions
            <div className="mt-4 space-y-2">
              {["Grocery - $50", "Salary Received - $2,000", "Rent - $800", "Electric Bill - $100"].map((item, index) => (
                <div key={index} className="h-10 bg-gray-500 rounded-md flex items-center px-4">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-4">
        <div className="flex-1 bg-gray-400 rounded-lg p-4 text-white text-lg">
              <h2>Notifications</h2>
              <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
                {Array.isArray(data) && data.length > 0 ? (
                  data.map((row, index) => (
                    <div key={index} className="bg-gray-500 rounded-md p-4 text-white">
                      <div className="flex justify-between">
                        <span className="font-bold">ID:</span> 
                        <span>{row.id || "N/A"}</span>
                      </div>
                      <div className="flex justify-between mt-2">
                        <span className="font-bold">Description:</span> 
                        <span>{row.description || "No description"}</span>
                      </div>
                      <div className="flex justify-between mt-2">
                        <span className="font-bold">Amount:</span> 
                        <span className="text-green-300">${row.amount || "0"}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-300">No notifications available.</div>
                )}
              </div>
            </div>

          <div className="flex-1 bg-gray-400 rounded-lg p-4 text-white text-lg">
            <h2>Reminders</h2>
            <div className="mt-4 space-y-2">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="h-10 bg-gray-500 rounded-md"></div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FinanceDashboard;
