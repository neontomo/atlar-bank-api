import express from 'express'
import { Request, Response } from 'express'
import { loadFileToJSON } from '../fileUtils'
import { Account, Balance } from '../types'

const router = express.Router()

router.get('/', async (req: Request, res: Response) => {
  const requestAccountNumber = req.body?.accountNumber?.trim()
  if (requestAccountNumber) {
    console.log(
      `[server]: Searching for account info on account number: ${requestAccountNumber}`
    )
  }

  try {
    const file = await loadFileToJSON()

    const bankToCustomerStatements = file?.Document.BkToCstmrStmt || []

    let accountDataArray = [] as Account[]

    bankToCustomerStatements.forEach((element) => {
      const statements = element.Stmt || []

      statements.forEach((statement) => {
        if (!statement.Acct) {
          return
        }

        const account = statement?.Acct?.[0]
        const balance = statement?.Bal?.[0]
        const balanceAmount = balance?.Amt?.[0]
        const accountNumber = account?.Id?.[0]?.Othr?.[0]?.Id?.[0] || null

        if (requestAccountNumber && accountNumber !== requestAccountNumber) {
          return
        }

        const accountData = {
          accountNumber,
          currency: account?.Ccy[0] || null,
          ownerName: account?.Ownr[0]?.Nm[0] || null,
          balance: {
            amount: balanceAmount?._ || null,
            currency: balanceAmount?.['$']?.Ccy || null,
            date: balance?.Dt?.[0]?.Dt?.[0] || null
          }
        } as Account

        accountDataArray.push(accountData)
      })
    })

    res.send(accountDataArray)
  } catch (error) {
    console.error(`[server error]: ${error}`)
    res.send(`Error: ${error}`)
  }
})

export default router
