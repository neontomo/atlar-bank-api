import express, { Express } from 'express'
import dotenv from 'dotenv'
import accountsRouter from './routes/getAccounts'

// Initialise express

dotenv.config()
const app: Express = express()
app.use(express.urlencoded({ extended: true }))
const port = process.env.PORT || 3000

app.use('/getaccounts', accountsRouter)

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`)
})
