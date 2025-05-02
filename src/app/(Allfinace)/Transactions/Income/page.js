"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

const SimpleTable = () => {
  const [data, setData] = useState([]);
  const [approvedPayments, setApprovedPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const newdata = { sec_id: "IN123" };
  const newdata1 = { status: "approve", sec_id: "IN123" };
  const Bname = { bname: "INB123" };

  const getRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post("http://localhost:5000/all", newdata);
      const responseData = Array.isArray(response.data.requests || response.data)
        ? response.data.requests || response.data
        : [response.data];
      setData(responseData.filter((item) => item.status !== "approved"));
      setApprovedPayments(responseData.filter((item) => item.status === "approved"));
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getRequests4 = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post("http://localhost:5000/requests2", newdata1);
      const responseData = Array.isArray(response.data.requests || response.data)
        ? response.data.requests || response.data
        : [response.data];
      setApprovedPayments(responseData); 
    } catch (error) {
      console.error("Fetching error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (row) => {
    try {
      const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
      await axios.post(`http://localhost:5000/api/inaction/${row._id}`, {
        amount: row.amount,
        bankName: Bname.bname,
        status: newdata1.status,
        sec_id: newdata1.sec_id,
        date: currentDate, // Add current date to the payload
      });
      setData((prev) => prev.filter((item) => item !== row));
      setApprovedPayments((prev) => [...prev, { ...row, status: "approved", date: currentDate }]);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    getRequests();
    getRequests4();
  }, []);

  const TableRow = ({ row, isPending }) => (
    <tr className="border-t border-gray-200 hover:bg-gray-50">
      <td className="p-3 text-green-600 w-[200px]">LKR {row.amount || "0"}</td>
      <td className="p-3 text-gray-700 w-[600px]">{row.description || "No description"}</td>
      <td className="p-3 text-gray-700 w-[200px]">RDB</td>
      {isPending ? null : (
        <td className="p-3 text-gray-700 w-[200px]">
          {row.date ? new Date(row.date).toLocaleDateString() : "No date"}
        </td>
      )}
      <td className="p-3 w-[200px]">
        {isPending ? (
          <button
            className="px-3 py-1 rounded-lg text-white bg-blue-600 hover:bg-blue-700"
            onClick={() => handleAction(row)}
          >
            Approve
          </button>
        ) : (
          <span className="text-blue-600">Approved</span>
        )}
      </td>
    </tr>
  );

  const Table = ({ title, data, isPending }) => (
    <div className="bg-white rounded-xl shadow-lg p-4 h-[40vh] flex flex-col">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-left">
          <thead className="sticky top-0 bg-gray-100">
            <tr className="text-gray-700">
              <th className="p-2 font-semibold w-[200px]">Amount</th>
              <th className="p-2 font-semibold w-[600px]">Description</th>
              <th className="p-2 font-semibold w-[200px]">Bank Account</th>
              {isPending ? null : (
                <th className="p-2 font-semibold w-[200px]">Date</th>
              )}
              <th className="p-2 font-semibold w-[200px]">{isPending ? "Action" : "Status"}</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((row, index) => <TableRow key={index} row={row} isPending={isPending} />)
            ) : (
              <tr>
                <td colSpan={isPending ? 4 : 5} className="p-2 text-gray-500 text-center">
                  No {isPending ? "pending" : "approved"} transactions available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="h-screen bg-gray-100 p-4 flex flex-col overflow-hidden">
      <div className="max-w-full mx-auto flex-1 flex flex-col gap-4">
        <div className="h-12 bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-2xl font-bold flex items-center px-4 rounded-xl shadow-lg">
          Income
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <>
            <Table title="Pending Payments" data={data} isPending={true} />
            <Table title="Approved Payments" data={approvedPayments} isPending={false} />
          </>
        )}
      </div>
    </div>
  );
};

export default SimpleTable;