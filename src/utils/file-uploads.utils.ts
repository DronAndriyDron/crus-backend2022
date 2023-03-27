import { BadRequestException } from '@nestjs/common';
import { extname } from 'path';

export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(new Error('Only image files are allowed!'), false);
  }
  callback(null, true);
};

export const editFileName = (req, file, callback) => {
  const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);
  const randomName = Array(4)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  callback(null, `${name}-${randomName}${fileExtName}`);
};

export const sharpSupportedType = (mimeType: string) => {
  const fileTypes = /jpeg|png|webp|tiff/;
  return fileTypes.test(mimeType.toLowerCase());
};

export const checkIfFileAllowed = (file) => {
  const allowedTypes = ['jpeg', 'png', 'webp', 'tiff', 'gif'];
  const filter = file.originalname.split('.');
  const type = filter[filter.length - 1];
  if (!allowedTypes.includes(type)) {
    throw new BadRequestException('Only image files are allowed!');
  }
};
