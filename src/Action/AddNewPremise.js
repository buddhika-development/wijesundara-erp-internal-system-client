"use server"

export const AddNewPremise = async (prevState, formData) => {

    const phoneRegex = /^(?:\+94|0)(?:(?:11|21|23|24|25|26|27|31|32|33|34|35|36|37|38|41|45|47|51|52|54|55|57|63|65|66|67|81|912)(?:0|2|3|4|5|7|9)\d{6}|7[0-8]\d{7})$/;
    
    const premise_name = formData.get('premise-name')
    const premise_type = formData.get('premise-type')
    const address_line_one = formData.get('address-line-one')
    const address_line_two = formData.get('address-line-two')
    const address_district = formData.get('address-district')
    const address_city = formData.get('address-city')
    const contact_number = formData.get('contact-number')

    if(
        premise_name == '' || premise_name == undefined ||
        premise_type == '' || premise_type == undefined ||
        address_line_one == '' || address_line_one == undefined ||
        address_district == '' || address_district == undefined ||
        address_city == '' || address_city == undefined ||
        contact_number == '' || contact_number == undefined
    ){
        return {
            success : false,
            error : 'Please fill all the field'
        }
    }

    if(!phoneRegex.test(contact_number)) {
        return {
            success : false,
            contact_number : 'Please enter valid phone number..'
        }
    }

    const data = {
        infrastructure_name : premise_name,
        infrastructure_type : premise_type,
        ingfrastructuire_address_line_one : address_line_one,
        infrastructure_address_line_two : address_line_two,
        infrastructure_address_district : address_district,
        ingfrastructuire_address_city : address_city,
        infrastructure_contact_number : contact_number
    }

    
    const urlencodedData = new URLSearchParams(data).toString()

    const response = await fetch('http://localhost:8080/api/infrastructure', {
        method: 'POST',
        headers : {
            'Content-Type' : 'application/x-www-form-urlencoded'
        },
        body : urlencodedData
    })

    if(response.ok) {
        return {
            success : true,
            message : 'Successfully created premise..'
        }
    }
    else {
        return {
            success : false,
            message : 'Something went wrong. Please check again.'
        }
    }

    
}