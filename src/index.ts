import express, { Express } from 'express'
import dotenv from 'dotenv'
import accountsRouter from './routes/getAccounts'

// TODO:
// Add .env.example file
// Add .env file to gitignore
// Routes:
// Usefule routes for the API are:
// - /accounts
// - /accounts/:accountNumber
// - /transactions

// Initialise express

dotenv.config()
const app: Express = express()
app.use(express.urlencoded({ extended: true }))
const port = process.env.PORT || 3000

app.use('/getaccounts', accountsRouter)
// Lists all accounts. Optional body parameter for filtering: accountNumber

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`)
})
