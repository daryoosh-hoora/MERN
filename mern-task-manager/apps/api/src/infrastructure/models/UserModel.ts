import mongoose, { Schema, Document } from 'mongoose'

export interface UserDocument extends Document {
  _id: string
  email: string
  passwordHash: string
  role: 'user' | 'admin'
  isActive: Boolean
  createdAt: Date
}

const UserSchema = new Schema<UserDocument>(
  {
    _id: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      required: true
    },
    isActive: { 
      type: Boolean, 
      default: true 
    },
    createdAt: {
      type: Date,
      required: true
    }
  },
  {
    versionKey: false,
    _id: false              // prevent auto ObjectId
  }
)

export const UserModel = mongoose.model<UserDocument>('User', UserSchema)
