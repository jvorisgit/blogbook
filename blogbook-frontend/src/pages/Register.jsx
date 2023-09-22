import React from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
    return (
        <div class="user_authentication">
            <h1>Register</h1>
            <form>
                <input required type="text" placeholder="User Name"></input>
                <input required type="email" placeholder="Email"></input>
                <input required type="password" placeholder="Password"></input>
                <button>Register</button>
                <p>Sorry, registration was unsuccessful.</p>
                <span>Already have an account? Head over <Link to="/login">here</Link></span>
            </form>
        </div>
    )
}
export default Register;