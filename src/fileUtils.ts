import fs from 'fs'
import * as xml2js from 'xml2js'
import { BankStatement, validFileTypes } from './types'
import dotenv from 'dotenv'

dotenv.config()
const dbFileName = process.env.DB_FILE_NAME

export const readFileAsString = (filePath: string): string | undefined => {
  try {
    const data = fs.readFileSync(filePath, 'utf8')
    return data
  } catch (error) {
    console.error(`[server error]: ${error}`)
    return undefined
  }
}

export function xmlToJson(xml: string): Promise<BankStatement> {
  return new Promise((resolve, reject) => {
    xml2js.parseString(xml, (error: Error | null, result: BankStatement) => {
      if (error) {
        reject(error)
      } else {
        resolve(result)
      }
    })
  })
}

export const loadFileToJSON = async (): Promise<BankStatement | undefined> => {
  try {
    const method = (dbFileName?.split('.').pop() || 'xml') as validFileTypes

    console.log(`[server]: Loading file to JSON using method: ${method}`)

    const fileString = readFileAsString(dbFileName as string)
    if (!fileString) {
      return undefined
    }

    let file: BankStatement

    if (method === 'xml') {
      file = await xmlToJson(fileString)
    } else {
      file = JSON.parse(fileString)
    }

    return file
  } catch (error) {
    console.error(`[server error]: ${error}`)
    return undefined
  }
}
