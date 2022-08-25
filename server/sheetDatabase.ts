import Database from 'sheetsql';

type SheetNames = 'data' | 'statuses';

export const getSheetDatabase = (sheetName: SheetNames) => {
  return new Database({
    db: '1cS_Hb5uSuXZiKC-VPyNzq7Lvu3YZqIgc3D1ARK5NVHo',
    table: sheetName, // optional, default = Sheet1
    keyFile: './google-serviceaccount.json',
    cacheTimeoutMs: 5000, // optional, default = 5000
  });
};

export const statusesDatabase = getSheetDatabase('statuses');
export const dataDatabase = getSheetDatabase('data');
