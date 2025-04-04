import Header from "@/components/layouts/Header"
import Sidebar from "@/components/layouts/StockManagement/Sidebar"
import { MainNavigations } from "@/Navigations"

const StockManagementLayout = ({children}) => {

    const STOCK_MANAGER_NAVIGATIONS = MainNavigations
    
    return(
        <div className="h-full">
            <Header />  
            <main>
                <div className="flex w-full h-full">
                    <Sidebar links={STOCK_MANAGER_NAVIGATIONS} />
                    <div className="w-[calc(100vw-250px)] h-full mt-[80px] ml-[250px]">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    )
}

export default StockManagementLayout