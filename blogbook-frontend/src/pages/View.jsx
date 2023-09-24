import React from "react";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

//Page for viewing the full content of blog entries

const View = () => {
    const [blogEntry, setBlogEntry] = useState({});
    const location = useLocation();
    const blogEntryId = location.pathname.split("/")[2];

    const [err,setError] =  useState(null);

    useEffect(() => {
      const fetchBlogEntry = async() => {
          try {
              const res = await axios.get(`/posts/blogEntry/${blogEntryId}`);
              setBlogEntry(res.data[0]);
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