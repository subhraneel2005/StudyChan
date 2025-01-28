import express from "express"
import { router } from "./routes";
const cors = require("cors");
const port = 3000;

const app = express();
app.use(cors({
    origin: ['http://localhost:3000', 'https://form-ai-rosy.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
  }));
app.use(express.json());

app.use("/api", router,);

app.listen(port, () => {
    console.log(`App running on port = ${port}`);
    
})