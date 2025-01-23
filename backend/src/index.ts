import express from "express"

const port = 3000;

const app = express();

app.get("/", (req,res) => {
    res.send("Hello from backend")    
});

app.listen(port, () => {
    console.log(`App running on port = ${port}`);
    
})