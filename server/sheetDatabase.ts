import { google } from 'googleapis';
import Database from './sheetsql-copy';

type SheetNames = 'data' | 'statuses' | 'computedFields';
const GS_CREDENTIALS_STRING = process.env.GS_CREDENTIALS;
if (!GS_CREDENTIALS_STRING) {
  throw Error('No GS_CREDENTIALS received');
}

const GS_CREDENTIALS = JSON.parse(GS_CREDENTIALS_STRING);

export const getSheetDatabase = (sheetName: SheetNames) => {
  const auth = new google.auth.GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    credentials: GS_CREDENTIALS,
  });
  return new Database({
    db: '1G3qRF1ijyU3yDs0fn9LFvjuuHOvYqqTLjLs2D95kXB0',
    table: sheetName, // optional, default = Sheet1
    auth: auth,
    cacheTimeoutMs: 5000, // optional, default = 5000
  });
};

export const statusesDatabase = getSheetDatabase('statuses');
export const computedFieldsDatabase = getSheetDatabase('computedFields');
export const dataDatabase = getSheetDatabase('data');
