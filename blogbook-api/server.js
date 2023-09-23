import express from "express";
import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/posts.js";

const app = express();

app.use(express.json());
app.use("/auth",authRoutes);
app.use("/posts",postRoutes);

app.get('/test', (req, res) => {
    res.json("Hello World!");
});

app.listen(8000, () => {
    console.log(`Server is running on port 8000.`);
  });