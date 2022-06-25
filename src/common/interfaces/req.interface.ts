import { Request } from 'express';
import { Types } from 'mongoose';
import { UserDocument } from 'src/user/schema/user.schema';

export interface AuthRequest extends Request {
  user?: UserDocument;
}
