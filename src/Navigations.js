// icon import
import { RxDashboard } from "react-icons/rx";
import { BiBuildings } from "react-icons/bi";
import { AiOutlineProduct } from "react-icons/ai";


// extract website link
const WEBSITE_URI = process.env.SITE_URI

export const MainNavigations = [
    {
        'link-content' : 'Dashboard',
        'link' :`${WEBSITE_URI}/StockManager`,
        'icon' : <RxDashboard/>
    },
    {
        'link-content' : 'Stock',
        'link' : `${WEBSITE_URI}/StockManager/Stock`,
        'icon' : <AiOutlineProduct/>
    },
    {
        'link-content' : 'Infrastructures',
        'link' : `${WEBSITE_URI}/StockManager/Infrastructures`,
        'icon' : <BiBuildings/>
    },
    // {
    //     'link-content' : 'Team',
    //     'link' : `${WEBSITE_URI}/StockManager/Team`
    // }
]


export const StockNavigation = [
    {
        'link-content' : 'Dashboard',
        'link' :`${WEBSITE_URI}/StockManager/Stock/`
    },
    {
        'link-content' : 'Stocks',
        'link' :`${WEBSITE_URI}/StockManager/Stock/Stocks`
    },
    {
        'link-content' : 'Transporations',
        'link' :`${WEBSITE_URI}/StockManager/Stock/StockCheckout`
    },
    {
        'link-content' : 'Purchase confirmations',
        'link' :`${WEBSITE_URI}/StockManager/Stock/StockArrival`
    },
    {
        'link-content' : 'Add Stock',
        'link' :`${WEBSITE_URI}/StockManager/Stock/AddStock`
    }
]


export const InfrastructureNavigations = [
    {
        'link-content' : 'Infrastructures',
        'link' :`${WEBSITE_URI}/StockManager/Infrastructures/`
    },
    {
        'link-content' : 'Add New Premise',
        'link' :`${WEBSITE_URI}/StockManager/Infrastructures/NewPremise`
    }
]


export const TeamNavigations = [
    {
        'link-content' : 'Team',
        'link' :`${WEBSITE_URI}/StockManager/Team/`
    },
    {
        'link-content' : 'Attendeeces',
        'link' :`${WEBSITE_URI}/StockManager/Team/Attendence`
    }
]