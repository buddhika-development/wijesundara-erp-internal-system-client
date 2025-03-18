
// extract website link
const WEBSITE_URI = process.env.SITE_URI

export const MainNavigations = [
    {
        'link-content' : 'Dashboard',
        'link' :`${WEBSITE_URI}/StockManager`
    },
    {
        'link-content' : 'Stock',
        'link' : `${WEBSITE_URI}/StockManager/Stock`
    },
    {
        'link-content' : 'Infrastructures',
        'link' : `${WEBSITE_URI}/StockManager/Infrastructures`
    },
    {
        'link-content' : 'Team',
        'link' : `${WEBSITE_URI}/StockManager/Team`
    }
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
        'link-content' : 'Checkout',
        'link' :`${WEBSITE_URI}/StockManager/Stock/StockCheckout`
    },
    {
        'link-content' : 'Arrivals',
        'link' :`${WEBSITE_URI}/StockManager/Stock/StockArrival`
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