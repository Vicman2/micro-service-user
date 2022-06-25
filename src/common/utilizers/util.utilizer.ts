import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import { COMMON_CONSTANTS } from '../constants/common.constants';
import { v4 } from 'uuid';
import { UnauthorizedException } from '@nestjs/common';

export const encryptData = function (
  dataToEncrypt: object,
  expirationTime: number,
) {
  const timeToMillSec = expirationTime * 60 * 60;
  const encryptedData = jwt.sign(dataToEncrypt, COMMON_CONSTANTS().JWT_SECRET, {
    expiresIn: timeToMillSec,
  });

  return encryptedData;
};

export const decryptData = function (tokenToDecrypt: string): jwt.JwtPayload {
  try {
    const decryptedData = jwt.verify(
      tokenToDecrypt,
      COMMON_CONSTANTS().JWT_SECRET,
    );
    return decryptedData as any;
  } catch (error: any) {
    const errors = ['TokenExpiredError', 'NotBeforeError', 'JsonWebTokenError'];
    if (errors.includes(error?.name)) {
      throw new UnauthorizedException(null, 'Invalid token');
    }
  }
};

export const passwordHash = async function (
  stringToHash: string,
): Promise<string> {
  const hashedPassword = await bcrypt.hash(stringToHash, 12);
  return hashedPassword;
};

export const passwordCompare = async function (
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  const passwordMatch = await bcrypt.compare(password, hashedPassword);
  return passwordMatch;
};

export const genUID = (len = 0): string => {
  const key = `${v4()}`.split('-').join('');
  if (len !== 0) return key.slice(0, len);
  return key;
};

export const genRandomChar = (len: number): string => {
  let text = '';
  const possible =
    '123456789ABCDEFGHJKLMNP123456789QRSTUVWXYZabcdefghjkmnpqrstuvwxyz123456789';

  for (let i = 0; i < len; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text.toUpperCase();
};
