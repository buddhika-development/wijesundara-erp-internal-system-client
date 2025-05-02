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

    const urlEncodedData = new URLSearchParams(data).toString();

    const response = await fetch('http://localhost:8080/api/purchase/add_purchase', {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: urlEncodedData
    });

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