"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

const FinanceDashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const [data3, setData3] = useState([]); 
  const [data4, setData4] = useState([]); 
  

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingDescription, setPendingDescription] = useState("");
  const [pendingDate, setPendingDate] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [Approvemodal, setApprovemodal] = useState(false);
  const [approveAmount, setApproveAmount] = useState(""); 
  const [selectedBankAccount, setselectedbank] = useState(""); 
  const [select, setSelectedTotalBank] = useState(""); 
  

  const newdata = {
    sec_id: "ST123",
  };

  const newdata1 = {
    status: "approve",
    sec_id: "ST123",
  };

  const newdata2 = { 
    status: "decline",
    sec_id: "ST123",
  }

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

  const bank = async (value) => {
    try {
      console.log("bank acc no",value);
        
      const response = await axios.post("http://localhost:8080/Bank",{ bank_id:value });
      console.log("Bank API Response:", response.data);

      const responseData = response.data || [];
      const formattedData = Array.isArray(responseData) ? responseData : [responseData];
      setData4(formattedData);
    } catch (error) {
      console.error("Error calling Bank API:", error);
    }
  };

  const getRequests3 = async (newdata1) => {
    setLoading(true);
    setError(null);
    try {
      console.log("Sending request with data:", newdata1);
      const response = await axios.post("http://localhost:8080/requests2", newdata1);
      console.log("API Response:", response.data);

      const responseData = response.data.requests || response.data;
      const formattedData1 = Array.isArray(responseData) ? responseData : [responseData];

      setData2(formattedData1);
      console.log("Formatted Data set to state:", formattedData1);
    } catch (error) {
      console.error("Fetching error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getRequests4 = async (newdata2) => { 
    setLoading(true);
    setError(null);
    try {
      console.log("Sending request with data:", newdata2);
      const response = await axios.post("http://localhost:8080/requests2", newdata2); 
      console.log("API Response:", response.data);

      const responseData = response.data.requests || response.data;
      const formattedData1 = Array.isArray(responseData) ? responseData : [responseData];

      setData3(formattedData1);
      console.log("Formatted Data set to state:", formattedData1);
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
    getRequests3(newdata1);
    getRequests4(newdata2);
  }, []);

  useEffect(() => {
    console.log("Updated State (data):", data);
  }, [data]);

  const calculateTotal = () => {
    if (!Array.isArray(data4) || data4.length === 0) return 0;

    const filteredData = select
      ? data4.filter(row => row.bank_id === select)
      : data4;

    return filteredData.reduce((total, row) => {
      const amount = parseFloat(row.Bamount) || 0; 
      return total + amount;
    }, 0);
  };

  const handleBankChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedTotalBank(selectedValue);
    if (selectedValue) { 
      bank(selectedValue);
    }
  };

  const handleAction = async (row, action, description = "", date = "", approveAmount = "", bankAccount = "") => {
    console.log(`Action "${action}" triggered for row:`, row);
    try {
      console.log("methana shape");
      const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
      await axios.post(`http://localhost:8080/api/action/${row._id}`, {
        status: action,
        sec_id: "ST123",
        amount: row.amount,
        description: description,
        date: action === "pending" ? date : currentDate, // Use provided date for pending, else current date
        approveAmount: approveAmount,
        bankAccount: bankAccount, 
      }).then((response) => {});

      await getRequests(newdata);
      await getRequests2(newdata);

      setData(updatedData);
    } catch (error) {
      console.error("Error updating status:", error);
      setError(error.message);
    }
  };

  const openPendingModal = (row) => {
    setSelectedRow(row);
    setIsModalOpen(true);
  };

  const openApproveModal = (row) => {
    setSelectedRow(row);
    setApproveAmount(row.amount.toString()); 
    setselectedbank("");
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

  const handleApproveSubmit = () => {
    if (selectedRow) {
      handleAction(selectedRow, "approve", "", "", approveAmount, selectedBankAccount);
    }
    setApprovemodal(false);
    setApproveAmount("");
    setselectedbank("");
    setSelectedRow(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setPendingDescription("");
    setPendingDate("");
    setSelectedRow(null);
  };

  const closeApproveModal = () => {
    setApprovemodal(false);
    setApproveAmount("");
    setselectedbank("");
    setSelectedRow(null);
  };

  const bankAccounts = [
    { value: "BO123", label: "BOC " },
    { value: "RD123", label: "RDB " },
    { value: "HN123", label: "HNB " },
  ];

  return (
    <div className="p-4">
      <div className="flex-1 flex flex-col gap-4">
        <div className="h-16 bg-gray-500 rounded-lg flex items-center p-4 text-white text-lg">
          Expenses Dashboard
        </div>

        <div className="h-16 bg-gray-600 rounded-lg flex items-center p-4 text-white text-lg gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="bankSelect">Select Bank Account:</label>
            <select
              id="bankSelect"
              value={select}
              onChange={handleBankChange}
              className="p-2 rounded-md text-black"
            >
              <option value="">All Banks</option>
              {bankAccounts.map((account) => (
                <option key={account.value} value={account.value}>
                  {account.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            Total: <span className="text-green-300">LKR {calculateTotal().toFixed(2)}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-400 rounded-lg p-4 text-white text-lg">
            <h2>Notifications</h2>
            <div className="mt-4 max-h-45 overflow-y-auto">
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
                        <td className="p-2 border-b text-green-300">LKR {row.amount || "0"}</td>
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
          <div className="bg-gray-400 rounded-lg p-4 text-white text-lg">
            <h2>Reminders</h2>
            <div className="mt-4 max-h-45 overflow-y-auto">
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
                        <td className="p-2 border-b text-green-300">LKR {row.amount || "0"}</td>
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
          <div className="bg-gray-400 rounded-lg p-4 text-white text-lg">
            <h2>Approved Payments</h2>
            <div className="mt-4 max-h-45 overflow-y-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-600">
                    <th className="p-2 border-b">Amount</th>
                    <th className="p-2 border-b">Description</th>
                    <th className="p-2 border-b">Bank Account</th>
                  </tr>
                </thead>
                <tbody>
                  {data2.length > 0 ? (
                    data2.map((row, index) => (
                      <tr key={index} className="bg-gray-500 hover:bg-gray-600">
                        <td className="p-2 border-b text-green-300">LKR {row.amount || "0"}</td>
                        <td className="p-2 border-b">{row.description || "No description"}</td>
                        <td className="p-2 border-b">{row.bankAccount || "Not specified"}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="p-2 text-gray-300 text-center">
                        No approved payments available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="bg-gray-400 rounded-lg p-4 text-white text-lg">
            <h2>Rejected Payments</h2>
            <div className="mt-4 max-h-45 overflow-y-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-600">
                    <th className="p-2 border-b">Amount</th>
                    <th className="p-2 border-b">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {data3.length > 0 ? (
                    data3.map((row, index) => (
                      <tr key={index} className="bg-gray-500 hover:bg-gray-600">
                        <td className="p-2 border-b text-green-300">LKR {row.amount || "0"}</td>
                        <td className="p-2 border-b">{row.description || "No description"}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="2" className="p-2 text-gray-300 text-center">
                        No rejected payments available.
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
      {Approvemodal && selectedRow && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4 text-black">Approve Transaction</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Amount</label>
              <input
                type="number"
                value={approveAmount}
                onChange={(e) => setApproveAmount(e.target.value)}
                className={`mt-1 p-2 w-full border rounded-md text-black ${
                  approveAmount === "" || parseFloat(approveAmount) <= selectedRow.amount / 2
                    ? "border-red-500"
                    : ""
                }`}
                placeholder="Enter amount"
                step="0.01"
              />
              {approveAmount === "" && (
                <p className="text-red-500 text-sm mt-1">Amount is required.</p>
              )}
              {approveAmount !== "" && parseFloat(approveAmount) <= selectedRow.amount / 2 && (
                <p className="text-red-500 text-sm mt-1">
                  Amount must be greater than {selectedRow.amount / 2}.
                </p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Select Bank Account</label>
              <select
                value={selectedBankAccount}
                onChange={(e) => setselectedbank(e.target.value)}
                className={`mt-1 p-2 w-full border rounded-md text-black ${
                  selectedBankAccount === "" ? "border-red-500" : ""
                }`}
              >
                <option value="" disabled>Select a bank account</option>
                {bankAccounts.map((account) => (
                  <option key={account.value} value={account.value}>
                    {account.label}
                  </option>
                ))}
              </select>
              {selectedBankAccount === "" && (
                <p className="text-red-500 text-sm mt-1">Please select a bank account.</p>
              )}
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={closeApproveModal}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (
                    approveAmount === "" ||
                    parseFloat(approveAmount) <= selectedRow.amount / 2 ||
                    selectedBankAccount === ""
                  ) {
                    return;
                  }
                  handleApproveSubmit();
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                disabled={
                  approveAmount === "" ||
                  parseFloat(approveAmount) <= selectedRow.amount / 2 ||
                  selectedBankAccount === ""
                }
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