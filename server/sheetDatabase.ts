import path from 'path';
import Database from './sheetsql-copy';

type SheetNames = 'data' | 'statuses';

export const getSheetDatabase = (sheetName: SheetNames) => {
  return new Database({
    db: '1G3qRF1ijyU3yDs0fn9LFvjuuHOvYqqTLjLs2D95kXB0',
    table: sheetName, // optional, default = Sheet1
    keyFile: path.join(process.cwd(), 'scan-a-tree-e603d426671c.json'),
    cacheTimeoutMs: 5000, // optional, default = 5000
  });
};

export const statusesDatabase = getSheetDatabase('statuses');
export const dataDatabase = getSheetDatabase('data');
