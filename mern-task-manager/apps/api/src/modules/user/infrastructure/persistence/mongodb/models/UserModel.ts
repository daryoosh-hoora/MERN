import mongoose, { HydratedDocument, Schema, Document } from 'mongoose'

export interface IUser {
  _id: string
  email: string
  passwordHash: string
  role: 'user' | 'admin' | 'guest'
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
}

const UserSchema = new Schema<IUser>(
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
      enum: ['user', 'admin', 'guest'],
      required: true
    },
    isActive: { 
      type: Boolean, 
      default: true 
    },
    createdAt: { 
      type: Date, 
      default: Date.now 
    },
    updatedAt: { 
      type: Date, 
      default: Date.now 
    },
    deletedAt: { 
      type: Date, 
      default: null 
    }
  },
  {
    versionKey: false,
  }
)

export type UserDocument = HydratedDocument<IUser>
export const UserModel = mongoose.model<IUser>('User', UserSchema)
