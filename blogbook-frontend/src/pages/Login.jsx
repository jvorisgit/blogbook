import React from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
    return (
        <div class="user_authentication">
            <h1>Login</h1>
            <form>
                <input required type="text" placeholder="User Name"></input>
                <input required type="password" placeholder="Password"></input>
                <button>Login</button>
                <p>Sorry, login was unsuccessful.</p>
                <span>Need an account? Head over <Link to="/register">here</Link></span>
            </form>
        </div>
    )
}

export default Login;