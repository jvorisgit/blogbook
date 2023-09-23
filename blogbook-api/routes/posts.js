import express from "express";
import { 
    getBlogEntries, 
    getBlogCategories,
    getBlogEntry, 
    postBlogEntry, 
    deleteBlogEntry,
    updateBlogEntry
} from "../controllers/posts.js"

const router = express.Router();

router.get("/blogEntries", getBlogEntries);
router.get("/blogCategories", getBlogCategories);
router.get("/blogEntry/:id", getBlogEntry);
router.post("/", postBlogEntry);
router.delete("/:id", deleteBlogEntry);
router.put("/", updateBlogEntry);

export default router;