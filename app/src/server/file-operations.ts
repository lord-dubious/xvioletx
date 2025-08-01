import type { S3Client } from '@aws-sdk/client-s3';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { File } from 'wasp/entities';
import { createPresignedUrl, confirmUpload as confirmUploadAction, deleteFile as deleteFileAction } from 'wasp/server/operations';

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

interface S3UploadParams {
  fileName: string;
  contentType: string;
  userId: string;
}

interface ConfirmUploadParams {
  fileName: string;
  fileSize: number;
  contentType: string;
  userId: string;
}

const bucketName = process.env.AWS_S3_BUCKET_NAME || 'xtasker-uploads';

export const generatePresignedUrl: createPresignedUrl<{
  fileName: string;
  contentType: string;
}, { url: string; key: string }> = async ({ fileName, contentType }, context) => {
  if (!context.user) {
    throw new Error('User not authenticated');
  }

  const fileExtension = fileName.split('.').pop()?.toLowerCase();
  const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx', 'txt', 'csv'];
  
  if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
    throw new Error('Invalid file type');
  }

  const maxFileSize = 10 * 1024 * 1024; // 10MB
  const key = `uploads/${context.user.id}/${Date.now()}-${fileName}`;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    ContentType: contentType,
    ACL: 'private',
    Metadata: {
      'user-id': context.user.id,
      'original-filename': fileName,
    },
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

  return { url, key };
};

export const confirmUpload: confirmUploadAction<ConfirmUploadParams, File> = async ({
  fileName,
  fileSize,
  contentType,
  key,
  taskId
}, context) => {
  if (!context.user) {
    throw new Error('User not authenticated');
  }

  const file = await context.entities.File.create({
    data: {
      filename: fileName,
      key,
      contentType,
      size: fileSize,
      url: `https://${bucketName}.s3.amazonaws.com/${key}`,
      user: {
        connect: { id: context.user.id }
      },
      taskId: taskId || null,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  });

  return file;
};

export const deleteFile: deleteFileAction<{ key: string }, boolean> = async ({ key }, context) => {
  if (!context.user) {
    throw new Error('User not authenticated');
  }

  const file = await context.entities.File.findFirst({
    where: {
      key,
      user: { id: context.user.id }
    }
  });

  if (!file) {
    throw new Error('File not found or access denied');
  }

  await s3Client.send(new DeleteObjectCommand({
    Bucket: bucketName,
    Key: key,
  }));

  await context.entities.File.delete({
    where: { id: file.id }
  });

  return true;
};

export const getUserFiles: getUserFiles<void, File[]> = async (_, context) => {
  if (!context.user) {
    throw new Error('User not authenticated');
  }

  return await context.entities.File.findMany({
    where: { user: { id: context.user.id } },
    orderBy: { createdAt: 'desc' }
  });
};

export const getTaskFiles: getTaskFiles<{ taskId: string }, File[]> = async ({ taskId }, context) => {
  if (!context.user) {
    throw new Error('User not authenticated');
  }

  return await context.entities.File.findMany({
    where: {
      taskId,
      user: { id: context.user.id }
    },
    orderBy: { createdAt: 'desc' }
  });
};