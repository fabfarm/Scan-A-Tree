import type { NextApiRequest, NextApiResponse } from 'next';
import { dataDatabase } from '../../../../server/sheetDatabase';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // load schema and data from google spreadsheet
  await dataDatabase.load();
  const dataId = req.query.dataId;

  if (req.method === 'GET') {
    const items = await dataDatabase.find({ id: dataId });
    res.json(items?.[0] || { error: 'Not found' });
    return;
  } else if (req.method === 'POST') {
    const updateFields = req.body as Record<string, string>;
    const updatedItem = await dataDatabase.updateOne(
      { id: dataId },
      updateFields,
    );
    res.json(updatedItem || { error: 'Not found' });
    return;
  }

  res.json({ error: 'Method not handled' });
};

export default handler;
