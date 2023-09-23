import express from "express";
import { 
    getBlogEntries, 
    getBlogEntry, 
    postBlogEntry, 
    deleteBlogEntry,
    updateBlogEntry
} from "../controllers/posts.js"

const router = express.Router();

router.get("/", getBlogEntries);
router.get("/:id", getBlogEntry);
router.post("/", postBlogEntry);
router.delete("/:id", deleteBlogEntry);
router.put("/", updateBlogEntry);

export default router;