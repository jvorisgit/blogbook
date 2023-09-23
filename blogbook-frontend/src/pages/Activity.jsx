import React from 'react';
import { makeStyles } from "@material-ui/core/styles";
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { useState, useEffect } from 'react';
import axios from "axios";
import format from "date-fns/format";
import usePagination from "../utils/pagination.js";

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

function GridItem({ classes, title, content, category_name, author_name, created_at }) {  

    var contentSummary = content;
    if (content.length > 50) {
        contentSummary = content.slice(0,49) + "...";
    }

    return (
      <Grid item xs={12} sm={6} md={3}>
        <Paper className={classes.paper}>
        <b>{title}</b><br></br>
        <br></br>
        {contentSummary}<br></br>
        <br></br>
        Category: {category_name}<br></br>
        Contributor: {author_name}<br></br>
        Publication Date: {format(new Date(created_at), "yyyy/MM/dd")}<br></br>
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
                                classes={classes} 
                                title={blogEntry.title}
                                content={blogEntry.content}
                                category_name={blogEntry.category_name}
                                author_name={blogEntry.author_name}
                                created_at={blogEntry.created_at}
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