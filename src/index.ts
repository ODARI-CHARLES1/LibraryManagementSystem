
import  express from "express";
import { getpool } from './config/database';
import commentRoutes from "./router/comments.Routes";

const app = express()
app.use(express.json())

app.get("/", (req, res) => {
    res.send("Hello, the express server is running")
})

const port = 8081
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
}
)
app.use('/api',commentRoutes);

getpool()
.then(() => console.log("Database connected successfully"))
.catch((err: any) => console.error("Database connection failed", err))
