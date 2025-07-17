import { google } from 'googleapis'
import { JWT } from 'google-auth-library'
import credentials from './credentials.json'

export async function appendToSheet(data: unknown[]) {
  const auth = new JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })

  const sheets = google.sheets({ version: 'v4', auth })

  const spreadsheetId = process.env.SHEET_ID;
  const range = 'A1'

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range,
    valueInputOption: 'RAW',
    insertDataOption: 'INSERT_ROWS',
    requestBody: {
      values: [data],
    },
  })
}