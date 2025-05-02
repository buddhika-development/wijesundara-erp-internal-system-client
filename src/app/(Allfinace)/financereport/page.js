"use client";

import React, { useState } from "react";

const ReportManagement = () => {
  const [reports, setReports] = useState([
    { id: 1, name: "Report_Jan_2025.pdf", date: "2025-01-05" },
    { id: 2, name: "Report_Feb_2025.pdf", date: "2025-02-07" },
  ]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    if (file && file.type === "application/pdf") {
      const newReport = {
        id: reports.length + 1,
        name: file.name,
        date: new Date().toISOString().slice(0, 10),
      };

      setReports([newReport, ...reports]);
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  return (
    <div className="p-6">
      
      <div className="h-16 bg-gray-500 rounded-lg flex items-center p-4 text-white text-lg">
        Report Management
      </div>

     
      <div className="bg-gray-400 rounded-lg p-6 text-white mt-4">
        <h2 className="text-xl mb-4">Upload New Report</h2>
        <input
          type="file"
          accept="application/pdf"
          className="bg-gray-300 text-black p-2 rounded-lg"
          onChange={handleFileUpload}
        />
      </div>

     
      <div className="bg-gray-400 rounded-lg p-6 text-white mt-4">
        <h2 className="text-xl mb-4">Previous Reports</h2>
        <div className="space-y-2">
          {reports.map((report) => (
            <div
              key={report.id}
              className="h-12 bg-gray-500 rounded-md flex items-center justify-between px-4"
            >
              <span>{report.name}</span>
              <span className="text-sm">{report.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportManagement;
