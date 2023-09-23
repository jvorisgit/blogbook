import React from "react";
import { useState, useContext, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/authContext.js";
import axios from "axios";

const Post = () => {
    const { currentUser, logout } = useContext(AuthContext);
    console.log(currentUser)
    const [inputs, setInputs] = useState({
        email: "",
        password: ""
    }); 

    const [blogEntry, setBlogEntry] = useState({});
    const location = useLocation();
    const blogEntryId = location.pathname.split("/")[2];

    const [err,setError] =  useState(null);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setInputs(inputs => ({...inputs, [e.target.name]: e.target.value}));
    };

    useEffect(() => {
      const fetchBlogEntry = async() => {
        console.log("fetchBlogEntry")
        if (blogEntryId) {
            try {
                const res = await axios.get(`/posts/blogEntry/${blogEntryId}`)
                setBlogEntry(res.data[0]);
                console.log(blogEntry.created_at)
            }
            catch (err) {
                console.log(err);
            }
        }
      };
      fetchBlogEntry();
    }, [blogEntryId]);

    const handleSubmit = async(e) => {
        e.preventDefault();
        try {
            inputs.user_id = currentUser.id
            const res = await axios.post(`/posts/`, inputs)
            console.log(res)
            navigate("/activity/");
        }
        catch (err) {
            setError(err.response.data);
        }
    };

    return (
        <div class="content_box">
            <form>
                <input required type="text" placeholder="Title" name="title"  onChange={handleChange}></input>
                <input required type="text" placeholder="Category" name="category"  onChange={handleChange}></input>
                <textarea required type="textarea" placeholder="Content" name="content"  onChange={handleChange}></textarea>
                <input required type="text" placeholder="Author Name" name="author_name"   onChange={handleChange}></input>
                <input required type="text" placeholder="Category Name" name="category_name"  onChange={handleChange}></input>
                <select name="status" onChange={handleChange}>
                    <option name="status" value="0">Draft</option>
                    <option name="status" value="1">Published</option>
                </select>
                <button onClick={handleSubmit}>Post</button>
                {err && <p>{err}</p>}
            </form>
        </div>
    );
}

export default Post;
