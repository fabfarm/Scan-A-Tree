// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import multer from 'multer';
import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import { cloudinaryService } from '../../../server/modules/cloudinary/cloudinaryService';

type NextApiRequestWithFormData = NextApiRequest & {
  file: {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    path: string;
    size: null;
  };
};

const apiRoute = nextConnect();
const upload = multer({ dest: '/tmp' });
apiRoute.use(upload.single('file'));

apiRoute.post(async (req: NextApiRequestWithFormData, res: NextApiResponse) => {
  try {
    const result = await cloudinaryService.upload(req.file.path, {
      resource_type: 'image',
      folder: 'test',
    });
    res.json({ imageUrl: result.secure_url });
  } catch (e) {
    console.error(e);
    res.status(400).json({ e });
  }
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};
