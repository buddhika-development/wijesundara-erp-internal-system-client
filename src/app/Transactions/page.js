"use client";

import { useRouter } from "next/navigation";

export default function TransactionsPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="h-16 bg-gray-500 text-white text-2xl flex items-center px-4 rounded-lg">
        Transaction
      </div>

      {/* Filter and Stats */}
      <div className="flex gap-4">
        <select className="bg-gray-400 text-white p-2 rounded-md">
          <option>BOC</option>
          <option>NSB</option>
          <option>RDB</option>
        </select>
        <div className="bg-gray-400 flex-1 h-10 rounded-md"></div>
      </div>

      {/* Transaction Cards - Now as Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => router.push("/transactions/income")}
          className="h-24 bg-red-300 rounded-lg flex items-center justify-center text-white text-lg"
        >
          Income
        </button>

        <button
          onClick={() => router.push("/transactions/expense")}
          className="h-24 bg-red-300 rounded-lg flex items-center justify-center text-white text-lg"
        >
          Expense
        </button>

        <button
          onClick={() => router.push("/transactions/Salary")}
          className="h-24 bg-red-300 rounded-lg flex items-center justify-center text-white text-lg"
        >
          Salary
        </button>

        <button
          onClick={() => router.push("/transactions/Transportation")}
          className="h-24 bg-red-300 rounded-lg flex items-center justify-center text-white text-lg"
        >
          Transportation
        </button>
      </div>

      {/* Reminders */}
      <div className="bg-gray-500 h-32 rounded-lg p-4 text-white">
        <h2 className="text-lg">Reminders</h2>
      </div>
    </div>
  );
}
