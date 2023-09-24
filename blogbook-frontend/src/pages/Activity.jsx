import React from 'react';
import { makeStyles } from "@material-ui/core/styles";
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import { useState, useEffect } from 'react';
import axios from "axios";
import format from "date-fns/format";
import usePagination from "../utils/pagination.js";
import { Link, useNavigate } from "react-router-dom";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteIcon from "@mui/icons-material/Delete";
import { useContext } from "react";
import { AuthContext } from "../context/authContext.js";

//The activity page is the central part of the app 
//It displays a preview of blog posts in a paginated grid
//Users can edit and delete their own posts from here

const useStyles = makeStyles((theme) => ({
    paper: {
      padding: theme.spacing(1),
      textAlign: "center",
    },
    ul: {
        '& .MuiPaginationItem-root': {
            '&.MuiPaginationItem-page': {
                background: 'black',
                color: 'white',
                hover: 'lightgray'
              },
        '&.Mui-selected': {
          background: 'darkgray',
          color: 'black',
          hover: 'lightgray'
        },
        '&.MuiPaginationItem-previousNext': {
            background: 'white',
            color: 'darkgray',
            hover: 'lightgray'
        },
        '&.Mui-disabled': {
            background: 'black',
            color: 'white',
            hover: 'lightgray'
        },
        '&.MuiPaginationItem-ellipsis': {
            background: 'black',
            color: 'white',
            hover: 'lightgray'
        }
    }
}}));

//component for each individual blog preview rectangle
function GridItem({ classes, title, content, category_name, author_name, created_at, id, post_user_id }) {  
    const { currentUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleDelete = async ()=>{
        try {
          await axios.delete(`/posts/${id}`);
          navigate("/activity");
          navigate(0);
        } 
        catch (err) {
          console.log(err);
        }
    };

    //truncate lengthy content to fit preview
    var contentSummary = content;
    if (content.length > 50) {
        contentSummary = content.slice(0,49) + "...";
    }

    //the edit and delete buttons will only be displayed on a user's own blog entries
    return (
      <Grid item xs={12} sm={6} md={3}>
            <Paper className={classes.paper}>
                <Link className="blogEntryPreview" to={`/view/${id}`}>
            <b>{title}</b><br></br>
            <br></br>
            {contentSummary}<br></br>
            <br></br>
            Category: {category_name} Contributor: {author_name}<br></br>
            Publication Date: {format(new Date(created_at), "yyyy/MM/dd")}<br></br>
            </Link>
            {((currentUser) && (currentUser.id == post_user_id)) && 
            <div>
                <Link className="blogEntryPreview" to={`/post/${id}`}>
                    <IconButton>
                        <EditNoteIcon />
                    </IconButton>
                </Link>
                    <IconButton onClick={handleDelete} >
                        <DeleteIcon />
                    </IconButton>
            </div>}
            </Paper>
      </Grid>
)};

function ActivityPagination({ handleChange, count, page }) {
    const classes = useStyles();

    return (
        <Pagination
        count={count}
        page={page}
        classes={{
            root: classes.ul,
        }}
        onChange={handleChange}></Pagination>
    );
};

const Activity = () => {
    const [blogEntries, setBlogEntries] = useState([]);
    const [page, setPage] = useState(1);
    const navigate = useNavigate();

    const count = Math.ceil(blogEntries.length / 20);
    const blogEntryPage = usePagination(blogEntries, 20);

    const handleChange = (e,p) => {
        setPage(p);
        blogEntryPage.jump(p);
    };
    
    useEffect(() => {
        const fetchBlogEntries = async() => {
            try {
                const res = await axios.get("/posts/blogEntries")
                setBlogEntries(res.data);
            }
            catch (err) {
                console.log(err);
            }
        };
        fetchBlogEntries();
    }, []);

    const classes = useStyles();

    
    return (
        <div>
            <Grid container spacing={1}>
                {
                    blogEntryPage.currentData().map((blogEntry) => {
                    return (<GridItem 
                                key={blogEntry.id}
                                classes={classes} 
                                id={blogEntry.id}
                                title={blogEntry.title}
                                content={blogEntry.content}
                                category_name={blogEntry.category_name}
                                author_name={blogEntry.author_name}
                                created_at={blogEntry.created_at}
                                post_user_id={blogEntry.user_id}
                            >
                            </GridItem>);
                    })
                }
            </Grid>
            <Stack spacing={2}>
                <ActivityPagination 
                    handleChange={handleChange}
                    count={count}
                    page={page}
                >
                </ActivityPagination>
            </Stack>
        </div>
    );
}

export default Activity;