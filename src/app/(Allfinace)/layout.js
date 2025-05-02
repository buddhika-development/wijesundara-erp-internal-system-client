import Link from "next/link";

const FinanceLayout = ({ children }) => {
  return (
    <div className="flex">
      <nav className="w-24 bg-gray-800 text-white p-4 flex flex-col gap-4 min-h-screen fixed top-0 left-0">
        {[
          { label: "🏠", path: "/financehome" },
          { label: "📊", path: "/stat" },
          { label: "💳", path: "/Transactions" },
          { label: "📄", path: "/financereport" },
        
        ].map((item, index) => (
          <Link
            key={index}
            href={item.path}
            className="h-12 w-full flex items-center justify-center bg-gray-700 rounded-md hover:bg-gray-600 transition"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <main className="w-full ml-24">
        {children}
      </main>
    </div>
  );
};

export default FinanceLayout;