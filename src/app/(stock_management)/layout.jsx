import Header from "@/components/layouts/Header"
import Sidebar from "@/components/layouts/StockManagement/Sidebar"
import { MainNavigations } from "@/Navigations"

const StockManagementLayout = ({children}) => {

    const STOCK_MANAGER_NAVIGATIONS = MainNavigations
    
    return(
        <div className="h-full">
            <Header />  
            <div>
                <div className="flex w-full h-full">
                    <Sidebar links={STOCK_MANAGER_NAVIGATIONS} />
                    <div className="w-[calc(100vw-400px)] h-full mt-[60px] ml-[300px]">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StockManagementLayout