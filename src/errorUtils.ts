import { Response } from 'express'

export function createResponseMessage(
  status: number,
  res: Response,
  message?: string | Error | unknown
) {
  const responseTypes = {
    400: 'Bad Request',
    404: 'Not Found',
    500: 'Internal Server Error',
    501: 'Not Implemented',
    200: 'OK - Success'
  } as Record<number, string>

  const responseMessage = message
    ? `${responseTypes[status]} - ${message}`
    : responseTypes[status]

  console.log(`[server error] ${status}: ${responseMessage}`)

  if (!responseTypes[status]) {
    return res
      .status(500)
      .send({ message: `${responseTypes[500]} ${responseMessage}` })
  }

  return res.status(status).send({
    message: responseMessage
  })
}
