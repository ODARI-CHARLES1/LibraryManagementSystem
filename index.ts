import  express from "express";
import { getPool } from "./src/config/database";
import userRouter from "./src/router/user.routes";
import borrowRouter from "./src/router/borrowrecords.Routes";
import categoriesRouter from './src/router/categories.Routes';
import booksRouter from './src/router/books.Routes';
import commentsRouter from './src/router/comments.Routes';
import { rateLimiterMiddleware } from "./src/Middlewares/rateLimiter";
import cors from 'cors'

const app = express()
app.use(express.json())
app.use(cors({
    origin:"https://librarymanagementsystem-7.onrender.com",
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
