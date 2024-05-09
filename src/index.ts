import express, { Express } from 'express'
import dotenv from 'dotenv'
import { config } from './config'
import accountsRouter from './api/v1/accounts'

// Initialise express

dotenv.config()
const app: Express = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const port = process.env.PORT || 3000

app.use(`/api/${config.apiVersion}/accounts`, accountsRouter)

const server = app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`)
})

module.exports = app
