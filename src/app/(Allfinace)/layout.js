import Link from "next/link"

const financeLayout = ({children}) => {
  return(
    <div className="flex ">
      {/* Sidebar Navigation */}
      <nav className="w-24 bg-gray-800 text-white p-4 flex flex-col gap-4 min-h-screen">
          {[
            { label: "🏠", path: "/financehome" },
            { label: "📊", path: "/financereport" },
            { label: "💳", path: "/Transactions" },
            { label: "⚙️", path: "/settings" },
            { label: "👤", path: "/profile" },
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
        
        <main className="w-full">
          {children}
        </main>
    </div>
  )
}

export default financeLayout