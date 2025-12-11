import  express from "express";
import { getPool } from "./config/database";
import userRouter from "./router/user.routes";
import borrowRouter from "./router/borrowrecords.Routes";
import categoriesRouter from './router/categories.Routes';
import booksRouter from './router/books.Routes';
import commentsRouter from './router/comments.Routes';
import { rateLimiterMiddleware } from "./Middlewares/rateLimiter";
import cors from 'cors'

const app = express()
app.use(express.json())
app.use(cors({
    origin:"http://localhost:5173",
    methods:["POST","GET","PUT","DELETE"]
}))

app.use("/api",userRouter)
app.use("/api",borrowRouter)
app.use('/api/categories', categoriesRouter);
app.use('/api/books', booksRouter);
app.use('/api', commentsRouter);



app.get("/", (req, res) => {
    res.send("Hello, the express server is running")
})


const port = 3000
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})




getPool()
.then(() => console.log("Database connected successfully"))
.catch((err: any) => console.error("Database connection failed", err))
