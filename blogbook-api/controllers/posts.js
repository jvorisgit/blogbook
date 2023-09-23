import { db } from "../db.js";

export const getBlogEntries = (req,res) => {
    const getBlogEntriesQuery = req.query.category 
        ? "SELECT * FROM posts LEFT JOIN categories ON posts.category_id = categories.id WHERE status=1 AND category_id = ? ORDER BY created_at DESC"
        : "SELECT * FROM posts LEFT JOIN categories ON posts.category_id = categories.id  WHERE status=1 ORDER BY created_at DESC"

        db.query(getBlogEntriesQuery, [req.query.category], (err,data) => {
            if (err) return res.send(err);

            return res.status(200).json(data);
        });
};

export const getBlogCategories = (req,res) => {
    const getBlogEntriesQuery = `SELECT * FROM
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
    res.json("");
};

export const postBlogEntry = (req,res) => {
    res.json("");
};

export const deleteBlogEntry = (req,res) => {
    res.json("");
};

export const updateBlogEntry = (req,res) => {
    res.json("");
};


