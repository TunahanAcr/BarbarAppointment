import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose'; // Mongoosedan gelen standart Document yapısı
import * as mongoose from 'mongoose'; // Mongoose kütüphanesini içe aktar

export type UserDocument = User & Document; // TS için tip tanımlaması // UserDocument, User şemasını ve Mongoose Document özelliklerini içerir

@Schema({ timestamps: true }) // creaatedAt ve updatedAt alanlarını otomatik ekler
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Barber' }] })
  favorites: mongoose.Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
