import Header from "@/components/layouts/Header"
// import Sidebar from "@/components/layouts/StockManagement/Sidebar"
import { MainNavigations } from "@/Navigations"

const HrManagementLayout = ({children}) => {

    const STOCK_MANAGER_NAVIGATIONS = MainNavigations
    
    return(
        <div className="h-full">
            <Header />  
            <div>
                <div className="flex w-full h-full">
                    <div className="w-full h-full mt-[60px]">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HrManagementLayout