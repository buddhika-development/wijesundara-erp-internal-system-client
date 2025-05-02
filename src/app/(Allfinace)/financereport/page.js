"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Head from "next/head";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const EnhancedStatisticsDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [incomeData, setIncomeData] = useState([]);
  const [expenseData, setExpenseData] = useState([]);
  const [salaryData, setSalaryData] = useState([]);
  const [transportData, setTransportData] = useState([]);
  const [pendingData, setPendingData] = useState([]);
  const [bankData, setBankData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("All Months");

  // Configuration for each section
  const sections = [
    { name: "Income", sec_id: "IN123", data: incomeData, setData: setIncomeData },
    { name: "Expense", sec_id: "ST123", data: expenseData, setData: setExpenseData },
    { name: "Salary", sec_id: "HR123", data: salaryData, setData: setSalaryData },
    { name: "Transportation", sec_id: "Tra123", data: transportData, setData: setTransportData },
  ];

  const bankAccounts = [
    { value: "BO123", label: "BOC" },
    { value: "RD123", label: "RDB" },
    { value: "HN123", label: "HNB" },
  ];

  // Fetch data for a given section
  const fetchData = async (sec_id, setData) => {
    try {
      const approvedResponse = await axios.post("http://localhost:5000/requests2", { sec_id, status: "approved" });
      const approvedData = Array.isArray(approvedResponse.data.requests) ? approvedResponse.data.requests : [];

      const approveResponse = await axios.post("http://localhost:5000/requests2", { sec_id, status: "approve" });
      const approveData = Array.isArray(approveResponse.data.requests) ? approveResponse.data.requests : [];

      const declinedResponse = await axios.post("http://localhost:5000/requests2", { sec_id, status: "decline" });
      const declinedData = Array.isArray(declinedResponse.data.requests) ? declinedResponse.data.requests : [];

      const allData = [...approvedData, ...approveData, ...declinedData].reduce((acc, item) => {
        acc[item._id] = item;
        return acc;
      }, {});

      const formattedData = Object.values(allData).map((item) => ({
        ...item,
        date: item.date ? new Date(item.date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
      }));
      console.log(`Data for sec_id ${sec_id}:`, formattedData);
      setData(formattedData);
    } catch (error) {
      console.error(`Error fetching data for sec_id ${sec_id}:`, error);
      setError(error.message);
      setData([]);
    }
  };

  // Fetch pending data
  const fetchPendingData = async () => {
    try {
      const pendingResponse = await axios.post("http://localhost:5000/pending", { sec_id: "ST123" });
      const pendingData = Array.isArray(pendingResponse.data) ? pendingResponse.data : [];
      const formattedData = pendingData.map((item) => ({
        ...item,
        date: item.date ? new Date(item.date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
      }));
      console.log("Pending data:", formattedData);
      setPendingData(formattedData);
    } catch (error) {
      console.error("Error fetching pending data:", error);
      setError(error.message);
      setPendingData([]);
    }
  };

  // Fetch bank data
  const fetchBankData = async () => {
    try {
      const bankPromises = bankAccounts.map(({ value }) =>
        axios.post("http://localhost:5000/Bank", { bank_id: value })
      );
      const responses = await Promise.all(bankPromises);
      const formattedData = responses.map((res, index) => {
        const data = res.data;
        return {
          bank_id: bankAccounts[index].value,
          label: bankAccounts[index].label,
          Bamount: parseFloat(data[0]?.Bamount || 0),
        };
      });
      console.log("Bank data:", formattedData);
      setBankData(formattedData);
    } catch (error) {
      console.error("Error fetching bank data:", error);
      setError(error.message);
      setBankData([]);
    }
  };

  // Fetch all data on component mount
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          ...sections.map(section => fetchData(section.sec_id, section.setData)),
          fetchPendingData(),
          fetchBankData(),
        ]);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  // Helper to normalize status
  const normalizeStatus = (status) => {
    if (!status) return "pending";
    const normalized = status.toString().toLowerCase().trim();
    return normalized === "approved" ? "approve" : normalized;
  };

  // Calculate statistics for a given dataset
  const calculateStats = (data) => {
    const stats = {
      totalAmount: 0,
      pendingCount: 0,
      approvedCount: 0,
      rejectedCount: 0,
      pendingAmount: 0,
      approvedAmount: 0,
      rejectedAmount: 0,
    };

    data.forEach(row => {
      const amount = parseFloat(row.amount) || 0;
      stats.totalAmount += amount;
      const status = normalizeStatus(row.status);
      if (status === "pending") {
        stats.pendingCount += 1;
        stats.pendingAmount += amount;
      } else if (status === "approve") {
        stats.approvedCount += 1;
        stats.approvedAmount += amount;
      } else if (status === "decline") {
        stats.rejectedCount += 1;
        stats.rejectedAmount += amount;
      }
    });

    return stats;
  };

  // Calculate overall bank balance
  const calculateBankTotal = () => {
    return bankData.reduce((total, row) => total + (parseFloat(row.Bamount) || 0), 0);
  };

  // Calculate net income
  const calculateNetIncome = () => {
    const incomeStats = calculateStats(incomeData);
    const expenseStats = calculateStats(expenseData);
    const salaryStats = calculateStats(salaryData);
    const transportStats = calculateStats(transportData);
    return (
      incomeStats.approvedAmount -
      (expenseStats.approvedAmount + salaryStats.approvedAmount + transportStats.approvedAmount)
    );
  };

  // Combine all transaction data for the table
  const allTransactions = [
    ...incomeData.map(item => ({ ...item, category: "Income" })),
    ...expenseData.map(item => ({ ...item, category: "Expense" })),
    ...salaryData.map(item => ({ ...item, category: "Salary" })),
    ...transportData.map(item => ({ ...item, category: "Transportation" })),
    ...pendingData.map(item => ({ ...item, category: "Expense", status: "pending" })),
  ];

  // Get unique months for dropdown
  const getUniqueMonths = () => {
    const months = allTransactions
      .filter(item => item.date && !isNaN(new Date(item.date).getTime()))
      .map(item => {
        const date = new Date(item.date);
        return date.toLocaleString("default", { month: "short", year: "numeric" });
      });
    return ["All Months", ...[...new Set(months)].sort((a, b) => new Date(a) - new Date(b))];
  };

  // Filter data by selected month
  const filterDataByMonth = (data) => {
    if (selectedMonth === "All Months") return data;
    return data.filter(item => {
      if (!item.date || isNaN(new Date(item.date).getTime())) return false;
      const date = new Date(item.date);
      const monthYear = date.toLocaleString("default", { month: "short", year: "numeric" });
      return monthYear === selectedMonth;
    });
  };

  // Generate PDF report
  const generatePDFReport = () => {
    try {
      const doc = new jsPDF();

      // Title
      doc.setFontSize(18);
      doc.text(`Financial Statistics Report - ${selectedMonth}`, 14, 20);

      // Filter transactions by category
      const filteredTransactions = filterDataByMonth(allTransactions);
      const incomeTransactions = filteredTransactions.filter(item => item.category === "Income");
      const expenseTransactions = filteredTransactions.filter(item => item.category === "Expense" && item.status !== "pending");
      const salaryTransactions = filteredTransactions.filter(item => item.category === "Salary");
      const transportTransactions = filteredTransactions.filter(item => item.category === "Transportation");
      const pendingExpenses = filteredTransactions.filter(item => item.category === "Expense" && item.status === "pending");

      // Income Transactions
      doc.setFontSize(14);
      doc.text("Income Transactions", 14, 30);
      const incomeBody = incomeTransactions.map(item => [
        item.sec_id || "N/A",
        (parseFloat(item.amount) || 0).toFixed(2),
        normalizeStatus(item.status) || "N/A",
        item.date || "N/A",
        item.description || "N/A",
      ]);
      console.log("Income Transactions for PDF:", incomeBody);
      autoTable(doc, {
        startY: 35,
        head: [["Sec ID", "Amount (LKR)", "Status", "Date", "Description"]],
        body: incomeBody,
      });

      // Expense Transactions
      const finalYIncome = doc.lastAutoTable?.finalY || 35;
      doc.setFontSize(14);
      doc.text("Expense Transactions", 14, finalYIncome + 10);
      const expenseBody = expenseTransactions.map(item => [
        item.sec_id || "N/A",
        (parseFloat(item.amount) || 0).toFixed(2),
        normalizeStatus(item.status) || "N/A",
        item.date || "N/A",
        item.description || "N/A",
      ]);
      console.log("Expense Transactions for PDF:", expenseBody);
      autoTable(doc, {
        startY: finalYIncome + 15,
        head: [["Sec ID", "Amount (LKR)", "Status", "Date", "Description"]],
        body: expenseBody,
      });

      // Salary Transactions
      const finalYExpense = doc.lastAutoTable?.finalY || finalYIncome + 15;
      doc.setFontSize(14);
      doc.text("Salary Transactions", 14, finalYExpense + 10);
      const salaryBody = salaryTransactions.map(item => [
        item.sec_id || "N/A",
        (parseFloat(item.amount) || 0).toFixed(2),
        normalizeStatus(item.status) || "N/A",
        item.date || "N/A",
        item.description || "N/A",
      ]);
      console.log("Salary Transactions for PDF:", salaryBody);
      autoTable(doc, {
        startY: finalYExpense + 15,
        head: [["Sec ID", "Amount (LKR)", "Status", "Date", "Description"]],
        body: salaryBody,
      });

      // Transportation Transactions
      const finalYSalary = doc.lastAutoTable?.finalY || finalYExpense + 15;
      doc.setFontSize(14);
      doc.text("Transportation Transactions", 14, finalYSalary + 10);
      const transportBody = transportTransactions.map(item => [
        item.sec_id || "N/A",
        (parseFloat(item.amount) || 0).toFixed(2),
        normalizeStatus(item.status) || "N/A",
        item.date || "N/A",
        item.description || "N/A",
      ]);
      console.log("Transportation Transactions for PDF:", transportBody);
      autoTable(doc, {
        startY: finalYSalary + 15,
        head: [["Sec ID", "Amount (LKR)", "Status", "Date", "Description"]],
        body: transportBody,
      });

      // Pending Expenses
      const finalYTransport = doc.lastAutoTable?.finalY || finalYSalary + 15;
      doc.setFontSize(14);
      doc.text("Pending Expenses", 14, finalYTransport + 10);
      const pendingBody = pendingExpenses.map(item => [
        item.sec_id || "N/A",
        (parseFloat(item.amount) || 0).toFixed(2),
        normalizeStatus(item.status) || "N/A",
        item.date || "N/A",
        item.description || "N/A",
      ]);
      console.log("Pending Expenses for PDF:", pendingBody);
      autoTable(doc, {
        startY: finalYTransport + 15,
        head: [["Sec ID", "Amount (LKR)", "Status", "Date", "Description"]],
        body: pendingBody,
      });

      // Bank Data Table
      const finalYPending = doc.lastAutoTable?.finalY || finalYTransport + 15;
      doc.setFontSize(14);
      doc.text("Bank Data", 14, finalYPending + 10);
      const bankBody = bankData.map(item => [
        item.bank_id || "N/A",
        item.label || "N/A",
        (item.Bamount || 0).toFixed(2),
      ]);
      console.log("Bank Data for PDF:", bankBody);
      autoTable(doc, {
        startY: finalYPending + 15,
        head: [["Bank ID", "Label", "Balance (LKR)"]],
        body: bankBody,
      });

      // Financial Summary Table
      const finalYBank = doc.lastAutoTable?.finalY || finalYPending + 15;
      doc.setFontSize(14);
      doc.text("Financial Summary", 14, finalYBank + 10);
      const summaryBody = [
        ["Total Income (Approved)", calculateStats(incomeData).approvedAmount.toFixed(2)],
        ["Total Expenses (Approved)", calculateStats(expenseData).approvedAmount.toFixed(2)],
        ["Total Salaries (Approved)", calculateStats(salaryData).approvedAmount.toFixed(2)],
        ["Total Transportation (Approved)", calculateStats(transportData).approvedAmount.toFixed(2)],
        ["Net Income", calculateNetIncome().toFixed(2)],
        ["Total Bank Balance", calculateBankTotal().toFixed(2)],
      ];
      console.log("Financial Summary for PDF:", summaryBody);
      autoTable(doc, {
        startY: finalYBank + 15,
        head: [["Metric", "Value"]],
        body: summaryBody,
      });

      // Save PDF
      doc.save(`Financial_Statistics_${selectedMonth.replace(/\s+/g, "_")}.pdf`);
    } catch (error) {
      console.error("Error generating PDF report:", error);
      setError("Failed to generate PDF report: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
      <Head>
        <title>Financial Report Dashboard</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 text-center">Financial Report Dashboard</h1>
          <p className="text-gray-600 text-center mt-2">View and download detailed financial reports by month.</p>
        </div>

        {/* Loading and Error States */}
        {loading && (
          <div className="bg-white shadow-lg rounded-lg p-6 w-full text-center">
            <p className="text-gray-600 text-lg">Loading data...</p>
          </div>
        )}
        {error && (
          <div className="bg-red-50 shadow-lg rounded-lg p-6 w-full text-center">
            <p className="text-red-600 text-lg">Error: {error}</p>
          </div>
        )}

        {/* Main Content */}
        {!loading && (
          <div className="space-y-8">
            {/* Month Selection and Download Button */}
            <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <label htmlFor="monthSelect" className="text-gray-700 font-medium text-sm sm:text-base">
                  Select Month:
                </label>
                <select
                  id="monthSelect"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full sm:w-auto p-2.5 border border-gray-300 rounded-lg text-gray-800 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                >
                  {getUniqueMonths().map((month) => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
                {getUniqueMonths().length === 1 && (
                  <p className="text-sm text-yellow-600">No valid transaction dates found</p>
                )}
              </div>
              <button
                onClick={generatePDFReport}
                className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                </svg>
                Download PDF Report
              </button>
            </div>

            {/* Transaction Data Table */}
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Transaction Data</h2>
              {allTransactions.length > 0 ? (
                <div className="overflow-x-auto max-h-96 overflow-y-auto custom-scroll">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-indigo-50 sticky top-0">
                      <tr>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Category</th>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Sec ID</th>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Amount</th>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Status</th>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Date</th>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filterDataByMonth(allTransactions).map((item, index) => (
                        <tr key={item._id || index} className="hover:bg-gray-50 transition duration-150">
                          <td className="py-3 px-4 text-sm text-gray-600">{item.category}</td>
                          <td className="py-3 px-4 text-sm text-gray-600">{item.sec_id}</td>
                          <td className="py-3 px-4 text-sm text-green-600">LKR {(parseFloat(item.amount) || 0).toFixed(2)}</td>
                          <td className="py-3 px-4 text-sm text-gray-600">{normalizeStatus(item.status) || "N/A"}</td>
                          <td className="py-3 px-4 text-sm text-gray-600">{item.date || "N/A"}</td>
                          <td className="py-3 px-4 text-sm text-gray-600">{item.description || "N/A"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center text-gray-600 text-sm">No transaction data available.</p>
              )}
            </div>

            {/* Bank Data Table */}
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Bank Data</h2>
              {bankData.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-indigo-50">
                      <tr>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Bank ID</th>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Label</th>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Balance (LKR)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {bankData.map((item, index) => (
                        <tr key={item.bank_id} className="hover:bg-gray-50 transition duration-150">
                          <td className="py-3 px-4 text-sm text-gray-600">{item.bank_id}</td>
                          <td className="py-3 px-4 text-sm text-gray-600">{item.label}</td>
                          <td className="py-3 px-4 text-sm text-green-600">LKR {(item.Bamount || 0).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center text-gray-600 text-sm">No bank data available.</p>
              )}
            </div>

            {/* Financial Summary Table */}
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Financial Summary</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-indigo-50">
                    <tr>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Metric</th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50 transition duration-150">
                      <td className="py-3 px-4 text-sm text-gray-600">Total Income (Approved)</td>
                      <td className="py-3 px-4 text-sm text-green-600">LKR {calculateStats(incomeData).approvedAmount.toFixed(2)}</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition duration-150">
                      <td className="py-3 px-4 text-sm text-gray-600">Total Expenses (Approved)</td>
                      <td className="py-3 px-4 text-sm text-green-600">LKR {calculateStats(expenseData).approvedAmount.toFixed(2)}</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition duration-150">
                      <td className="py-3 px-4 text-sm text-gray-600">Total Salaries (Approved)</td>
                      <td className="py-3 px-4 text-sm text-green-600">LKR {calculateStats(salaryData).approvedAmount.toFixed(2)}</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition duration-150">
                      <td className="py-3 px-4 text-sm text-gray-600">Total Transportation (Approved)</td>
                      <td className="py-3 px-4 text-sm text-green-600">LKR {calculateStats(transportData).approvedAmount.toFixed(2)}</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition duration-150">
                      <td className="py-3 px-4 text-sm text-gray-600">Net Income</td>
                      <td className="py-3 px-4 text-sm text-green-600">LKR {calculateNetIncome().toFixed(2)}</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition duration-150">
                      <td className="py-3 px-4 text-sm text-gray-600">Total Bank Balance</td>
                      <td className="py-3 px-4 text-sm text-green-600">LKR {calculateBankTotal().toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scroll::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background-color: #a0aec0;
          border-radius: 4px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: #edf2f7;
        }
      `}</style>
    </div>
  );
};

export default EnhancedStatisticsDashboard;