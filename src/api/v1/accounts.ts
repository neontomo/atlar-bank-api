import express from 'express'
import { Request, Response } from 'express'
import { loadFileToJSON } from '../../fileUtils'
import { Statement, Account } from '../../types'
import { AccountNew, TransactionNew } from '../../types'

const router = express.Router()

function getAccountDataFromStatement(statement: Statement) {
  const account = statement?.Acct?.[0]
  const balance = statement?.Bal?.[0]

  if (!account) {
    return
  }

  const accountData = {
    accountNumber: account?.Id?.[0]?.Othr?.[0]?.Id?.[0] || null,
    currency: account?.Ccy?.[0] || null,
    ownerName: account?.Ownr?.[0]?.Nm?.[0] || null,
    balance: {
      amount: balance?.Amt?.[0]?._ || null,
      currency: balance?.Amt?.[0]?.['$']?.Ccy || null,
      date: balance?.Dt?.[0]?.Dt?.[0] || null
    }
  } as AccountNew

  return accountData
}

router.get(
  '/:accountNumber/transactions',
  async (req: Request, res: Response) => {
    const { accountNumber } = req.params
    if (accountNumber) {
      console.log(
        `[server]: Searching for transactions on account number: ${accountNumber}`
      )
    }

    try {
      const file = await loadFileToJSON()
      const statements = file?.Document?.BkToCstmrStmt?.[0]?.Stmt as Statement[]

      const transactionsArray = [] as TransactionNew[]

      statements?.forEach((statement) => {
        const paymentID = statement?.Id?.[0] as string

        statement?.Ntry?.forEach((transaction) => {
          const transactionData = {
            accountNumber:
              statement?.Acct?.[0]?.Id?.[0]?.Othr?.[0]?.Id?.[0] || null,
            entryReference: transaction?.NtryRef?.[0] || null,
            amountDetails: {
              amount: transaction?.Amt?.[0]?._ || null,
              currency: transaction?.Amt?.[0]?.['$']?.Ccy || null
            },
            currency: transaction?.Amt?.[0]?.['$']?.Ccy || null,
            bookingDate: transaction?.BookgDt?.[0]?.Dt?.[0] || null,
            credit: transaction?.CdtDbtInd?.[0] === 'CRDT',
            debit: transaction?.CdtDbtInd?.[0] === 'DBIT',
            remittanceInformation: {
              referenceInfo: {
                msgID:
                  transaction?.NtryDtls?.[0]?.TxDtls?.[0]?.Refs?.[0]
                    ?.MsgId?.[0] || null,
                accountServicerReference:
                  transaction?.NtryDtls?.[0]?.TxDtls?.[0]?.Refs?.[0]
                    ?.AcctSvcrRef?.[0] || null,
                paymentInformationID:
                  transaction?.NtryDtls?.[0]?.TxDtls?.[0]?.Refs?.[0]
                    ?.PmtInfId?.[0] || null,
                instructionID:
                  transaction?.NtryDtls?.[0]?.TxDtls?.[0]?.Refs?.[0]
                    ?.InstrId?.[0] || null,
                endToEndID:
                  transaction?.NtryDtls?.[0]?.TxDtls?.[0]?.Refs?.[0]
                    .EndToEndId?.[0] || null
              }
            }
          } as TransactionNew

          if (
            accountNumber &&
            accountNumber !== transactionData.accountNumber
          ) {
            return
          }

          console.log(transactionData)

          transactionsArray.push(transactionData)
        })
      })

      return res.send(transactionsArray)
    } catch (error) {
      console.error(`[server error]: ${error}`)
      return res.send(`Error: ${error}`)
    }
  }
)

router.get('/:accountNumber?', async (req: Request, res: Response) => {
  const { accountNumber } = req.params
  if (accountNumber) {
    console.log(
      `[server]: Searching for account info on account number: ${accountNumber}`
    )
  }

  try {
    const file = await loadFileToJSON()
    const statements = file?.Document?.BkToCstmrStmt?.[0]?.Stmt as Statement[]
    let accountDataArray = [] as AccountNew[]

    statements?.forEach((statement) => {
      const accountData = getAccountDataFromStatement(statement) as AccountNew

      if (accountNumber && accountNumber !== accountData.accountNumber) {
        return
      }
      accountDataArray.push(accountData)
    })

    return res.send(accountDataArray)
  } catch (error) {
    console.error(`[server error]: ${error}`)
    return res.send(`Error: ${error}`)
  }
})

router.patch('/:accountNumber', async (req: Request, res: Response) => {
  const { accountNumber } = req.params
  const { ownerName } = req.body

  if (!ownerName) {
    return res.status(400).send('Error: Missing ownerName in request body')
  }

  if (accountNumber) {
    console.log(
      `[server]: Updating account info on account number: ${accountNumber}`
    )
  }

  try {
    const file = await loadFileToJSON()
    const statements = file?.Document?.BkToCstmrStmt?.[0]?.Stmt as Statement[]
    let accountDataArray = [] as AccountNew[]

    statements?.forEach((statement) => {
      const accountData = getAccountDataFromStatement(statement) as AccountNew

      if (accountNumber && accountNumber !== accountData.accountNumber) {
        return
      }
      accountData.ownerName = ownerName
      accountDataArray.push(accountData)
    })

    return res.send(accountDataArray)
  } catch (error) {
    console.error(`[server error]: ${error}`)
    return res.send(`Error: ${error}`)
  }
})

export default router
