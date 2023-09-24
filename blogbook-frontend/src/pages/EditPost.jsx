import React from "react";
import { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/authContext.js";
import axios from "axios";

//The edit post page is the same as the create new blog entry page, but is prefilled to allow users to update their existing entries

const Post = () => {
    const { currentUser } = useContext(AuthContext);
    const [inputs, setInputs] = useState({
        title: "",
        content: "",
        author_name: "",
        category_name: "",
        status: 0,
    }); 

    const location = useLocation();
    const blogEntryId = location.pathname.split("/")[2];

    const [err,setError] =  useState(null);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setInputs(inputs => ({...inputs, [e.target.name]: e.target.value}));
    };

    useEffect(() => {
      const fetchBlogEntry = async() => {
        if (blogEntryId) {
            try {
                const res = await axios.get(`/posts/blogEntry/${blogEntryId}`)
                setInputs(res.data[0]);
            }
            catch (err) {
                setError(err.response.data);
            }
        }
      };
      fetchBlogEntry();
    }, [blogEntryId]);

    const handleSubmit = async(e) => {
        e.preventDefault();
        try {
            inputs.user_id = currentUser.id;
            const res = await axios.put(`/posts/${blogEntryId}`, inputs);
            //send user to the activity page after they've posted
            navigate("/activity/");
        }
        catch (err) {
            setError(err.response.data);
        }
    };

    if ((currentUser) && (currentUser.id == inputs.user_id))
    {
        return (
            <div className="content_box">
                <form>
                    <input required type="text" placeholder="Title" name="title" value={inputs.title || ""} onChange={handleChange}></input>
                    <textarea required type="textarea" placeholder="Content" name="content"  value={inputs.content || ""} onChange={handleChange}></textarea>
                    <input required type="text" placeholder="Author Name" name="author_name" value={inputs.author_name || ""}  onChange={handleChange}></input>
                    <input required type="text" placeholder="Category Name" name="category_name" value={inputs.category_name || ""} onChange={handleChange}></input>
                    <select value={inputs.status || ""} name="status" onChange={handleChange}>
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
