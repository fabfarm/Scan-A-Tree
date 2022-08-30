import { google } from 'googleapis';
import Database from './sheetsql-copy';

type SheetNames = 'data' | 'statuses' | 'computedFields';
const GS_CREDENTIALS_STRING = process.env.GS_CREDENTIALS;
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
if (!GS_CREDENTIALS_STRING) {
  throw Error('No GS_CREDENTIALS received');
}
if (!SPREADSHEET_ID) {
  throw Error('No SPREADSHEET_ID in env variables');
}

const GS_CREDENTIALS = JSON.parse(GS_CREDENTIALS_STRING);

export const getSheetDatabase = (sheetName: SheetNames) => {
  const auth = new google.auth.GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    credentials: GS_CREDENTIALS,
  });
  return new Database({
    db: SPREADSHEET_ID,
    table: sheetName, // optional, default = Sheet1
    auth: auth,
    cacheTimeoutMs: 5000, // optional, default = 5000
  });
};

export const statusesDatabase = getSheetDatabase('statuses');
export const computedFieldsDatabase = getSheetDatabase('computedFields');
export const dataDatabase = getSheetDatabase('data');
