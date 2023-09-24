import React from "react";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext.js";
import axios from "axios";

//Page for creating new blog entries

const Post = () => {
    const { currentUser, logout } = useContext(AuthContext);
    const [inputs, setInputs] = useState({
        title: "",
        content: "",
        author_name: "",
        category_name: "",
        status: 0,
    }); 

    const [err,setError] =  useState(null);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setInputs(inputs => ({...inputs, [e.target.name]: e.target.value}));
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        try {
            inputs.user_id = currentUser.id;
            const res = await axios.post(`/posts/`, inputs);

            navigate("/activity/");
        }
        catch (err) {
            setError(err.response.data);
        }
    };

    if (currentUser)
    {
        return (
            <div className="content_box">
                <form>
                    <input required type="text" placeholder="Title" name="title" onChange={handleChange}></input>
                    <textarea required type="textarea" placeholder="Content" name="content"  onChange={handleChange}></textarea>
                    <input required type="text" placeholder="Author Name" name="author_name" onChange={handleChange}></input>
                    <input required type="text" placeholder="Category Name" name="category_name" onChange={handleChange}></input>
                    <select name="status" onChange={handleChange}>
                        <option value="0">Draft</option>
                        <option value="1">Published</option>
                    </select>
                    <button onClick={handleSubmit}>Post</button>
                    {err && <p>{err}</p>}
                </form>
            </div>
        );
    }
    else {
        return (
            <div className="content_box">
                <form>
                    <h1>Unauthorized</h1>
                </form>
            </div>
        );
    }
}

export default Post;
