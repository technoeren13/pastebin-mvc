import express, { Request, Response } from 'express'
import path from 'path'
import * as pageRoutes from './manager/pageRoutes'
import logger from './utils/logger'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
dotenv.config()

import connectDB from './utils/connectDatabase'

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, '/public')))

//pages
app.get('/', pageRoutes.indexPage)
app.post('/', pageRoutes.indexPost)


app.get('/edit/:code', pageRoutes.editTextPage)
app.post('/edit/:code', pageRoutes.editTextPagePost)

app.get('/text/:code/', pageRoutes.textPage)


app.get('*', pageRoutes.error404)


app.listen(3000, async () => {
    await connectDB()
    logger.info('Project Running')
})
