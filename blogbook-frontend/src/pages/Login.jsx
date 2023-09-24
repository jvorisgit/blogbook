import React from "react";
import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext.js";

const Login = () => {
    const [inputs, setInputs] = useState({
        email: "",
        password: ""
    }); 

    const [err,setError] =  useState(null);

    const navigate = useNavigate();

    const { login } = useContext(AuthContext);

    const handleChange = (e) => {
        setInputs(inputs => ({...inputs, [e.target.name]: e.target.value}));
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        try {
            const res = await login(inputs);
            navigate("/activity");
        }
        catch (err) {
            setError(err.response.data);
        }
    };

    return (
        <div className="content_box">
            <h1>Login</h1>
            <form>
                <input required type="email" placeholder="Email" name="email" onChange={handleChange}></input>
                <input required type="password" placeholder="Password" name="password" onChange={handleChange}></input>
                <button onClick={handleSubmit}>Login</button>
                {err && <p>{err}</p>}
                <span>Need an account? Head over <Link to="/register">here</Link></span>
            </form>
        </div>
    );
}

export default Login;