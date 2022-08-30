// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from 'next';
import { cloudinaryService } from '../../../server/cloudinary/cloudinaryService';
import { dataDatabase } from '../../../server/sheetDatabase';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const image = req.body.image as string;
  const itemId = req.body.itemId as string;
  const fieldToUpdate = req.body.fieldToUpdate as string;
  try {
    const result = await cloudinaryService.upload(image, {
      resource_type: 'image',
      folder: process.env.CLOUDINARY_FOLDER || '_default_',
    });
    const imageSecureUrl = result.secure_url;
    await dataDatabase.updateOne(
      { id: itemId },
      { [fieldToUpdate]: imageSecureUrl },
    );
    res.json({ imageUrl: result.secure_url });
  } catch (e) {
    console.error(e);
    res.status(400).json({ e });
  }
}
