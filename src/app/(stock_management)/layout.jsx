import Header from "@/components/layouts/Header"
import Sidebar from "@/components/layouts/StockManagement/Sidebar"

const StockManagementLayout = ({children}) => {
    return(
        <div>
            <Header />  
            <main>
                <div className="flex w-full h-full">
                    <Sidebar />
                    {children}
                </div>
            </main>
        </div>
    )
}

export default StockManagementLayout