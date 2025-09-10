import { env } from "@/env";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const s3 = new S3Client({
  region: "auto",
  endpoint: env.S3_ENDPOINT,
  credentials: {
    accessKeyId: env.S3_ACCESS_KEY,
    secretAccessKey: env.S3_SECRET_KEY,
  },
  forcePathStyle: true,
});

export const uploadFile = async (params: {
  bucket: string;
  key: string;
  body: Buffer;
  contentType?: string;
}) => {
  const command = new PutObjectCommand({
    Bucket: params.bucket,
    Key: params.key,
    Body: params.body,
    ContentType: params.contentType,
  });

  return s3.send(command);
};

export const generateUploadUrl = async (params: {
  bucket: string;
  key: string;
  expiresIn?: number;
}) => {
  const command = new PutObjectCommand({
    Bucket: params.bucket,
    Key: params.key,
  });

  return getSignedUrl(s3, command, { expiresIn: params.expiresIn ?? 3600 });
};

export const generateDownloadUrl = async (params: {
  bucket: string;
  key: string;
  expiresIn?: number;
}) => {
  const command = new GetObjectCommand({
    Bucket: params.bucket,
    Key: params.key,
  });

  return getSignedUrl(s3, command, { expiresIn: params.expiresIn ?? 3600 });
};

export const deleteFile = async (params: { bucket: string; key: string }) => {
  const command = new DeleteObjectCommand({
    Bucket: params.bucket,
    Key: params.key,
  });

  return s3.send(command);
};

export const listFiles = async (params: { bucket: string; prefix?: string }) => {
  const command = new ListObjectsV2Command({
    Bucket: params.bucket,
    Prefix: params.prefix,
  });

  return s3.send(command);
};
