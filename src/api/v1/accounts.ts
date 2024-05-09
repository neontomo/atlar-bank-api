import express from 'express'
import { Request, Response } from 'express'
import { loadFileToJSON } from '../../fileUtils'
import { Statement } from '../../types'
import { AccountNew, TransactionNew } from '../../types'

const router = express.Router()

/* ROUTES:
 * GET /api/v1/accounts
 * GET /api/v1/accounts/:accountNumber
 * GET /api/v1/accounts/:accountNumber/transactions
 * PATCH /api/v1/accounts/:accountNumber
 * DELETE /api/v1/accounts/:accountNumber
 */

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

// GET /api/v1/accounts & GET /api/v1/accounts/:accountNumber
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
    return res.status(500).send({ message: `Error: ${error}` })
  }
})

// GET /api/v1/accounts/:accountNumber/transactions
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
      return res.status(500).send({ message: `Error: ${error}` })
    }
  }
)

// PATCH /api/v1/accounts/:accountNumber
router.patch('/:accountNumber?', async (req: Request, res: Response) => {
  const { accountNumber } = req.params
  const { currency, ownerName, balanceAmount, balanceCurrency, balanceDate } =
    req.body

  if (!accountNumber) {
    return res
      .status(400)
      .send({ message: 'Error: Account number is required' })
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
      const newAccountData = {
        ...accountData,
        currency: currency || accountData.currency,
        ownerName: ownerName || accountData.ownerName,
        balance: {
          amount: balanceAmount || accountData?.balance?.amount || null,
          currency: balanceCurrency || accountData?.balance?.currency || null,
          date: balanceDate || accountData?.balance?.date || null
        }
      }
      accountDataArray.push(newAccountData)
    })

    if (!accountDataArray.length) {
      return res.status(404).send({ message: 'Error: Account not found' })
    }
    return res.send(accountDataArray)
  } catch (error) {
    console.error(`[server error]: ${error}`)
    return res.status(500).send({ message: `Error: ${error}` })
  }
})

// DELETE /api/v1/accounts/:accountNumber
router.delete('/:accountNumber?', async (req: Request, res: Response) => {
  const { accountNumber } = req.params

  if (!accountNumber) {
    return res
      .status(400)
      .send({ message: 'Error: Account number is required' })
  }

  try {
    const file = await loadFileToJSON()
    const statements = file?.Document?.BkToCstmrStmt?.[0]?.Stmt as Statement[]
    let deletedAccount = false

    statements?.forEach((statement) => {
      const accountData = getAccountDataFromStatement(statement) as AccountNew

      if (accountNumber && accountNumber === accountData.accountNumber) {
        deletedAccount = true
      }
    })

    if (!deletedAccount) {
      return res.status(404).send({ message: 'Error: Account not found' })
    }

    return res.send({
      message: `Account with account number ${accountNumber} has been deleted`,
      accountNumber,
      deleted: true
    })
  } catch (error) {
    console.error(`[server error]: ${error}`)
    return res.status(500).send({ message: `Error: ${error}` })
  }
})

export default router
