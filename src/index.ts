import express, { Express } from 'express'
import dotenv from 'dotenv'
import { config } from './config'
import accountsRouter from './api/v1/accounts'

// Initialise express

dotenv.config()
const app: Express = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

if (!process.env.PORT) {
  console.error('Missing environment variable: PORT')
  process.exit(1)
}

const port = process.env.PORT || 3000

app.use(`/api/${config.apiVersion}/accounts`, accountsRouter)

app.get('/*', function (req, res) {
  res.sendFile('index.html', { root: __dirname })
})

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`)
  })
} else {
  console.log(`[server]: Server is running in TEST mode`)
}

module.exports = app
