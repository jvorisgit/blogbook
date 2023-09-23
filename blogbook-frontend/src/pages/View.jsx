import React from "react";
import { useState, useContext, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/authContext.js";
import axios from "axios";

const View = () => {
    const [blogEntry, setBlogEntry] = useState({});
    const location = useLocation();
    const blogEntryId = location.pathname.split("/")[2];

    const [err,setError] =  useState(null);

    useEffect(() => {
      const fetchBlogEntry = async() => {
        console.log("fetchBlogEntry")
          try {
              const res = await axios.get(`/posts/blogEntry/${blogEntryId}`)
              setBlogEntry(res.data[0]);
              console.log(blogEntry.created_at)
          }
          catch (err) {
              console.log(err);
          }
      };
      fetchBlogEntry();
    }, [blogEntryId]);

    return (
        <div className="content_box">
            <form>
                <h1>{blogEntry.title}</h1>
                <p>{blogEntry.content}</p>
                <p>Published by {blogEntry.author_name} under category {blogEntry.category_name} <br></br> on {blogEntry.created_at}</p>
            </form>
        </div>
    );
}

export default View;