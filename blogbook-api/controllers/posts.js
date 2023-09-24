import { db } from "../db.js";
import jwt from "jsonwebtoken";

//handle requests for a list of blog entries
export const getBlogEntries = (req,res) => {
    //if a category is specified, filter for it
    const getBlogEntriesQuery = req.query.category 
        ? `SELECT posts.id AS id, posts.title AS title, posts.content AS content, posts.category_id AS category_id, posts.author_name AS author_name, posts.created_at AS created_at,
            posts.user_id AS user_id, categories.category_name 
            AS category_name FROM posts LEFT JOIN categories ON posts.category_id = categories.id WHERE status=1 AND category_id = ? ORDER BY created_at DESC`
        : `SELECT posts.id AS id, posts.title AS title, posts.content AS content, posts.category_id AS category_id, posts.author_name AS author_name, posts.created_at AS created_at, 
            posts.user_id AS user_id, categories.category_name 
            AS category_name FROM posts LEFT JOIN categories ON posts.category_id = categories.id  WHERE status=1 ORDER BY created_at DESC`

        db.query(getBlogEntriesQuery, [req.query.category], (err,data) => {
            if (err) return res.send(err);

            return res.status(200).json(data);
        });
};

//handle requests for a list of blog categories for the sidebar
export const getBlogCategories = (req,res) => {
    //requirement: display top 10 categories
    //ranking is by number of posts
    const getBlogEntriesQuery = `SELECT category_id, category_post_count, id, category_name FROM
                                (SELECT category_id, COUNT(id) AS category_post_count FROM posts GROUP BY category_id) category_post_counts
                                LEFT JOIN categories on category_post_counts.category_id = categories.id
                                ORDER BY category_post_count DESC
                                LIMIT 10`;

        db.query(getBlogEntriesQuery, (err,data) => {
            if (err) return res.send(err);

            return res.status(200).json(data);
        });
};

//handle requests for a single blog entry
export const getBlogEntry = (req,res) => {
    const getBlogEntryQuery = `SELECT posts.id AS id, posts.title AS title, posts.content AS content, posts.category_id AS category_id, posts.author_name AS author_name, posts.created_at AS created_at, posts.status AS status,
                                posts.user_id AS user_id, categories.category_name AS category_name
                                FROM posts LEFT JOIN categories ON posts.category_id = categories.id WHERE posts.id = ?`;

       db.query(getBlogEntryQuery, [req.params.id], (err,data) => {
            if (err) return res.send(err);
            return res.status(200).json(data);
        });
};

//handle requests to create a new blog entry
export const postBlogEntry = (req,res) => {
    //make sure post id doesn't already exist
    const postCheckQuery = "SELECT id FROM posts WHERE id = ?";
    db.query(postCheckQuery, [req.body.email], (err,data) => {
        if (err) {
            return res.json(err);
        }
        if (data.length) {
            return res.status(409).json("Blog entry with this id already exists");
        }

        //check if the category name already exists
        const checkCategoryQuery = "SELECT id FROM categories WHERE category_name = ?";
        const checkCategoryQueryValues = [
            req.body.category_name
        ]

        db.query(checkCategoryQuery, [checkCategoryQueryValues], (checkCategoryQueryerr,checkCategoryQuerydata) => {
            if (checkCategoryQueryerr) {
                return res.json(checkCategoryQueryerr);
            }

            if (checkCategoryQuerydata.length === 0) {
                //the category doesn't exist yet, so we need to create it
                const addCategoryQuery = "INSERT INTO categories(`category_name`) VALUES (?)";
                const addCategoryValues = [
                    req.body.category_name
                ];

                db.query(addCategoryQuery, [addCategoryValues], (addCategoryErr,addCategoryData) => {
                    if (addCategoryErr) {
                        return res.status(400).json("There was an error with your post");
                    }
                    
                    //the new category was added successfully
                    //lookup the category id of the new category
                    db.query(checkCategoryQuery, [checkCategoryQueryValues], (checkCategoryQueryerr,checkCategoryQuerydata) => {
                        if (checkCategoryQueryerr) {
                            return res.json(checkCategoryQueryerr);
                        }

                        //use the new category id to create the blog entry
                        const new_category_id = checkCategoryQuerydata[0].id;
                        const addPostQuery = "INSERT INTO posts(`title`,`category_id`,`content`,`author_name`,`created_at`,`user_id`,`status`) VALUES (?)";
                        const addPostQueryValues = [
                            req.body.title,
                            new_category_id,
                            req.body.content,
                            req.body.author_name,
                            new Date(),
                            req.body.user_id,
                            req.body.status
                        ];

                        db.query(addPostQuery, [addPostQueryValues], (err,data) => {
                            if (err) {
                                return res.status(400).json("There was an error with your post");
                            }
                            return res.status(200).json("New blog entry successfully posted");
                        });
                    });
                });
            }
            else{
                //the category id already exists, so we can use its id to create the blog entry
                const addCategoryQuery = "INSERT INTO posts(`title`,`category_id`,`content`,`author_name`,`created_at`,`user_id`,`status`) VALUES (?)";
                const addCategoryValues = [
                    req.body.title,
                    checkCategoryQuerydata[0].id,
                    req.body.content,
                    req.body.author_name,
                    new Date(),
                    req.body.user_id,
                    req.body.status
                ];

                db.query(addCategoryQuery, [addCategoryValues], (err,data) => {
                    if (err) {
                        return res.status(400).json("There was an error with your post");
                    }
                    return res.status(200).json("New blog entry successfully posted");
                });
            }
        });
    });
};

//handle requests to update an existing blog entry
export const updateBlogEntry = (req,res) => {
    //verify that a valid access token was provided in the request
    const [name,token] = req.headers.cookie.split("=");
    if ((name != "access_token")) {
        return res.status(401).json("Request not authenticated");
    }
    jwt.verify(token,"blogbooksecretkey",(err, userInfo) => {
        if (err) {
            return res.status(403).json("Invalid access token");
            
        }
        const postCheckQuery = "SELECT id FROM posts WHERE id = ?";
        db.query(postCheckQuery, [req.body.id], (err,data) => {
            if (err) {
                return res.json(err);
            }
            if (data.length === 0) {
                return res.status(404).json("Blog entry not found");
            }

            //check if category name exists
            const checkCategoryQuery = "SELECT id FROM categories WHERE category_name = ?";
            const checkCategoryQueryValues = [
                req.body.category_name
            ]
            db.query(checkCategoryQuery, [checkCategoryQueryValues], (checkCategoryQueryerr,checkCategoryQuerydata) => {
                if (checkCategoryQueryerr) {
                    return res.json(checkCategoryQueryerr);
                }

                if (checkCategoryQuerydata.length === 0) {
                    //doesnt exist so add cat
                    const addCategoryQuery = "INSERT INTO categories(`category_name`) VALUES (?)";
                    const addCategoryValues = [
                        req.body.category_name
                    ];

                    db.query(addCategoryQuery, [addCategoryValues], (addCategoryErr,addCategoryData) => {
                        if (addCategoryErr) {
                            return res.status(400).json("There was an error with your post");
                        }
                          
                        //new cat added successfully
                        //lookup new cat id value
                        db.query(checkCategoryQuery, [checkCategoryQueryValues], (checkCategoryQueryerr,checkCategoryQuerydata) => {
                            if (checkCategoryQueryerr) {
                                return res.json(checkCategoryQueryerr);
                            }

                            //use new cat id value
                            const new_category_id = checkCategoryQuerydata[0].id;

                            //use existing cat id value
                            const updatePostQuery = "UPDATE posts SET `title`=?,`category_id`=?,`content`=?,`author_name`=?,`created_at`=?,`user_id`=?,`status`=? WHERE id = ? ";
                            const updatePostQueryValues = [
                                req.body.title,
                                new_category_id,
                                req.body.content,
                                req.body.author_name,
                                new Date(),
                                req.body.user_id,
                                req.body.status,
                                req.params.id
                            ];

                            db.query(updatePostQuery, [...updatePostQueryValues], (err,data) => {
                                if (err) {
                                    return res.status(400).json("There was an error with your post");
                                }
                                return res.status(200).json("New blog entry successfully posted");
                            });
                        });
                    });
                }
                else{
                    //use existing cat id value
                    const updatePostQuery = "UPDATE posts SET `title`=?,`category_id`=?,`content`=?,`author_name`=?,`created_at`=?,`user_id`=?,`status`=? WHERE id = ? ";
                    const updatePostQueryValues = [
                        req.body.title,
                        checkCategoryQuerydata[0].id,
                        req.body.content,
                        req.body.author_name,
                        new Date(),
                        req.body.user_id,
                        req.body.status,
                        req.params.id
                    ];

                    db.query(updatePostQuery, [...updatePostQueryValues], (err,data) => {
                        if (err) {
                            return res.status(400).json("There was an error with your post");
                        }
                        return res.status(200).json("New blog entry successfully posted");
                    });
                }
            });
        });
    });
};

//handle requests to delete an existing blog entry
export const deleteBlogEntry = (req,res) => {
    //verify that a valid access token was provided in the request
    const [name,token] = req.headers.cookie.split("=");
    if ((name != "access_token")) {
        return res.status(401).json("Request not authenticated");
    }
    jwt.verify(token,"blogbooksecretkey",(err, userInfo) => {
        if (err) {
            return res.status(403).json("Invalid access token");
        }
        const postId = req.params.id;
        const deletePostQuery = "DELETE FROM posts WHERE `id` = ? and `user_id` = ?";
        db.query(deletePostQuery,[parseInt(postId),userInfo.id], (err,deletePostQuerydata) => {
            if (err) {
                return res.status(403).json("There was an error deleting the blog entry");
            }
            return res.status(200).json("Post deleted successfully");
        });
    });
};




