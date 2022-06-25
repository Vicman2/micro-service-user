import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({
  timestamps: true,
  toObject: {
    virtuals: true,
  },
  toJSON: {
    virtuals: true,
  },
})
export class User {
  @Prop({ required: true, unique: true, type: String, lowercase: true })
  email: string;

  @Prop({ required: true, type: String, lowercase: true })
  firstname: string;

  @Prop({ required: true, type: String, lowercase: true })
  lastname: string;

  @Prop({ required: true, type: String })
  password: string;

  @Prop({ required: true, type: Boolean, default: false })
  isVerified: boolean;

  @Prop({ required: true, type: Boolean, default: false })
  isSubscribed: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.set('toJSON', {
  versionKey: false,

  transform(doc, ret) {
    delete ret.password;
    delete ret.__v;
    delete ret.updatedAt;
    delete ret.createdAt;
    delete ret.id;
  },
});
