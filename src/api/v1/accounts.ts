import express, { Request, Response } from 'express'
import { loadFileToJSON, getAccountDataFromStatement } from '../../fileUtils'
import { createResponseMessage } from '../../errorUtils'
import { AccountNew, TransactionNew, Statement } from '../../types'
const router = express.Router()

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

    if (accountNumber && !accountDataArray.length) {
      return createResponseMessage(404, res, 'Account not found')
    }
    return res.send(accountDataArray)
  } catch (error) {
    return createResponseMessage(500, res, error)
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

          transactionsArray.push(transactionData)
        })
      })

      if (!transactionsArray.length) {
        return createResponseMessage(404, res, 'Transactions not found')
      }

      return res.send(transactionsArray)
    } catch (error) {
      return createResponseMessage(500, res, error)
    }
  }
)

// PATCH /api/v1/accounts/:accountNumber
router.patch('/:accountNumber?', async (req: Request, res: Response) => {
  const { accountNumber } = req.params
  const { currency, ownerName, balanceAmount, balanceCurrency, balanceDate } =
    req.body

  console.log(
    `[server]: Updating account with account number: ${accountNumber}`
  )

  if (!accountNumber) {
    return createResponseMessage(400, res, 'Account number is required')
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
      return createResponseMessage(404, res, 'Account not found')
    }
    return res.send(accountDataArray)
  } catch (error) {
    return createResponseMessage(500, res, error)
  }
})

// DELETE /api/v1/accounts/:accountNumber
router.delete('/:accountNumber?', async (req: Request, res: Response) => {
  const { accountNumber } = req.params

  console.log(
    `[server]: Deleting account with account number: ${accountNumber}`
  )

  if (!accountNumber) {
    return createResponseMessage(400, res, 'Account number is required')
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
      return createResponseMessage(404, res, 'Account not found')
    }

    return res.send({
      message: `Account with account number ${accountNumber} has been deleted`,
      accountNumber,
      deleted: true
    })
  } catch (error) {
    return createResponseMessage(500, res, error)
  }
})

export default router
