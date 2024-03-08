import express from "express";

const app = express();

app.get("/", (req, res) => res.send("This is a test page"));

app.listen(3000, () => console.log("Listening on port 3000"));
