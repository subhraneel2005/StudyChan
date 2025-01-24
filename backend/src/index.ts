import express from "express"
import { router } from "./routes";

const port = 3000;

const app = express();
app.use(express.json());

app.use("/api", router,);

app.listen(port, () => {
    console.log(`App running on port = ${port}`);
    
})