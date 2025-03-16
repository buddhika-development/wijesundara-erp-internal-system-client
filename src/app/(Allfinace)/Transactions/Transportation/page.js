"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

const FinanceDashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const newdata = {
    sec_id: "Tra123",
  };

  const getRequests = async (newdata) => {
    setLoading(true);
    setError(null);
    try {
      console.log("Sending request with data:", newdata);
      const response = await axios.post("http://localhost:8080/all", newdata);
      console.log("API Response:", response.data);

      const responseData = response.data.requests || response.data;
      const formattedData = Array.isArray(responseData) ? responseData : [responseData];
      // Add a default status to each row if not present
      const dataWithStatus = formattedData.map(item => ({
        ...item,
        status: item.status || "pending", // Default to "pending"
      }));
      setData(dataWithStatus);
      console.log("Formatted Data set to state:", dataWithStatus);
    } catch (error) {
      console.error("Fetching error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRequests(newdata);
  }, []);

  useEffect(() => {
    console.log("Updated State (data):", data);
  }, [data]);

  const handleAction = async (row, action) => {
    console.log(`Action "${action}" triggered for row:`, row);
    try {
        console.log("methana shape");
      await axios.post(`http://localhost:8080/api/action/${row._id}`, { status: action });

      // Refresh data from the backend
      await getRequests(newdata);

   
    //  const updatedData = data.map(item =>
    //    item._id === row._id ? { ...item, status: action } : item
    //  );
      setData(updatedData);
    } catch (error) {
      console.error("Error updating status:", error);
      setError(error.message);
    }
  };

  return (
    <div className="p-4">
      <div className="flex-1 flex flex-col gap-4">
        <div className="h-16 bg-gray-500 rounded-lg flex items-center p-4 text-white text-lg">
          Transport Dashboard
        </div>

        <div className="flex gap-4">
          <div className="flex-1 bg-gray-400 rounded-lg p-4 text-white text-lg">
            <h2>Notifications</h2>
            <div className="mt-4 max-h-60 overflow-y-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-600">
                    <th className="p-2 border-b">Amount</th>
                    <th className="p-2 border-b">Description</th>
                    <th className="p-2 border-b">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="3" className="p-2 text-gray-300 text-center">
                        Loading notifications...
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan="3" className="p-2 text-red-300 text-center">
                        Error: {error}
                      </td>
                    </tr>
                  ) : Array.isArray(data) && data.length > 0 ? (
                    data.map((row, index) => (
                      <tr key={index} className="bg-gray-500 hover:bg-gray-600">
                        <td className="p-2 border-b text-green-300">${row.amount || "0"}</td>
                        <td className="p-2 border-b">{row.description || "No description"}</td>
                        <td className="p-2 border-b">
                          <div className="flex space-x-2">
                            <button
                              className={`px-2 py-1 rounded text-white ${
                                row.status === "approve"
                                  ? "bg-blue-800"
                                  : "bg-blue-600 hover:bg-blue-700"
                              }`}
                              onClick={() => handleAction(row, "approve")}
                            >
                              Approve
                            </button>
                            <button
                              className={`px-2 py-1 rounded text-white ${
                                row.status === "decline"
                                  ? "bg-red-800"
                                  : "bg-red-600 hover:bg-red-700"
                              }`}
                              onClick={() => handleAction(row, "decline")}
                            >
                              Decline
                            </button>
                            <button
                              className={`px-2 py-1 rounded text-white ${
                                row.status === "pending"
                                  ? "bg-yellow-800"
                                  : "bg-yellow-600 hover:bg-yellow-700"
                              }`}
                              onClick={() => handleAction(row, "pending")}
                            >
                              Pending
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="p-2 text-gray-300 text-center">
                        No notifications available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
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