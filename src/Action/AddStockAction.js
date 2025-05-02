"use server";

export const AddStockActionHandler = async (prevState, formData) => {
    const stockAmount = formData.get('stock_amount');

    if (!stockAmount || isNaN(stockAmount) || Number(stockAmount) <= 0) {
        return {
            success: false,
            message: 'Invalid stock amount. Please enter a positive number.',
            error: 'Please fill all the fields.',
            stock_amount : 'Stock amount is required and must be greater than 0.'
        };
    }

    const data = {
        supplier: formData.get('supplier'),
        rice_type: formData.get('rice_type'),
        stock_amount: stockAmount
    };

    const price = Math.random()*150000
    const setPrice = price.toFixed(2)

    const financeData = {
        sec_id : 'ST123',
        amount : setPrice,
        description : "Request money to purchase stock",
        bank_account : 'INB123'
    }

    const urlEncodedData = new URLSearchParams(data).toString();
    const urlEncodedDataToFinance = new URLSearchParams(financeData).toString()

    const response = await fetch('http://localhost:8080/api/purchase/add_purchase', {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: urlEncodedData
    });

    const financeResponse = await fetch('http://localhost:8080/api/purchase/requestApproval', {
        method : "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: urlEncodedDataToFinance
    })

    if (response.ok) {
        return {
            success: true,
            message: 'Successfully added the data. Waiting for approval..'
        };
    } else {
        const errorData = await response.json();
        return {
            success: false,
            message: 'Something went wrong...',
            error: errorData.message || 'Please check again and try.'
        };
    }
};