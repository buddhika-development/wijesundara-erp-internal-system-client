import Link from "next/link";

const FinanceLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <nav className="w-48 bg-gray-900 text-white p-4 flex flex-col gap-3 fixed top-0 left-0 h-full shadow-lg">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Finance Dashboard</h1>
        </div>
        {[
          { label: "Home", emoji: "🏠", path: "/financehome" },
          { label: "Statistics", emoji: "📊", path: "/stat" },
          { label: "Transactions", emoji: "💳", path: "/Transactions" },
          { label: "Reports", emoji: "📄", path: "/financereport" },
        ].map((item, index) => (
          <Link
            key={index}
            href={item.path}
            className="flex items-center gap-3 h-12 px-4 rounded-lg text-lg font-medium bg-gray-800 hover:bg-gray-700 hover:scale-[1.02] transition-all duration-200"
          >
            <span className="text-xl">{item.emoji}</span>
            <span>{item.label}</span>
          </Link>
        ))}
        <div className="mt-auto">
          <Link
            href="http://localhost:3000/SystemLogin"
            className="flex items-center gap-3 h-12 px-4 rounded-lg text-lg font-medium bg-gray-800 hover:bg-red-700 hover:scale-[1.02] transition-all duration-200"
          >
            <span className="text-xl">↩️</span>
            <span>Logout</span>
          </Link>
        </div>
      </nav>

      <main className="flex-1 ml-48 p-8">
        {children}
      </main>
    </div>
  );
};

export default FinanceLayout;