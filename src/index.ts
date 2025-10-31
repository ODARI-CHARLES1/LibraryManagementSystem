import  express from "express";
import { getPool } from "./config/database.js";
import userRouter from "./router/user.routes.js";
import borrowRouter from "./router/borrowrecords.Routes.js";
const app = express()
app.use(express.json())

app.use("/api",userRouter)
app.use("/api",borrowRouter)

app.get("/", (req, res) => {
    res.send("Hello, the express server is running")
})

const port = 3000
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})
const pool= getPool()
pool.then(pool=>{
    console.log("Database Connected Successfully")
})
.catch(err=>{
    console.log("Failed to connect to DB",err)
})










