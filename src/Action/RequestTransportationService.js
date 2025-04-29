"use server"

const RequestTransportationService = async (preState, formData) => {

    const stock_amount = await formData.get("stock_amount")
    const trip_source = await formData.get('trip-source')
    const trip_destination = await formData.get('trip-destination')
    const rice_type =  await formData.get('rice_varient')
    
    if (stock_amount == undefined || stock_amount <= 0 ) {
        return {
            success : false,
            message : 'Please enter valid details',
            error : {
                stock_amount : 'Stock amount must be possitive and higher than zero.'
            }
        }
    }

    if (trip_source == trip_destination) {
        return {
            success : false,
            message : 'Please check details again..',
            error : {
                trip_destination : "Trip source and destination both can't be same."
            }
        }
    }

    const data = {
        source_location : trip_source,
        destination_location : trip_destination,
        status : 'waiting',
        rice_type : rice_type,
        stock : stock_amount
    }

    const urlencodedData = new URLSearchParams(data).toString()

    const response = await fetch('http://localhost:8080/api/transportaion_task', {
        method : 'POST',
        headers : {
            'Content-Type' :'application/x-www-form-urlencoded'
        },
        body : urlencodedData
    })

    

    console.log(`Source location : ${trip_source}`)
    console.log(`destination location : ${trip_destination}`)
}

export default RequestTransportationService