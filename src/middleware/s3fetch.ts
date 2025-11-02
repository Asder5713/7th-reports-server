import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3 } from '../config/s3';

export const fetchS3File = async (fileKey: string) => {
  const S3_BUCKET = process.env.S3_BUCKET!;
  const command = new GetObjectCommand({
    Bucket: S3_BUCKET,
    Key: fileKey
  });
  const url = await getSignedUrl(s3, command, {
    expiresIn: +process.env.SIGNED_URL_EXPIRATION_TIME!
  });
  return url;
};
