import {
  UploadApiOptions,
  UploadApiResponse,
  v2 as cloudinary,
} from 'cloudinary';

export class CloudinaryService {
  async upload(
    image: string,
    options: UploadApiOptions = {},
  ): Promise<UploadApiResponse> {
    const result = await cloudinary.uploader.upload(image, options);
    return result;
  }

  async upload_stream(
    data: ReadableStream<Uint8Array>,
    options: UploadApiOptions = {},
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        options,
        (error: any, result: any) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        },
      );
      //@ts-ignore
      data.pipe(uploadStream as any);
    });
  }
}

export const cloudinaryService = new CloudinaryService();
