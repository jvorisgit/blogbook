import { db } from "../db.js";

export const getBlogEntries = (req,res) => {
    const getBlogEntriesQuery = req.query.category 
        ? `SELECT posts.id AS id, posts.title AS title, posts.content AS content, posts.category_id AS category_id, posts.author_name AS author_name, posts.created_at AS created_at,
            categories.category_name 
            AS category_name FROM posts LEFT JOIN categories ON posts.category_id = categories.id WHERE status=1 AND category_id = ? ORDER BY created_at DESC`
        : `SELECT posts.id AS id, posts.title AS title, posts.content AS content, posts.category_id AS category_id, posts.author_name AS author_name, posts.created_at AS created_at, 
            categories.category_name 
            AS category_name FROM posts LEFT JOIN categories ON posts.category_id = categories.id  WHERE status=1 ORDER BY created_at DESC`

        db.query(getBlogEntriesQuery, [req.query.category], (err,data) => {
            if (err) return res.send(err);

            return res.status(200).json(data);
        });
};

export const getBlogCategories = (req,res) => {
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

export const getBlogEntry = (req,res) => {
    const getBlogEntryQuery = `SELECT posts.id AS id, posts.title AS title, posts.content AS content, posts.category_id AS category_id, posts.author_name AS author_name, posts.created_at AS created_at, posts.status AS status,
                                categories.category_name AS category_name
                                FROM posts LEFT JOIN categories ON posts.category_id = categories.id WHERE posts.id = ?`;

       db.query(getBlogEntryQuery, [req.params.id], (err,data) => {
            if (err) return res.send(err);
            return res.status(200).json(data);
        });
};

export const postBlogEntry = (req,res) => {
    const postCheckQuery = "SELECT id FROM posts WHERE id = ?";
    
    db.query(postCheckQuery, [req.body.email], (err,data) => {
        if (err) {
            return res.json(err);
        }
        if (data.length) {
            return res.status(409).json("Blog entry with this id already exists");
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
                //use existing cat id value
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

export const updateBlogEntry = (req,res) => {
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
};

export const deleteBlogEntry = (req,res) => {
    res.json("");
};




