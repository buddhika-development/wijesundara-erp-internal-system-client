import Header from "@/components/layouts/Header"
import Sidebar from "@/components/layouts/StockManagement/Sidebar"

const StockManagementLayout = ({children}) => {
    return(
        <div className="h-full">
            <Header />  
            <main>
                <div className="flex w-full h-full">
                    <Sidebar />
                    <div className="w-full h-full">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    )
}

export default StockManagementLayout