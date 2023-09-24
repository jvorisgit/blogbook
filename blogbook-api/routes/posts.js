import express from "express";
import { 
    getBlogEntries, 
    getBlogCategories,
    getBlogEntry, 
    postBlogEntry, 
    deleteBlogEntry,
    updateBlogEntry,
    getBlogEntryDrafts
} from "../controllers/posts.js"

const router = express.Router();

router.get("/blogEntries/", getBlogEntries);
router.get("/blogEntries/drafts", getBlogEntryDrafts);
router.get("/blogEntries/:id", getBlogEntries);
router.get("/blogCategories", getBlogCategories);
router.get("/blogEntry/:id", getBlogEntry);
router.post("/", postBlogEntry);
router.put("/:id", updateBlogEntry);
router.delete("/:id", deleteBlogEntry);

export default router;
