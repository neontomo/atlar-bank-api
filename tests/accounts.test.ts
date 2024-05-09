const request = require('supertest')
const app = require('../src/index')
import { config } from '../src/config'

const testData = {
  accountNumber: '54400001111',
  ownerName: 'The Honorable Mister Ron Weasley',
  currency: 'USD',
  balanceAmount: '100000',
  balanceCurrency: 'USD',
  balanceDate: '2024-04-09'
}

describe(`GET /api/${config.apiVersion}/accounts`, () => {
  it('should get all users', async () => {
    const response = await request(app).get(
      `/api/${config.apiVersion}/accounts`
    )

    expect(response.statusCode).toBe(200)
    expect(response.body[0]).toHaveProperty('accountNumber')
    expect(response.body[0]).toHaveProperty('ownerName')

    return response
  })
})

describe(`GET /api/${config.apiVersion}/accounts/:accountNumber`, () => {
  it(`should get a single user: accountNumber = '${testData.accountNumber}'`, async () => {
    const response = await request(app).get(
      `/api/${config.apiVersion}/accounts/${testData.accountNumber}`
    )

    expect(response.statusCode).toBe(200)
    expect(response.body[0]).toHaveProperty('accountNumber')
    expect(response.body[0]).toHaveProperty('ownerName')

    return response
  })
})

describe(`PATCH /api/${config.apiVersion}/accounts/:accountNumber`, () => {
  it(`
  should update a single user with:
  ${JSON.stringify(testData, null, 2)}
`, async () => {
    const response = await request(app)
      .patch(`/api/${config.apiVersion}/accounts/${testData.accountNumber}`)
      .send(testData)

    expect(response.statusCode).toBe(200)
    expect(response.body[0]).toHaveProperty('accountNumber')
    expect(response.body[0].ownerName).toBe(testData.ownerName)
    expect(response.body[0].currency).toBe(testData.currency)
    expect(response.body[0].balance.amount).toBe(testData.balanceAmount)
    expect(response.body[0].balance.currency).toBe(testData.balanceCurrency)
    expect(response.body[0].balance.date).toBe(testData.balanceDate)

    return response
  })
})

describe(`DELETE /api/${config.apiVersion}/accounts/:accountNumber`, () => {
  it(`should delete a single user: accountNumber = '${testData.accountNumber}'`, async () => {
    const response = await request(app).delete(
      `/api/${config.apiVersion}/accounts/${testData.accountNumber}`
    )

    expect(response.statusCode).toBe(200)
    expect(response.body.deleted).toBe(true)
    expect(response.body.accountNumber).toBe(testData.accountNumber)
    expect(response.body).toHaveProperty('message')

    return response
  })
})
