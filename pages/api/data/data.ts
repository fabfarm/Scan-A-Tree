// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { dataDatabase } from '../../../server/sheetDatabase';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // load schema and data from google spreadsheet
  await dataDatabase.load();

  // find all documents
  const docs = await dataDatabase.find({});
  res.status(200).json(docs as any);
};

export default handler;
