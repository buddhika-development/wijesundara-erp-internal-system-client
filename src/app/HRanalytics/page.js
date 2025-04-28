"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import dynamic from "next/dynamic";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Dynamically import chart components
const Bar = dynamic(() => import("react-chartjs-2").then(mod => mod.Bar), { ssr: false });
const Line = dynamic(() => import("react-chartjs-2").then(mod => mod.Line), { ssr: false });

// Simple linear regression function
const linearRegression = (x, y) => {
  const n = x.length;
  if (n === 0) return { slope: 0, intercept: 0 };

  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
  const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  return { slope, intercept };
};

// Predict future values
const predictFutureValues = (historicalData, monthsToPredict) => {
  if (historicalData.length < 2) return [];

  const x = historicalData.map((_, i) => i);
  const y = historicalData.map(data => data.value);
  const { slope, intercept } = linearRegression(x, y);

  const predictions = [];
  for (let i = historicalData.length; i < historicalData.length + monthsToPredict; i++) {
    const predictedValue = slope * i + intercept;
    predictions.push(Math.max(0, predictedValue)); // Ensure non-negative predictions
  }
  return predictions;
};

export default function Analytics() {
  const [analyticsData, setAnalyticsData] = useState({
    totalEmployees: 0,
    departmentCounts: [],
    avgSalaryByJobRole: [],
    attendanceStats: { totalDays: 0, avgAttendanceRate: 0 },
    monthlyAttendance: [],
    attendanceByPerson: [],
    jobRoleCosts: [],
  });
  const [historicalAttendance, setHistoricalAttendance] = useState([]);
  const [historicalSalaryCosts, setHistoricalSalaryCosts] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [month, setMonth] = useState((new Date().getMonth() + 1).toString().padStart(2, "0"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("employee");

  useEffect(() => {
    fetchAnalytics();
    fetchHistoricalData();
  }, [year, month]);

  const getMonthRange = (year, month) => {
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    return { firstDay, lastDay };
  };

  const fetchHistoricalData = async () => {
    // Fetch data for the past 6 months
    const historicalMonths = [];
    for (let i = 5; i >= 0; i--) {
      const pastDate = new Date(year, parseInt(month) - 1 - i, 1);
      const pastYear = pastDate.getFullYear();
      const pastMonth = (pastDate.getMonth() + 1).toString().padStart(2, "0");
      historicalMonths.push({ year: pastYear, month: pastMonth });
    }

    // Fetch attendance and salary costs for each month
    const attendancePromises = historicalMonths.map(async ({ year, month }) => {
      const { firstDay, lastDay } = getMonthRange(year, month);
      try {
        const attendanceRes = await axios.get("http://localhost:5000/api/attendance");
        const monthlyRecords = Array.isArray(attendanceRes.data)
          ? attendanceRes.data.filter((record) => {
              const recordDate = new Date(record.date);
              return recordDate >= firstDay && recordDate <= lastDay;
            })
          : [];
        const totalDays = monthlyRecords.length;
        const attendedDays = monthlyRecords.filter((record) => record.attended === true).length;
        const avgAttendanceRate = totalDays > 0 ? (attendedDays / totalDays) * 100 : 0;
        return { year, month, value: avgAttendanceRate };
      } catch (err) {
        console.error(`Error fetching attendance for ${year}-${month}:`, err.message);
        return { year, month, value: 0 };
      }
    });

    const salaryPromises = historicalMonths.map(async ({ year, month }) => {
      try {
        const relationsRes = await axios.get("http://localhost:5000/api/relation");
        const relations = Array.isArray(relationsRes.data) ? relationsRes.data : [];
        const jobRolesRes = await axios.get("http://localhost:5000/api/jobrole");
        const jobRoles = Array.isArray(jobRolesRes.data) ? jobRolesRes.data : [];

        let totalCost = 0;
        for (const jobRole of jobRoles) {
          const employeesInRole = relations.filter((relation) => {
            if (!relation.jobrole_id || !jobRole._id) return false;
            return relation.jobrole_id._id.toString() === jobRole._id.toString();
          });

          for (const relation of employeesInRole) {
            const employeeId = relation.employee_id?._id || relation.employee_id;
            if (!employeeId) continue;

            try {
              const salaryRes = await axios.get(
                `http://localhost:5000/api/salary/${employeeId}/${year}/${month}`
              );
              totalCost += salaryRes.data.totalEmployerCost || 0;
            } catch (err) {
              console.warn(`Could not fetch salary for employee ${employeeId} in ${year}-${month}:`, err.message);
            }
          }
        }
        return { year, month, value: totalCost };
      } catch (err) {
        console.error(`Error fetching salary costs for ${year}-${month}:`, err.message);
        return { year, month, value: 0 };
      }
    });

    try {
      const attendanceData = await Promise.all(attendancePromises);
      const salaryData = await Promise.all(salaryPromises);
      setHistoricalAttendance(attendanceData);
      setHistoricalSalaryCosts(salaryData);
    } catch (err) {
      console.error("Error fetching historical data:", err.message);
    }
  };

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);

    let newAnalyticsData = {
      totalEmployees: 0,
      departmentCounts: [],
      avgSalaryByJobRole: [],
      attendanceStats: { totalDays: 0, avgAttendanceRate: 0 },
      monthlyAttendance: [],
      attendanceByPerson: [],
      jobRoleCosts: [],
    };

    try {
      let employees = [];
      try {
        const employeesRes = await axios.get("http://localhost:5000/api/employee");
        employees = Array.isArray(employeesRes.data) ? employeesRes.data : [];
        console.log("Employees fetched:", employees);
        newAnalyticsData.totalEmployees = employees.length;
      } catch (err) {
        console.error("Error fetching employees:", err.message, err.response?.data);
        setError((prev) => (prev ? prev + " | " : "") + "Failed to fetch employees");
      }

      try {
        const relationsRes = await axios.get("http://localhost:5000/api/relation");
        const relations = Array.isArray(relationsRes.data) ? relationsRes.data : [];
        console.log("Relations fetched:", relations);

        const departmentCounts = relations.reduce((acc, relation) => {
          const deptName = relation.department_id?.department_name || "Unknown";
          acc[deptName] = (acc[deptName] || 0) + 1;
          return acc;
        }, {});
        newAnalyticsData.departmentCounts = Object.entries(departmentCounts).map(([name, count]) => ({
          department: name,
          employeeCount: count,
        }));
      } catch (err) {
        console.error("Error fetching relations:", err.message, err.response?.data);
        setError((prev) => (prev ? prev + " | " : "") + "Failed to fetch department data");
      }

      try {
        const jobRolesRes = await axios.get("http://localhost:5000/api/jobrole");
        const jobRoles = Array.isArray(jobRolesRes.data) ? jobRolesRes.data : [];
        console.log("Job roles fetched:", jobRoles);

        newAnalyticsData.avgSalaryByJobRole = jobRoles.map((jobRole) => ({
          jobRole: jobRole.job_role_name || "Unknown",
          avgSalary: jobRole.job_role_salary || 0,
          monthlyBonus: jobRole.monthly_bonus || 0,
        }));
      } catch (err) {
        console.error("Error fetching job roles:", err.message, err.response?.data);
        setError((prev) => (prev ? prev + " | " : "") + "Failed to fetch job role data");
      }

      const { firstDay, lastDay } = getMonthRange(year, month);
      let monthlyAttendanceRecords = [];
      try {
        const attendanceRes = await axios.get("http://localhost:5000/api/attendance");
        monthlyAttendanceRecords = Array.isArray(attendanceRes.data)
          ? attendanceRes.data.filter((record) => {
              const recordDate = new Date(record.date);
              return recordDate >= firstDay && recordDate <= lastDay;
            })
          : [];
        console.log("Attendance records fetched:", monthlyAttendanceRecords);
        console.log("Sample attended values:", monthlyAttendanceRecords.map(record => record.attended));

        const totalDays = monthlyAttendanceRecords.length;
        const attendedDays = monthlyAttendanceRecords.filter((record) => record.attended === true).length;
        console.log("Total days:", totalDays, "Attended days:", attendedDays);
        newAnalyticsData.attendanceStats = {
          totalDays,
          avgAttendanceRate: totalDays > 0 ? ((attendedDays / totalDays) * 100).toFixed(2) : 0,
        };

        const monthlyAttendance = monthlyAttendanceRecords.reduce((acc, record) => {
          const date = new Date(record.date).toLocaleDateString();
          if (!acc[date]) {
            acc[date] = { attended: 0, total: 0 };
          }
          acc[date].total += 1;
          if (record.attended === true) {
            acc[date].attended += 1;
          }
          return acc;
        }, {});
        newAnalyticsData.monthlyAttendance = Object.entries(monthlyAttendance).map(([date, stats]) => ({
          date,
          attended: stats.attended,
          total: stats.total,
        }));

        newAnalyticsData.attendanceByPerson = employees.map((employee) => {
          const employeeAttendance = monthlyAttendanceRecords.filter((record) => {
            if (!record.employee_id || !employee._id) return false;
            return record.employee_id.toString() === employee._id.toString();
          });
          const totalDaysForEmployee = employeeAttendance.length;
          const attendedDaysForEmployee = employeeAttendance.filter((record) => record.attended === true).length;
          const attendanceRate = totalDaysForEmployee > 0 ? ((attendedDaysForEmployee / totalDaysForEmployee) * 100).toFixed(2) : 0;
          return {
            employeeId: employee.employee_id || "N/A",
            employeeName: employee.employee_name || "Unknown",
            totalDays: totalDaysForEmployee,
            attendedDays: attendedDaysForEmployee,
            attendanceRate,
          };
        }).filter((person) => person.totalDays > 0);
      } catch (err) {
        console.error("Error fetching attendance:", err.message, err.response?.data);
        setError((prev) => (prev ? prev + " | " : "") + "Failed to fetch attendance data");
      }

      try {
        const relationsRes = await axios.get("http://localhost:5000/api/relation");
        const relations = Array.isArray(relationsRes.data) ? relationsRes.data : [];
        const jobRolesRes = await axios.get("http://localhost:5000/api/jobrole");
        const jobRoles = Array.isArray(jobRolesRes.data) ? jobRolesRes.data : [];

        const jobRoleCosts = [];
        for (const jobRole of jobRoles) {
          const employeesInRole = relations.filter((relation) => {
            if (!relation.jobrole_id || !jobRole._id) return false;
            return relation.jobrole_id._id.toString() === jobRole._id.toString();
          });

          let totalCost = 0;
          for (const relation of employeesInRole) {
            const employeeId = relation.employee_id?._id || relation.employee_id;
            if (!employeeId) continue;

            try {
              const salaryRes = await axios.get(
                `http://localhost:5000/api/salary/${employeeId}/${year}/${month}`
              );
              totalCost += salaryRes.data.totalEmployerCost || 0;
            } catch (err) {
              console.warn(`Could not fetch salary for employee ${employeeId}:`, err.message);
            }
          }
          jobRoleCosts.push({
            jobRole: jobRole.job_role_name || "Unknown",
            totalCost: totalCost.toLocaleString(),
          });
        }
        newAnalyticsData.jobRoleCosts = jobRoleCosts;
      } catch (err) {
        console.error("Error calculating job role costs:", err.message, err.response?.data);
        setError((prev) => (prev ? prev + " | " : "") + "Failed to fetch job role costs");
      }

      setAnalyticsData(newAnalyticsData);
    } catch (error) {
      console.error("Error fetching analytics:", error.message, error.stack);
      setError("Failed to load some analytics data. See console for details.");
    } finally {
      setLoading(false);
    }
  };

  // Chart Data and Options
  const departmentChartData = {
    labels: analyticsData.departmentCounts.map(dept => dept.department),
    datasets: [
      {
        label: "Employee Count",
        data: analyticsData.departmentCounts.map(dept => dept.employeeCount),
        backgroundColor: "rgba(59, 130, 246, 0.6)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
      },
    ],
  };

  const avgSalaryChartData = {
    labels: analyticsData.avgSalaryByJobRole.map(job => job.jobRole),
    datasets: [
      {
        label: "Average Salary (with Bonus)",
        data: analyticsData.avgSalaryByJobRole.map(job => job.avgSalary + job.monthlyBonus),
        backgroundColor: "rgba(34, 197, 94, 0.6)",
        borderColor: "rgba(34, 197, 94, 1)",
        borderWidth: 1,
      },
    ],
  };

  const jobRoleCostChartData = {
    labels: analyticsData.jobRoleCosts.map(job => job.jobRole),
    datasets: [
      {
        label: `Total Cost (${month}/${year})`,
        data: analyticsData.jobRoleCosts.map(job => parseFloat(job.totalCost.replace(/,/g, ''))),
        backgroundColor: "rgba(249, 115, 22, 0.6)",
        borderColor: "rgba(249, 115, 22, 1)",
        borderWidth: 1,
      },
    ],
  };

  const monthlyAttendanceChartData = {
    labels: analyticsData.monthlyAttendance.map(day => day.date),
    datasets: [
      {
        label: "Employees Attended",
        data: analyticsData.monthlyAttendance.map(day => day.attended),
        fill: false,
        borderColor: "rgba(59, 130, 246, 1)",
        tension: 0.1,
      },
      {
        label: "Total Employees Recorded",
        data: analyticsData.monthlyAttendance.map(day => day.total),
        fill: false,
        borderColor: "rgba(34, 197, 94, 1)",
        tension: 0.1,
      },
    ],
  };

  const attendanceByPersonChartData = {
    labels: analyticsData.attendanceByPerson.map(person => person.employeeName),
    datasets: [
      {
        label: "Attendance Rate (%)",
        data: analyticsData.attendanceByPerson.map(person => person.attendanceRate),
        backgroundColor: "rgba(236, 72, 153, 0.6)",
        borderColor: "rgba(236, 72, 153, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Attendance Rate Prediction Chart
  const monthsToPredict = 3;
  const attendancePredictionLabels = [
    ...historicalAttendance.map(data => `${data.month}/${data.year}`),
    ...Array.from({ length: monthsToPredict }, (_, i) => {
      const futureDate = new Date(parseInt(year), parseInt(month) - 1 + i + 1, 1);
      return `${(futureDate.getMonth() + 1).toString().padStart(2, "0")}/${futureDate.getFullYear()}`;
    }),
  ];
  const attendancePredictionData = historicalAttendance.map(data => data.value);
  const predictedAttendance = predictFutureValues(historicalAttendance, monthsToPredict);
  const attendancePredictionChartData = {
    labels: attendancePredictionLabels,
    datasets: [
      {
        label: "Historical Attendance Rate (%)",
        data: [...attendancePredictionData, ...Array(monthsToPredict).fill(null)],
        fill: false,
        borderColor: "rgba(59, 130, 246, 1)",
        tension: 0.1,
      },
      {
        label: "Predicted Attendance Rate (%)",
        data: [...Array(historicalAttendance.length).fill(null), ...predictedAttendance],
        fill: false,
        borderColor: "rgba(255, 99, 132, 1)",
        borderDash: [5, 5],
        tension: 0.1,
      },
    ],
  };

  // Salary Cost Prediction Chart
  const salaryPredictionLabels = [
    ...historicalSalaryCosts.map(data => `${data.month}/${data.year}`),
    ...Array.from({ length: monthsToPredict }, (_, i) => {
      const futureDate = new Date(parseInt(year), parseInt(month) - 1 + i + 1, 1);
      return `${(futureDate.getMonth() + 1).toString().padStart(2, "0")}/${futureDate.getFullYear()}`;
    }),
  ];
  const salaryPredictionData = historicalSalaryCosts.map(data => data.value);
  const predictedSalaryCosts = predictFutureValues(historicalSalaryCosts, monthsToPredict);
  const salaryPredictionChartData = {
    labels: salaryPredictionLabels,
    datasets: [
      {
        label: "Historical Total Cost",
        data: [...salaryPredictionData, ...Array(monthsToPredict).fill(null)],
        fill: false,
        borderColor: "rgba(249, 115, 22, 1)",
        tension: 0.1,
      },
      {
        label: "Predicted Total Cost",
        data: [...Array(historicalSalaryCosts.length).fill(null), ...predictedSalaryCosts],
        fill: false,
        borderColor: "rgba(255, 99, 132, 1)",
        borderDash: [5, 5],
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.parsed.y.toFixed(2)}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Analytics Dashboard</h1>

        {/* Year and Month Selector */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
          <div className="flex gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="year">
                Year
              </label>
              <input
                type="number"
                id="year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                min="2000"
                max={new Date().getFullYear()}
                className="input-field w-24"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="month">
                Month
              </label>
              <select
                id="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="input-field w-32"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={(i + 1).toString().padStart(2, "0")}>
                    {new Date(0, i).toLocaleString("default", { month: "long" })}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="mb-8">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("employee")}
              className={`px-6 py-3 text-sm font-medium transition-colors duration-200 ${
                activeTab === "employee"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              Employee Stats
            </button>
            <button
              onClick={() => setActiveTab("department")}
              className={`px-6 py-3 text-sm font-medium transition-colors duration-200 ${
                activeTab === "department"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              Department Stats
            </button>
            <button
              onClick={() => setActiveTab("salary")}
              className={`px-6 py-3 text-sm font-medium transition-colors duration-200 ${
                activeTab === "salary"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              Salary Stats
            </button>
            <button
              onClick={() => setActiveTab("attendance")}
              className={`px-6 py-3 text-sm font-medium transition-colors duration-200 ${
                activeTab === "attendance"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              Attendance Stats
            </button>
            <button
              onClick={() => setActiveTab("predictions")}
              className={`px-6 py-3 text-sm font-medium transition-colors duration-200 ${
                activeTab === "predictions"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              Predictions
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          {activeTab === "employee" && (
            <>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Employee Statistics</h2>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-50 text-gray-700">
                          <th className="p-3 text-left font-medium">Metric</th>
                          <th className="p-3 text-left font-medium">Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-t border-gray-100 hover:bg-gray-50">
                          <td className="p-3 text-gray-700 font-medium">Total Employees</td>
                          <td className="p-3 text-gray-700">{analyticsData.totalEmployees}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-center">
                    <h3 className="text-lg font-medium text-gray-700 mb-2">Total Employees</h3>
                    <div className="text-4xl font-bold text-blue-600">{analyticsData.totalEmployees}</div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "department" && (
            <>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Department Statistics</h2>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-50 text-gray-700">
                          <th className="p-3 text-left font-medium">Department</th>
                          <th className="p-3 text-left font-medium">Employee Count</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analyticsData.departmentCounts.map((dept, index) => (
                          <tr key={index} className="border-t border-gray-100 hover:bg-gray-50">
                            <td className="p-3 text-gray-700">{dept.department}</td>
                            <td className="p-3 text-gray-700">{dept.employeeCount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {analyticsData.departmentCounts.length === 0 && !loading && (
                    <p className="mt-4 text-gray-500">No department data available.</p>
                  )}
                </div>
                <div className="flex-1 h-80">
                  <Bar data={departmentChartData} options={chartOptions} />
                </div>
              </div>
            </>
          )}

          {activeTab === "salary" && (
            <>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Salary Statistics</h2>
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-700 mb-2">Average Salary by Job Role</h3>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-gray-50 text-gray-700">
                            <th className="p-3 text-left font-medium">Job Role</th>
                            <th className="p-3 text-left font-medium">Average Salary (with Bonus)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {analyticsData.avgSalaryByJobRole.map((job, index) => (
                            <tr key={index} className="border-t border-gray-100 hover:bg-gray-50">
                              <td className="p-3 text-gray-700">{job.jobRole}</td>
                              <td className="p-3 text-gray-700">
                                {(job.avgSalary + job.monthlyBonus).toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {analyticsData.avgSalaryByJobRole.length === 0 && !loading && (
                      <p className="mt-4 text-gray-500">No salary data available.</p>
                    )}
                  </div>
                  <div className="flex-1 h-80">
                    <Bar data={avgSalaryChartData} options={chartOptions} />
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  Total Cost by Job Role (for {month}/{year})
                </h3>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-gray-50 text-gray-700">
                            <th className="p-3 text-left font-medium">Job一緒Role</th>
                            <th className="p-3 text-left font-medium">Total Cost</th>
                          </tr>
                        </thead>
                        <tbody>
                          {analyticsData.jobRoleCosts.map((job, index) => (
                            <tr key={index} className="border-t border-gray-100 hover:bg-gray-50">
                              <td className="p-3 text-gray-700">{job.jobRole}</td>
                              <td className="p-3 text-gray-700">{job.totalCost}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {analyticsData.jobRoleCosts.length === 0 && !loading && (
                      <p className="mt-4 text-gray-500">No job role cost data available.</p>
                    )}
                  </div>
                  <div className="flex-1 h-80">
                    <Bar data={jobRoleCostChartData} options={chartOptions} />
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "attendance" && (
            <>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Attendance Statistics</h2>
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-700 mb-2">Overall Attendance</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50 text-gray-700">
                        <th className="p-3 text-left font-medium">Metric</th>
                        <th className="p-3 text-left font-medium">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-gray-100 hover:bg-gray-50">
                        <td className="p-3 text-gray-700 font-medium">Total Attendance Days</td>
                        <td className="p-3 text-gray-700">{analyticsData.attendanceStats.totalDays}</td>
                      </tr>
                      <tr className="border-t border-gray-100 hover:bg-gray-50">
                        <td className="p-3 text-gray-700 font-medium">Average Attendance Rate</td>
                        <td className="p-3 text-gray-700">{analyticsData.attendanceStats.avgAttendanceRate}%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-700 mb-2">Monthly Attendance (by Day)</h3>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-gray-50 text-gray-700">
                            <th className="p-3 text-left font-medium">Date</th>
                            <th className="p-3 text-left font-medium">Employees Attended</th>
                            <th className="p-3 text-left font-medium">Total Employees Recorded</th>
                          </tr>
                        </thead>
                        <tbody>
                          {analyticsData.monthlyAttendance.map((day, index) => (
                            <tr key={index} className="border-t border-gray-100 hover:bg-gray-50">
                              <td className="p-3 text-gray-700">{day.date}</td>
                              <td className="p-3 text-gray-700">{day.attended}</td>
                              <td className="p-3 text-gray-700">{day.total}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {analyticsData.monthlyAttendance.length === 0 && !loading && (
                      <p className="mt-4 text-gray-500">No monthly attendance data available.</p>
                    )}
                  </div>
                  <div className="flex-1 h-80">
                    <Line data={monthlyAttendanceChartData} options={chartOptions} />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">Attendance by Person</h3>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-gray-50 text-gray-700">
                            <th className="p-3 text-left font-medium">Employee ID</th>
                            <th className="p-3 text-left font-medium">Name</th>
                            <th className="p-3 text-left font-medium">Total Days</th>
                            <th className="p-3 text-left font-medium">Days Attended</th>
                            <th className="p-3 text-left font-medium">Attendance Rate</th>
                          </tr>
                        </thead>
                        <tbody>
                          {analyticsData.attendanceByPerson.map((person, index) => (
                            <tr key={index} className="border-t border-gray-100 hover:bg-gray-50">
                              <td className="p-3 text-gray-700">{person.employeeId}</td>
                              <td className="p-3 text-gray-700">{person.employeeName}</td>
                              <td className="p-3 text-gray-700">{person.totalDays}</td>
                              <td className="p-3 text-gray-700">{person.attendedDays}</td>
                              <td className="p-3 text-gray-700">{person.attendanceRate}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {analyticsData.attendanceByPerson.length === 0 && !loading && (
                      <p className="mt-4 text-gray-500">No individual attendance data available.</p>
                    )}
                  </div>
                  <div className="flex-1 h-80">
                    <Bar data={attendanceByPersonChartData} options={chartOptions} />
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "predictions" && (
            <>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Future Predictions</h2>
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  Attendance Rate Prediction (Next {monthsToPredict} Months)
                </h3>
                <div className="h-80">
                  {historicalAttendance.length > 0 ? (
                    <Line data={attendancePredictionChartData} options={chartOptions} />
                  ) : (
                    <p className="text-gray-500">Not enough historical data for attendance prediction.</p>
                  )}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  Salary Cost Prediction (Next {monthsToPredict} Months)
                </h3>
                <div className="h-80">
                  {historicalSalaryCosts.length > 0 ? (
                    <Line data={salaryPredictionChartData} options={chartOptions} />
                  ) : (
                    <p className="text-gray-500">Not enough historical data for salary cost prediction.</p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {loading && <p className="mt-4 text-gray-500">Loading analytics data...</p>}
        {error && <p className="mt-4 text-red-500">{error}</p>}
      </div>

      {/* Styling */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap');
        .min-h-screen {
          font-family: 'Poppins', sans-serif;
        }
        .input-field {
          display: block;
          width: 100%;
          background-color: #f9fafb;
          color: #1f2937;
          border: 1px solid #d1d5db;
          padding: 10px;
          border-radius: 8px;
          font-size: 14px;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .input-field:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
        }
        .shadow-md {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }
        .hover\:shadow-lg:hover {
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.12);
        }
        .h-80 {
          height: 320px;
        }
      `}</style>
    </div>
  );
}