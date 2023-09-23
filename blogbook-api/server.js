import express from "express";

const app = express();

app.use(express.json());

app.get('/test', (req, res) => {
    res.json("Hello World!");
});

app.listen(8000, () => {
    console.log(`Server is running on port 8000.`);
  });