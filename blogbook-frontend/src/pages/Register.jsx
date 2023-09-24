import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

//New user registration page

const Register = () => {
    const [inputs, setInputs] = useState({
        email: "",
        password: ""
    }); 

    const [err,setError] =  useState(null);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setInputs(inputs => ({...inputs, [e.target.name]: e.target.value}));
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        try {
            await axios.post("/auth/register", inputs);
            navigate("/login");
        }
        catch (err) {
            setError(err.response.data);
        }
    };

    return (
        <div className="content_box">
            <h1>Register</h1>
            <form>
                <input required type="email" placeholder="Email" name="email" onChange={handleChange}></input>
                <input required type="password" placeholder="Password" name="password" onChange={handleChange}></input>
                <button onClick={handleSubmit}>Register</button>
                {err && <p>{err}</p>}
                <span>Already have an account? Head over <Link to="/login">here</Link></span>
            </form>
        </div>
    )
}

export default Register;