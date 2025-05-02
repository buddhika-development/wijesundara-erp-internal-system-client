"use client"

import Title from "@/components/ui/Titles/Title";
import userLogins from "@/userLogins";
import React, { useState } from "react";

const page = () => {

    const [formData, setFormData] = useState({
        user_name : "",
        user_password : ""
    })

    const handleInput = (e) => {
        const {name, value} = e.target

        setFormData(prev => ({
            ...prev,
            [name] : value
        }))
    }
    
    const handleLogin = (e) => {
        e.preventDefault()

        const userValidationData = userLogins.find(user => 
            user.user_name == formData["user_name"] && user.user_password == formData["user_password"]
        )
        
        if (userValidationData == undefined) {
            alert('Invalid login please check the credentials.')
        }
        else{
            window.location.href = userValidationData.destination;
        }
        
    }   
    
  return (
    <div className="w-full h-full flex items-center justify-center bg-blue-50">

        <div className="w-1/4 p-12 rounded-md shadow-md bg-white">
            <Title title_content="Welcome Again" />

            <form className="mt-5" onSubmit={handleLogin} method="POST">
                <div className="input-section">
                    <label htmlFor="user_name">User Name</label>
                    <input type="text" name="user_name" onChange={handleInput} />
                </div>
                <div className="input-section">
                    <label htmlFor="user_password">User Password</label>
                    <input type="password" name="user_password" onChange={handleInput} />
                </div>

                <input className="submit-btn w-full mt-5" type="submit" value={'Login'} />
            </form>
        </div>
    </div>
  );
};

export default page;
