"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

const FinanceDashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data1, setData1] = useState([]);
  

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingDescription, setPendingDescription] = useState("");
  const [pendingDate, setPendingDate] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [Approvemodal, setApprovemodal] = useState(false);
  const [approveAmount, setApproveAmount] = useState(""); 
  const [selectedBankAccount, setselectedbank] = useState(""); 

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

      const dataWithStatus = formattedData;
      setData(dataWithStatus);
      console.log("Formatted Data set to state:", dataWithStatus);
    } catch (error) {
      console.error("Fetching error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getRequests2 = async (newdata) => {
    setLoading(true);
    setError(null);
    try {
      console.log("Sending request with data:", newdata);
      const response = await axios.post("http://localhost:8080/pending", newdata);
      console.log("API Response:", response.data);

      const responseData = response.data.requests || response.data;
      const formattedData1 = Array.isArray(responseData) ? responseData : [responseData];

      const newdataPending = {
        status: "pending",
      };
      const dataWithStatus1 = formattedData1;
      setData1(dataWithStatus1);
      console.log("Formatted Data set to state:", dataWithStatus1);
    } catch (error) {
      console.error("Fetching error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRequests(newdata);
    getRequests2(newdata);
  }, []);

  useEffect(() => {
    console.log("Updated State (data):", data);
  }, [data]);

  const handleAction = async (row, action, description = "", date = "", approveAmount = "", bankAccount = "") => {
    console.log(`Action "${action}" triggered for row:`, row);
    try {
      console.log("methana shape");
      await axios.post(`http://localhost:8080/api/action/${row._id}`, {
        status: action,
        sec_id: "Tra123",
        amount: row.amount,
        description: description,
        date: date,
        approveAmount: approveAmount, // Send approve amount to backend
        bankAccount: bankAccount, // Send selected bank account to backend
      }).then((response) => {});

      await getRequests(newdata);
      await getRequests2(newdata);

      // const updatedData = data.map(item =>
      //   item._id === row._id ? { ...item, status: action } : item
      // );
      setData(updatedData);
    } catch (error) {
      console.error("Error updating status:", error);
      setError(error.message);
    }
  };

  // Function to open the modal for the "Pending" action
  const openPendingModal = (row) => {
    setSelectedRow(row);
    setIsModalOpen(true);
  };


  const openApproveModal = (row) => {
    setSelectedRow(row);
    setApproveAmount(""); // Reset amount
    setselectedbank(""); // Reset bank account
    setApprovemodal(true);
  };

  const handleModalSubmit = () => {
    if (selectedRow) {
      handleAction(selectedRow, "pending", pendingDescription, pendingDate);
    }
    setIsModalOpen(false);
    setPendingDescription("");
    setPendingDate("");
    setSelectedRow(null);
  };

  // Function to handle modal form submission for Approve
  const handleApproveSubmit = () => {
    if (selectedRow) {
      handleAction(selectedRow, "approve", "", "", approveAmount, selectedBankAccount);
    }
    setApprovemodal(false);
    setApproveAmount("");
    setselectedbank("");
    setSelectedRow(null);
  };

  // Function to close the modal without submitting
  const closeModal = () => {
    setIsModalOpen(false);
    setPendingDescription("");
    setPendingDate("");
    setSelectedRow(null);
  };

  // Function to close the Approve modal without submitting
  const closeApproveModal = () => {
    setApprovemodal(false);
    setApproveAmount("");
    setselectedbank("");
    setSelectedRow(null);
  };

  // Static list of bank accounts (replace with dynamic data if needed)
  const bankAccounts = [
    { value: "BO123", label: "BOC Transport" },
    { value: "bank2", label: "RDB Transport" },
    { value: "HN123", label: "HNB Transport" },
  ];

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
                              onClick={() => openApproveModal(row)} 
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
                              onClick={() => openPendingModal(row)}
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
            <div className="mt-4 max-h-60 overflow-y-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-600">
                    <th className="p-2 border-b">Amount</th>
                    <th className="p-2 border-b">Description</th>
                    <th className="p-2 border-b">Date</th>
                    <th className="p-2 border-b">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data1.length > 0 ? (
                    data1.map((row, index) => (
                      <tr key={index} className="bg-gray-500 hover:bg-gray-600">
                        <td className="p-2 border-b text-green-300">${row.amount || "0"}</td>
                        <td className="p-2 border-b">{row.description || "No description"}</td>
                        <td className="p-2 border-b">{row.date || "No date"}</td>
                        <td className="p-2 border-b">
                          <div className="flex space-x-2">
                            <button
                              className={`px-2 py-1 rounded text-white ${
                                row.status === "approve"
                                  ? "bg-blue-800"
                                  : "bg-blue-600 hover:bg-blue-700"
                              }`}
                              onClick={() => openApproveModal(row)}
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
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="p-2 text-gray-300 text-center">
                        No pending transactions available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

  
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4 text-black">Add Pending Details</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <input
                type="text"
                value={pendingDescription}
                onChange={(e) => setPendingDescription(e.target.value)}
                className="mt-1 p-2 w-full border rounded-md text-black"
                placeholder="Enter description"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                value={pendingDate}
                onChange={(e) => setPendingDate(e.target.value)}
                className="mt-1 p-2 w-full border rounded-md text-black"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleModalSubmit}
                className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

    
      {Approvemodal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4 text-black">Approve Transaction</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Amount</label>
              <input
                type="number"
                value={approveAmount}
                onChange={(e) => setApproveAmount(e.target.value)}
                className="mt-1 p-2 w-full border rounded-md text-black"
                placeholder="Enter amount"
                step="0.01" 
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Select Bank Account</label>
              <select
                value={selectedBankAccount}
                onChange={(e) => setselectedbank(e.target.value)}
                className="mt-1 p-2 w-full border rounded-md text-black"
              >
                <option value="" disabled>Select a bank account</option>
                {bankAccounts.map((account) => (
                  <option key={account.value} value={account.value}>
                    {account.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={closeApproveModal}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleApproveSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinanceDashboard;