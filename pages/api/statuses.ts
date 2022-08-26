// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { statusesDatabase } from '../../server/sheetDatabase';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // load schema and data from google spreadsheet
  await statusesDatabase.load();

  // find all documents
  const docs = await statusesDatabase.find({});
  res.status(200).json(docs as any);
};

export default handler;
