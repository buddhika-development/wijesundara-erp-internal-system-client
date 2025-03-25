"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

const SimpleTable = () => {
  const [data, setData] = useState([]);
  const [approvedPayments, setApprovedPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const newdata = {
    sec_id: "IN123",
  };
  const newdata1 = {
    status: "approved",
    sec_id: "IN123",
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
      setData(formattedData.filter(item => item.status !== "approved"));
      setApprovedPayments(formattedData.filter(item => item.status === "approved"));
      console.log("Formatted Data set to state:", formattedData);
    } catch (error) {
      console.error("Fetching error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (row, Bname, newdata1) => {
    try {
      console.log("methana shapeEEEEEEEEEEEEEE", Bname, newdata1);
      const response = await axios.post(`http://localhost:8080/api/inaction/${row._id}`, {
        amount: row.amount,
        bankName: Bname.bname,
        status: newdata1.status,
        sec_id: newdata1.sec_id,
      });
      
      setData(prevData => prevData.filter(item => item !== row));
      setApprovedPayments(prevApproved => [...prevApproved, { ...row, status: "approved" }]);
    } catch (error) {
      console.error("Error updating status:", error);
      setError(error.message);
    }
  };

  const Bname = { bname: "INB123" };
  const openApproveModal = (row) => {
    handleAction(row, Bname, newdata1);
  };

  useEffect(() => {
    getRequests(newdata);
  }, []);

  useEffect(() => {
    console.log("Updated State (data):", data);
    console.log("Updated Approved Payments:", approvedPayments);
  }, [data, approvedPayments]);

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col">
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

      <div className="max-w-full mx-auto flex-1 flex flex-col gap-6">
        <div className="h-16 bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-3xl font-bold flex items-center px-6 rounded-xl shadow-lg">
          Income
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 h-[50vh] flex flex-col">
          <h2 className="text-xl font-semibold mb-4">Pending Payments</h2>
          <div className="flex-1 overflow-y-auto custom-scroll">
            <table className="w-full text-left">
              <thead className="sticky top-0 bg-gray-100">
                <tr className="text-gray-700">
                  <th className="p-3 font-semibold w-[200px]">Amount</th>
                  <th className="p-3 font-semibold w-[600px]">Description</th>
                  <th className="p-3 font-semibold w-[200px]">Bank Account</th>
                  <th className="p-3 font-semibold w-[200px]">Action</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(data) && data.length > 0 ? (
                  data.map((row, index) => (
                    <tr
                      key={index}
                      className="border-t border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-3 text-green-600 w-[200px]">LKR {row.amount || "0"}</td>
                      <td className="p-3 text-gray-700 w-[600px]">{row.description || "No description"}</td>
                      <td className="p-3 text-gray-700 w-[200px]">RDB</td>
                      <td className="p-3 w-[200px]">
                        <button
                          className="px-3 py-1 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                          onClick={() => openApproveModal(row)}
                        >
                          Approve Payment
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="p-3 text-gray-500 text-center">
                      No pending transactions available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>


        <div className="bg-white rounded-xl shadow-lg p-6 h-[50vh] flex flex-col">
          <h2 className="text-xl font-semibold mb-4">Approved Payments</h2>
          <div className="flex-1 overflow-y-auto custom-scroll">
            <table className="w-full text-left">
              <thead className="sticky top-0 bg-gray-100">
                <tr className="text-gray-700">
                  <th className="p-3 font-semibold w-[200px]">Amount</th>
                  <th className="p-3 font-semibold w-[600px]">Description</th>
                  <th className="p-3 font-semibold w-[200px]">Bank Account</th>
                  <th className="p-3 font-semibold w-[200px]">Status</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(approvedPayments) && approvedPayments.length > 0 ? (
                  approvedPayments.map((row, index) => (
                    <tr
                      key={index}
                      className="border-t border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-3 text-green-600 w-[200px]">LKR {row.amount || "0"}</td>
                      <td className="p-3 text-gray-700 w-[600px]">{row.description || "No description"}</td>
                      <td className="p-3 text-gray-700 w-[200px]">RDB</td>
                      <td className="p-3 text-blue-600 w-[200px]">Approved</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="p-3 text-gray-500 text-center">
                      No approved transactions available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleTable;