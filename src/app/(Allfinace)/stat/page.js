"use client";

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Chart from "chart.js/auto";
import Head from "next/head";

const StatisticsDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [incomeData, setIncomeData] = useState([]);
  const [expenseData, setExpenseData] = useState([]);
  const [salaryData, setSalaryData] = useState([]);
  const [transportData, setTransportData] = useState([]);
  const [bankData, setBankData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("All Months");

  // Refs to store Chart.js instances
  const chartRefs = useRef({
    totalAmountChart: null,
    statusChart: null,
    monthlyChart: null,
    bankChart: null,
    netAmountChart: null,
    futureTrendChart: null, // Added for Future Economic Growth Trend chart
  });

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
      const pendingResponse = await axios.post("http://localhost:5000/all", { sec_id });
      const pendingData = Array.isArray(pendingResponse.data.requests) ? pendingResponse.data.requests : [];

      const approvedResponse = await axios.get("http://localhost:5000/requests1");
      const approvedData = Array.isArray(approvedResponse.data.requests)
        ? approvedResponse.data.requests.filter(item => item.sec_id === sec_id)
        : [];

      const approvedReq2Response = await axios.post("http://localhost:5000/requests2", { sec_id, status: "approve" });
      const approvedReq2Data = Array.isArray(approvedReq2Response.data.requests) ? approvedReq2Response.data.requests : [];

      const declinedReq2Response = await axios.post("http://localhost:5000/requests2", { sec_id, status: "decline" });
      const declinedReq2Data = Array.isArray(declinedReq2Response.data.requests) ? declinedReq2Response.data.requests : [];

      const allData = [
        ...pendingData,
        ...approvedData,
        ...approvedReq2Data,
        ...declinedReq2Data,
      ].reduce((acc, item) => {
        acc[item._id] = item;
        return acc;
      }, {});

      const formattedData = Object.values(allData);
      console.log(`Data for sec_id ${sec_id}:`, formattedData);
      setData(formattedData);
    } catch (error) {
      console.error(`Error fetching data for sec_id ${sec_id}:`, error);
      setError(error.message);
      setData([]);
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
      unprocessedCount: 0,
      unprocessedAmount: 0,
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
      } else {
        stats.unprocessedCount += 1;
        stats.unprocessedAmount += amount;
      }
    });

    return stats;
  };

  // Calculate overall bank balance
  const calculateBankTotal = () => {
    return bankData.reduce((total, row) => total + (parseFloat(row.Bamount) || 0), 0);
  };

  // Calculate net income for all data
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
  ];

  // Get unique months for dropdown
  const getUniqueMonths = () => {
    console.log("All transactions:", allTransactions);
    const months = allTransactions
      .filter(item => {
        const hasDate = !!item.date;
        const isValid = hasDate && !isNaN(new Date(item.date).getTime());
        if (!hasDate || !isValid) {
          console.warn(`Invalid or missing date for transaction:`, item);
        }
        return hasDate && isValid;
      })
      .map(item => {
        const date = new Date(item.date);
        return date.toLocaleString("default", { month: "short", year: "numeric" });
      });
    const uniqueMonths = ["All Months", ...[...new Set(months)].sort((a, b) => new Date(a) - new Date(b))];
    console.log("Unique months:", uniqueMonths);
    if (uniqueMonths.length === 1) {
      console.warn("No valid dates found in transactions; only 'All Months' available");
    }
    return uniqueMonths;
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

  // Helper for linear regression to forecast future trends
  const linearRegression = (x, y) => {
    const n = x.length;
    const xSum = x.reduce((a, b) => a + b, 0);
    const ySum = y.reduce((a, b) => a + b, 0);
    const xySum = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const xSquareSum = x.reduce((sum, xi) => sum + xi * xi, 0);

    const slope = (n * xySum - xSum * ySum) / (n * xSquareSum - xSum * xSum);
    const intercept = (ySum - slope * xSum) / n;

    return { slope, intercept };
  };

  // Forecast future values
  const forecastValues = (historicalMonths, historicalValues, numFutureMonths) => {
    const x = historicalMonths.map((_, i) => i); // Numerical indices for months (0, 1, 2, ...)
    const y = historicalValues; // Net amounts

    const { slope, intercept } = linearRegression(x, y);

    const forecastedValues = [];
    for (let i = x.length; i < x.length + numFutureMonths; i++) {
      const forecastedValue = slope * i + intercept;
      forecastedValues.push(forecastedValue);
    }

    return forecastedValues;
  };

  // Render charts
  useEffect(() => {
    if (!loading && !error) {
      const allData = [
        { data: filterDataByMonth(incomeData), label: "Income" },
        { data: filterDataByMonth(expenseData), label: "Expense" },
        { data: filterDataByMonth(salaryData), label: "Salary" },
        { data: filterDataByMonth(transportData), label: "Transportation" },
      ];
      console.log("Filtered chart data:", allData.map(d => ({ label: d.label, count: d.data.length })));

      // Helper to destroy existing chart
      const destroyChart = (chartKey) => {
        if (chartRefs.current[chartKey]) {
          chartRefs.current[chartKey].destroy();
          chartRefs.current[chartKey] = null;
          console.log(`Destroyed chart: ${chartKey}`);
        }
      };

      // Bar Chart: Total Approved Amounts by Category
      const barCtx = document.getElementById("totalAmountChart")?.getContext("2d");
      if (barCtx) {
        try {
          destroyChart("totalAmountChart");
          const totals = allData.map(({ data }) => calculateStats(data).approvedAmount);
          chartRefs.current.totalAmountChart = new Chart(barCtx, {
            type: "bar",
            data: {
              labels: allData.map(({ label }) => label),
              datasets: [{
                label: "Total Approved (LKR)",
                data: totals,
                backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56", "#4BC0C0"],
                borderColor: ["#2A8BBF", "#D4566D", "#D4A744", "#3A9A9A"],
                borderWidth: 1,
              }],
            },
            options: {
              scales: {
                y: { beginAtZero: true, title: { display: true, text: "Amount (LKR)" }, ticks: { font: { size: 12 } } },
                x: { ticks: { font: { size: 12 } } },
              },
              plugins: { legend: { display: false }, title: { display: false } },
              maintainAspectRatio: false,
            },
          });
        } catch (e) {
          console.error("Error initializing bar chart:", e);
        }
      }

      // Pie Chart: Transaction Status Distribution
      const pieCtx = document.getElementById("statusChart")?.getContext("2d");
      if (pieCtx) {
        try {
          destroyChart("statusChart");
          const allStatusCounts = allData.reduce((acc, { data }) => {
            const stats = calculateStats(data);
            acc.pending += stats.pendingCount;
            acc.approve += stats.approvedCount;
            acc.decline += stats.rejectedCount;
            return acc;
          }, { pending: 0, approve: 0, decline: 0 });
          chartRefs.current.statusChart = new Chart(pieCtx, {
            type: "pie",
            data: {
              labels: ["Pending", "Approved", "Declined"],
              datasets: [{
                data: [allStatusCounts.pending, allStatusCounts.approve, allStatusCounts.decline],
                backgroundColor: ["#FFCE56", "#36A2EB", "#FF6384"],
              }],
            },
            options: {
              plugins: { legend: { position: "bottom", labels: { font: { size: 12 } } } },
              maintainAspectRatio: false,
            },
          });
        } catch (e) {
          console.error("Error initializing pie chart:", e);
        }
      }

      // Line Chart: Monthly Transaction Trends
      const monthlyData = allData
        .filter(({ data }) => data.length > 0)
        .map(({ data, label }) => {
          const monthly = {};
          data.forEach(item => {
            const date = item.date && !isNaN(new Date(item.date).getTime()) ? new Date(item.date) : null;
            if (date) {
              const month = date.toLocaleString("default", { month: "short", year: "numeric" });
              if (selectedMonth === "All Months" || month === selectedMonth) {
                monthly[month] = monthly[month] || { amount: 0, count: 0 };
                monthly[month].amount += parseFloat(item.amount) || 0;
                monthly[month].count++;
              }
            }
          });
          return { label, monthly };
        });
      const allMonths = selectedMonth === "All Months"
        ? [...new Set(monthlyData.flatMap(({ monthly }) => Object.keys(monthly)))].sort((a, b) => new Date(a) - new Date(b))
        : [selectedMonth].filter(Boolean);
      console.log("Line chart months:", allMonths);
      const lineCtx = document.getElementById("monthlyChart")?.getContext("2d");
      if (lineCtx && allMonths.length > 0) {
        try {
          destroyChart("monthlyChart");
          chartRefs.current.monthlyChart = new Chart(lineCtx, {
            type :"line",
            data: {
              labels: allMonths,
              datasets: monthlyData.map(({ label, monthly }) => ({
                label,
                data: allMonths.map((month) => monthly[month]?.amount || 0),
                fill: false,
                borderColor: ["#36A2EB", "#FF6384", "#FFCE56", "#4BC0C0"][allData.findIndex(d => d.label === label)],
                tension: 0.1,
              })),
            },
            options: {
              scales: {
                y: { beginAtZero: true, title: { display: true, text: "Amount (LKR)" }, ticks: { font: { size: 12 } } },
                x: { title: { display: true, text: "Month" }, ticks: { font: { size: 12 } } },
              },
              plugins: { legend: { labels: { font: { size: 12 } } } },
              maintainAspectRatio: false,
            },
        });
        } catch (e) {
          console.error("Error initializing line chart:", e);
        }
      }

      // Line Chart: Net Amount Over Time
      const netAmountData = () => {
        const monthlyNet = {};
        allTransactions.forEach(item => {
          const date = item.date && !isNaN(new Date(item.date).getTime()) ? new Date(item.date) : null;
          if (date) {
            const month = date.toLocaleString("default", { month: "short", year: "numeric" });
            if (selectedMonth === "All Months" || month === selectedMonth) {
              monthlyNet[month] = monthlyNet[month] || { income: 0, expenses: 0 };
              const amount = parseFloat(item.amount) || 0;
              const status = normalizeStatus(item.status);
              if (status === "approve") {
                if (item.category === "Income") {
                  monthlyNet[month].income += amount;
                } else if (["Expense", "Salary", "Transportation"].includes(item.category)) {
                  monthlyNet[month].expenses += amount;
                }
              }
            }
          }
        });
        return { monthlyNet };
      };
      const { monthlyNet } = netAmountData();
      const netAmountMonths = selectedMonth === "All Months"
        ? [...new Set(Object.keys(monthlyNet))].sort((a, b) => new Date(a) - new Date(b))
        : [selectedMonth].filter(Boolean);
      console.log("Net Amount chart months:", netAmountMonths);
      console.log("Net Amount data:", monthlyNet);
      const netAmountCtx = document.getElementById("netAmountChart")?.getContext("2d");
      if (netAmountCtx && netAmountMonths.length > 0) {
        try {
          destroyChart("netAmountChart");
          chartRefs.current.netAmountChart = new Chart(netAmountCtx, {
            type: "line",
            data: {
              labels: netAmountMonths,
              datasets: [{
                label: "Net Amount (LKR)",
                data: netAmountMonths.map(month => monthlyNet[month].income - monthlyNet[month].expenses),
                fill: false,
                borderColor: "#10B981",
                tension: 0.1,
              }],
            },
            options: {
              scales: {
                y: { 
                  title: { display: true, text: "Net Amount (LKR)" }, 
                  ticks: { font: { size: 12 } },
                  beginAtZero: false,
                },
                x: { 
                  title: { display: true, text: "Month" }, 
                  ticks: { font: { size: 12 } } 
                },
              },
              plugins: { 
                legend: { labels: { font: { size: 12 } } },
                tooltip: {
                  callbacks: {
                    label: (context) => {
                      const value = context.parsed.y;
                      return `Net Amount: LKR ${value.toFixed(2)}`;
                    },
                  },
                },
              },
              maintainAspectRatio: false,
            },
          });
        } catch (e) {
          console.error("Error initializing net amount chart:", e);
        }
      }

      // Line Chart: Future Economic Growth Trend
      if (netAmountMonths.length > 0) {
        const historicalNetValues = netAmountMonths.map(month => monthlyNet[month].income - monthlyNet[month].expenses);
        
        // Generate future months (next 6 months)
        const lastMonth = new Date(netAmountMonths[netAmountMonths.length - 1]);
        const futureMonths = [];
        for (let i = 1; i <= 6; i++) {
          const futureDate = new Date(lastMonth);
          futureDate.setMonth(lastMonth.getMonth() + i);
          futureMonths.push(futureDate.toLocaleString("default", { month: "short", year: "numeric" }));
        }

        // Forecast future net amounts using linear regression
        const forecastedValues = forecastValues(netAmountMonths, historicalNetValues, 6);
        const allMonthsForTrend = [...netAmountMonths, ...futureMonths];
        const allValuesForTrend = [...historicalNetValues, ...forecastedValues];

        const futureTrendCtx = document.getElementById("futureTrendChart")?.getContext("2d");
        if (futureTrendCtx) {
          try {
            destroyChart("futureTrendChart");
            chartRefs.current.futureTrendChart = new Chart(futureTrendCtx, {
              type: "line",
              data: {
                labels: allMonthsForTrend,
                datasets: [
                  {
                    label: "Historical Net Amount",
                    data: allValuesForTrend.map((value, index) => index < netAmountMonths.length ? value : null),
                    fill: false,
                    borderColor: "#10B981",
                    backgroundColor: "#10B981",
                    tension: 0.1,
                    pointRadius: 4,
                  },
                  {
                    label: "Forecasted Trend",
                    data: allValuesForTrend.map((value, index) => index >= netAmountMonths.length - 1 ? value : null),
                    fill: false,
                    borderColor: "#F97316",
                    backgroundColor: "#F97316",
                    borderDash: [5, 5],
                    tension: 0.1,
                    pointRadius: 4,
                  },
                ],
              },
              options: {
                scales: {
                  y: { 
                    title: { display: true, text: "Net Amount (LKR)" }, 
                    ticks: { font: { size: 12 } },
                    beginAtZero: false,
                  },
                  x: { 
                    title: { display: true, text: "Month" }, 
                    ticks: { font: { size: 12 } } 
                  },
                },
                plugins: { 
                  legend: { labels: { font: { size: 12 } } },
                  tooltip: {
                    callbacks: {
                      label: (context) => {
                        const value = context.parsed.y;
                        return `${context.dataset.label}: LKR ${value.toFixed(2)}`;
                      },
                    },
                  },
                },
                maintainAspectRatio: false,
              },
            });
          } catch (e) {
            console.error("Error initializing future trend chart:", e);
          }
        }
      }

      // Bar Chart: Bank Account Balances
      const bankCtx = document.getElementById("bankChart")?.getContext("2d");
      if (bankCtx && bankData.length > 0) {
        try {
          destroyChart("bankChart");
          chartRefs.current.bankChart = new Chart(bankCtx, {
            type: "bar",
            data: {
              labels: bankData.map(({ label }) => label),
              datasets: [{
                label: "Balance (LKR)",
                data: bankData.map(({ Bamount }) => Bamount),
                backgroundColor: ["#4BC0C0", "#36A2EB", "#FFCE56"],
                borderColor: ["#3A9A9A", "#2A8BBF", "#D4A744"],
                borderWidth: 1,
              }],
            },
            options: {
              scales: {
                y: { beginAtZero: true, title: { display: true, text: "Balance (LKR)" }, ticks: { font: { size: 12 } } },
                x: { ticks: { font: { size: 12 } } },
              },
              plugins: { legend: { display: false } },
              maintainAspectRatio: false,
            },
          });
        } catch (e) {
          console.error("Error initializing bank chart:", e);
        }
      }

      // Cleanup on unmount
      return () => {
        console.log("Cleaning up charts on unmount");
        Object.keys(chartRefs.current).forEach(destroyChart);
      };
    }
  }, [loading, error, incomeData, expenseData, salaryData, transportData, bankData, selectedMonth]);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <Head>
        <title>Financial Statistics</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Financial Statistics</h1>
        {loading && <p className="text-center text-gray-600">Loading data...</p>}
        {error && <p className="text-center text-red-500">Error: {error}</p>}

        {/* Transaction Data Table */}
        {!loading && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3 text-gray-700">Transaction Data</h2>
            {allTransactions.length > 0 ? (
              <div className="overflow-x-auto max-h-96 overflow-y-auto custom-scroll">
                <table className="min-w-full bg-white border border-gray-300 text-gray-800">
                  <thead className="sticky top-0 bg-gray-200">
                    <tr>
                      <th className="py-2 px-3 border-b text-left text-sm">Category</th>
                      <th className="py-2 px-3 border-b text-left text-sm">Sec ID</th>
                      <th className="py-2 px-3 border-b text-left text-sm">Amount</th>
                      <th className="py-2 px-3 border-b text-left text-sm">Status</th>
                      <th className="py-2 px-3 border-b text-left text-sm">Date</th>
                      <th className="py-2 px-3 border-b text-left text-sm">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filterDataByMonth(allTransactions).map((item, index) => (
                      <tr key={item._id || index} className="hover:bg-gray-100">
                        <td className="py-2 px-3 border-b text-sm">{item.category}</td>
                        <td className="py-2 px-3 border-b text-sm">{item.sec_id}</td>
                        <td className="py-2 px-3 border-b text-green-500 text-sm">LKR {(parseFloat(item.amount) || 0).toFixed(2)}</td>
                        <td className="py-2 px-3 border-b text-sm">{normalizeStatus(item.status) || "N/A"}</td>
                        <td className="py-2 px-3 border-b text-sm">{item.date || "N/A"}</td>
                        <td className="py-2 px-3 border-b text-sm">{item.description || "N/A"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-gray-600 text-sm">No transaction data available.</p>
            )}
          </div>
        )}

        {/* Bank Data Table */}
        {!loading && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3 text-gray-700">Bank Data</h2>
            {bankData.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300 text-gray-800">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="py-2 px-3 border-b text-left text-sm">Bank ID</th>
                      <th className="py-2 px-3 border-b text-left text-sm">Label</th>
                      <th className="py-2 px-3 border-b text-left text-sm">Balance (LKR)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bankData.map((item, index) => (
                      <tr key={item.bank_id} className="hover:bg-gray-100">
                        <td className="py-2 px-3 border-b text-sm">{item.bank_id}</td>
                        <td className="py-2 px-3 border-b text-sm">{item.label}</td>
                        <td className="py-2 px-3 border-b text-green-500 text-sm">LKR {(item.Bamount || 0).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-gray-600 text-sm">No bank data available.</p>
            )}
          </div>
        )}

        {/* Financial Summary Table */}
        {!loading && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3 text-gray-700">Financial Summary</h2>
            <div className="bg-white rounded-lg p-4 shadow-md">
              <div className="overflow-x-auto">
                <table className="min-w-full text-gray-800">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="p-2 border-b text-left text-sm">Metric</th>
                      <th className="p-2 border-b text-left text-sm">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-gray-100">
                      <td className="p-2 border-b text-sm">Total Income (Approved)</td>
                      <td className="p-2 border-b text-green-500 text-sm">LKR {calculateStats(incomeData).approvedAmount.toFixed(2)}</td>
                    </tr>
                    <tr className="hover:bg-gray-100">
                      <td className="p-2 border-b text-sm">Total Expenses (Approved)</td>
                      <td className="p-2 border-b text-green-500 text-sm">LKR {calculateStats(expenseData).approvedAmount.toFixed(2)}</td>
                    </tr>
                    <tr className="hover:bg-gray-100">
                      <td className="p-2 border-b text-sm">Total Salaries (Approved)</td>
                      <td className="p-2 border-b text-green-500 text-sm">LKR {calculateStats(salaryData).approvedAmount.toFixed(2)}</td>
                    </tr>
                    <tr className="hover:bg-gray-100">
                      <td className="p-2 border-b text-sm">Total Transportation (Approved)</td>
                      <td className="p-2 border-b text-green-500 text-sm">LKR {calculateStats(transportData).approvedAmount.toFixed(2)}</td>
                    </tr>
                    <tr className="hover:bg-gray-100">
                      <td className="p-2 border-b text-sm">Net Income</td>
                      <td className="p-2 border-b text-green-500 text-sm">LKR {calculateNetIncome().toFixed(2)}</td>
                    </tr>
                    <tr className="hover:bg-gray-100">
                      <td className="p-2 border-b text-sm">Total Bank Balance</td>
                      <td className="p-2 border-b text-green-500 text-sm">LKR {calculateBankTotal().toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Month Selection and Charts Grid */}
        {!loading && (
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <label htmlFor="monthSelect" className="mr-2 text-gray-700 text-sm">Select Month:</label>
              <select
                id="monthSelect"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="p-2 border border-gray-300 rounded-md text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {getUniqueMonths().map((month) => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
              {getUniqueMonths().length === 1 && (
                <p className="ml-2 text-sm text-yellow-600">No valid transaction dates found</p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h2 className="text-lg font-semibold mb-3 text-gray-800">Total Approved Amounts by Category</h2>
                <div className="h-64">
                  <canvas id="totalAmountChart" width="100%" height="100%"></canvas>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h2 className="text-lg font-semibold mb-3 text-gray-800">Transaction Status Distribution</h2>
                <div className="h-64">
                  <canvas id="statusChart" width="100%" height="100%"></canvas>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow md:col-span-2">
                <h2 className="text-lg font-semibold mb-3 text-gray-800">Monthly Transaction Trends</h2>
                <div className="h-80">
                  <canvas id="monthlyChart" width="100%" height="100%"></canvas>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h2 className="text-lg font-semibold mb-3 text-gray-800">Bank Account Balances</h2>
                <div className="h-64">
                  <canvas id="bankChart" width="100%" height="100%"></canvas>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h2 className="text-lg font-semibold mb-3 text-gray-800">Net Amount Over Time</h2>
                <div className="h-64">
                  <canvas id="netAmountChart" width="100%" height="100%"></canvas>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow md:col-span-2">
                <h2 className="text-lg font-semibold mb-3 text-gray-800">Future Economic Growth Trend</h2>
                <div className="h-80">
                  <canvas id="futureTrendChart" width="100%" height="100%"></canvas>
                </div>
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
          background-color: #cbd5e0;
          border-radius: 4px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
      `}</style>
    </div>
  );
};

export default StatisticsDashboard;