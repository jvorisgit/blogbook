import React from 'react';
import { Sidebar, Menu, MenuItem, useProSidebar } from "react-pro-sidebar";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import { useState, useEffect } from 'react';
import axios from "axios";
import { Link } from "react-router-dom";

//blog sidebar component using react pro sidebar
const BlogBookSidebar = () => {
  const [topCategories, settopCategories] = useState([]);

  const handleChange = (topCategories) => {
    settopCategories(topCategories);
  };

  //get top 10 categories from backend ranked by number of posts
  useEffect(() => {
    const fetchCategories = async() => {
        try {
            const res = await axios.get("/posts/blogCategories")
            settopCategories(res.data);
        }
        catch (err) {
            console.log(err);
        }
    };
    fetchCategories();
  }, []);
  
  const { collapseSidebar } = useProSidebar();

  //i thought it would look bland if all of the sidebar categories had the same icon, so i assigned them randomly for now
  return (
    <Sidebar style={{ height: "100vh" }} handleChange={handleChange}>
      <Menu >
        <MenuItem
          icon={<MenuOutlinedIcon />}
          onClick={() => {
            collapseSidebar();
          }}
          style={{ textAlign: "center" }}
        >
          {" "}
          <h2>BlogBook</h2>
        </MenuItem>

        {topCategories.map((category) => {
          if ((category.id % 7) === 0) {
            return (<MenuItem className="sidebar-item" component={<Link></Link>} to={`/Activity/${category.category_id}`} key={category.category_name} icon={<ReceiptOutlinedIcon />} >{category.category_name} - {category.category_post_count} </MenuItem>);
          }
          else if ((category.id % 5) === 0) {
            return (<MenuItem className="sidebar-item" component={<Link></Link>} to={`/Activity/${category.category_id}`} key={category.category_name} icon={<ContactsOutlinedIcon />} >{category.category_name}  - {category.category_post_count} </MenuItem>);
          }
          else if ((category.id % 3) === 0)
          {
            return (<MenuItem className="sidebar-item" component={<Link></Link>} to={`/Activity/${category.category_id}`} key={category.category_name} icon={<HomeOutlinedIcon />} >{category.category_name}  - {category.category_post_count} </MenuItem>);
          }
          else if ((category.id % 2) === 0)
          {
            return (<MenuItem className="sidebar-item" component={<Link></Link>} to={`/Activity/${category.category_id}`} key={category.category_name} icon={<CalendarTodayOutlinedIcon />} >{category.category_name}  - {category.category_post_count} </MenuItem>);
          }
          else 
          {
            return (<MenuItem className="sidebar-item" component={<Link></Link>} to={`/Activity/${category.category_id}`} key={category.category_name} icon={<PeopleOutlinedIcon />} >{category.category_name}  - {category.category_post_count} </MenuItem>);
          }
       })}
      </Menu>
    </Sidebar>
  )
}

export default BlogBookSidebar
