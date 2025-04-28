"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export default function GetPayslip() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [month, setMonth] = useState((new Date().getMonth() + 1).toString().padStart(2, "0"));
  const [payslipData, setPayslipData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch employees on mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://localhost:5000/api/employee");
      console.log("Employees fetched:", response.data);
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
      setError("Failed to load employees. Please check if the backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  
  const fetchPayslip = async () => {
    if (!selectedEmployee) return;
    setLoading(true);
    setError(null);
    setPayslipData(null);

    try {
      const response = await axios.get(
        `http://localhost:5000/api/salary/${selectedEmployee}/${year}/${month}`
      );
      console.log("Payslip data received:", response.data);
      setPayslipData(response.data);
    } catch (error) {
      console.error("Error fetching payslip:", error.response?.data || error.message);
      setError(error.response?.data?.message || "Failed to fetch payslip details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Load image for PDF
  const loadImage = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        resolve({ data: canvas.toDataURL("image/png"), width: img.width, height: img.height });
      };
      img.onerror = reject;
      img.src = url;
    });
  };

  const generatePDF = async () => {
    if (!payslipData || !selectedEmployee) return;

    const employee = employees.find((emp) => emp._id === selectedEmployee);
    const doc = new jsPDF();

    let startY = 10;
    let logoHeight = 0;
    try {
      const logoUrl = "/companylogo.png";
      const { data, width, height } = await loadImage(logoUrl);
      const maxHeight = 30; 
      const aspectRatio = width / height;
      logoHeight = maxHeight; 
      const logoWidth = logoHeight * aspectRatio; 
      doc.addImage(data, "PNG", 10, startY, logoWidth, logoHeight); 
    } catch (error) {
      console.error("Error loading logo:", error);
      logoHeight = 30; 
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Wijesundara rice mills (PVT) LTD", 200, startY + 5, { align: "right" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Phone: +94 77 098 7867 / +94 11 275 2373", 200, startY + 10, { align: "right" });
    doc.text("494/1, Naduhena, Colombo, Sri Lanka", 200, startY + 15, { align: "right" });
    doc.text("Email: wijesundaraRiceMills@outlook.com", 200, startY + 20, { align: "right" });
    startY += logoHeight + 5;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("PAYSLIP", doc.internal.pageSize.getWidth() / 2, startY, { align: "center" });
    startY += 15;

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Employee Details:", 10, startY);
    startY += 5;
    doc.text(`Employee Name: ${employee.employee_name}`, 10, startY);
    doc.text(
      `Month: ${new Date(0, month - 1).toLocaleString("default", { month: "long" })} ${year}`,
      10,
      startY + 5
    );
    doc.text(
      `Generated Time: ${new Date().toLocaleString()}`,
      10,
      startY + 10
    );
    startY += 20;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Payslip Details", 10, startY);
    startY += 5;

    autoTable(doc, {
      startY: startY,
      head: [["No.", "Description", "Amount"]],
      body: [
        ["1", "Job Role", payslipData.job_role],
        ["2", "Base Salary", `LKR ${payslipData.baseSalary.toLocaleString()}`],
        ["3", "Total Days Attended", payslipData.totalDaysAttended.toString()],
        ["4", "Extra Days", payslipData.extraDays.toString()],
        ["5", "Attendance Bonus", `LKR ${payslipData.attendanceBonus.toLocaleString()}`],
        ["6", "Monthly Bonus", `LKR ${payslipData.monthlyBonus.toLocaleString()}`],
        ["7", "Employee EPF", `LKR ${payslipData.employeeEPF.toLocaleString()}`],
        ["8", "Employer EPF", `LKR ${payslipData.employerEPF.toLocaleString()}`],
        ["9", "Employer ETF", `LKR ${payslipData.employerETF.toLocaleString()}`],
        ["10", "Net Salary", { content: `LKR ${payslipData.netSalary.toLocaleString()}`, styles: { fontStyle: "bold" } }],
      ],
      theme: "grid",
      styles: { font: "helvetica", fontSize: 10 },
      headStyles: { fillColor: [200, 200, 200], textColor: [0, 0, 0], fontStyle: "bold" },
      margin: { left: 10, right: 10 },
      columnStyles: {
        0: { cellWidth: 20 }, 
        1: { cellWidth: 90 }, 
        2: { cellWidth: 70 }, 
      },
    });

    // Summary Section
    startY = doc.lastAutoTable.finalY + 10;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Summary", 10, startY);
    startY += 5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Net Salary: LKR ${payslipData.netSalary.toLocaleString()}`, 10, startY);
    startY += 15;

    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Thank you!", doc.internal.pageSize.getWidth() / 2, startY, { align: "center" });

    doc.save(`payslip_${employee.employee_name}_${year}_${month}.pdf`);
  };

  // Fetch payslip when employee or date changes
  useEffect(() => {
    if (selectedEmployee) {
      fetchPayslip();
    }
  }, [selectedEmployee, year, month]);

  return (
    <div className="min-h-screen bg-[#F6F8FF] p-5">
      <h1 className="text-2xl font-bold mb-4 text-black">Download Payslip</h1>
      <div className="bg-gray-300 p-4 rounded-lg">
        {loading && <p className="text-black mb-2">Loading...</p>}
        {error && <p className="text-red-500 mb-2">{error}</p>}

        {/* Employee and Date Selection */}
        <div className="mb-4 flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-black" htmlFor="employee">
              Employee
            </label>
            <select
              id="employee"
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="mt-1 p-2 border border-gray-500 rounded w-full bg-white text-black"
            >
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.employee_name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-black" htmlFor="year">
              Year
            </label>
            <input
              type="number"
              id="year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              min="2000"
              max={new Date().getFullYear()}
              className="mt-1 p-2 border border-gray-500 rounded w-24 bg-white text-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black" htmlFor="month">
              Month
            </label>
            <select
              id="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="mt-1 p-2 border border-gray-500 rounded bg-white text-black"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={(i + 1).toString().padStart(2, "0")}>
                  {new Date(0, i).toLocaleString("default", { month: "long" })}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Payslip Preview */}
        {payslipData && (
          <div className="border border-gray-500 p-4 rounded bg-white mb-4">
            <h2 className="text-xl font-semibold mb-2 text-black">
              Payslip Preview for{" "}
              {employees.find((emp) => emp._id === selectedEmployee)?.employee_name} (
              {new Date(0, month - 1).toLocaleString("default", { month: "long" })} {year})
            </h2>
            <table className="w-full border-collapse border border-gray-500">
              <tbody>
                <tr className="bg-white">
                  <td className="border border-gray-500 p-2 font-medium text-black">Job Role</td>
                  <td className="border border-gray-500 p-2 text-black">{payslipData.job_role}</td>
                </tr>
                <tr className="bg-white">
                  <td className="border border-gray-500 p-2 font-medium text-black">Base Salary</td>
                  <td className="border border-gray-500 p-2 text-black">
                    {payslipData.baseSalary.toLocaleString()}
                  </td>
                </tr>
                <tr className="bg-white">
                  <td className="border border-gray-500 p-2 font-medium text-black">Total Days Attended</td>
                  <td className="border border-gray-500 p-2 text-black">{payslipData.totalDaysAttended}</td>
                </tr>
                <tr className="bg-white">
                  <td className="border border-gray-500 p-2 font-medium text-black">Extra Days</td>
                  <td className="border border-gray-500 p-2 text-black">{payslipData.extraDays}</td>
                </tr>
                <tr className="bg-white">
                  <td className="border border-gray-500 p-2 font-medium text-black">Attendance Bonus</td>
                  <td className="border border-gray-500 p-2 text-black">
                    {payslipData.attendanceBonus.toLocaleString()}
                  </td>
                </tr>
                <tr className="bg-white">
                  <td className="border border-gray-500 p-2 font-medium text-black">Monthly Bonus</td>
                  <td className="border border-gray-500 p-2 text-black">
                    {payslipData.monthlyBonus.toLocaleString()}
                  </td>
                </tr>
                <tr className="bg-white">
                  <td className="border border-gray-500 p-2 font-medium text-black">Employee EPF</td>
                  <td className="border border-gray-500 p-2 text-black">
                    {payslipData.employeeEPF.toLocaleString()}
                  </td>
                </tr>
                <tr className="bg-white">
                  <td className="border border-gray-500 p-2 font-medium text-black">Employer EPF</td>
                  <td className="border border-gray-500 p-2 text-black">
                    {payslipData.employerEPF.toLocaleString()}
                  </td>
                </tr>
                <tr className="bg-white">
                  <td className="border border-gray-500 p-2 font-medium text-black">Employer ETF</td>
                  <td className="border border-gray-500 p-2 text-black">
                    {payslipData.employerETF.toLocaleString()}
                  </td>
                </tr>
                <tr className="bg-white">
                  <td className="border border-gray-500 p-2 font-medium text-black">Net Salary</td>
                  <td className="border border-gray-500 p-2 font-bold text-black">
                    {payslipData.netSalary.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
            <button
              onClick={generatePDF}
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
              disabled={loading || !payslipData}
            >
              Download Payslip PDF
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap');
        .min-h-screen {
          font-family: 'Poppins', sans-serif;
        }
      `}</style>
    </div>
  );
}