import mongoose, { HydratedDocument, Schema, Document } from 'mongoose'

export interface User {
  _id: string
  email: string
  passwordHash: string
  role: 'user' | 'admin'
  isActive: boolean
  createdAt: Date
}

const UserSchema = new Schema<User>(
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
  }
)

export type UserDocument = HydratedDocument<User>
export const UserModel = mongoose.model<User>('User', UserSchema)
