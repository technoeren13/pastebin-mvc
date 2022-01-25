import express, { Request, Response } from "express";
import path from "path";
import * as pageRoutes from "./manager/pageRoutes";
import logger from "./manager/logger"
import bodyParser from "body-parser"
import dotenv from "dotenv"
dotenv.config()


import connectDB from "./manager/connectDatabase"


const app = express()


app.use(bodyParser.urlencoded({ extended: false }))
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname, '/public')));




//pages
app.get("/", pageRoutes.indexPage)
app.get("/text/:code/", pageRoutes.textPage)
app.post("/", pageRoutes.indexPost)



app.listen(3000, async () => {
    await connectDB()
    logger.info("Project Running")
})