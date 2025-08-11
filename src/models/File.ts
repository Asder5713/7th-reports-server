import mongoose, { Document, Schema } from 'mongoose';

export interface IFile extends Document {
  _id: string;
  fileKey: string;
  mimeType: string;
  createdAt: Date;
  updatedAt: Date;
}

const FileSchema = new Schema<IFile>({
  fileKey: {
    type: String,
    required: true,
    trim: true
  },
  mimeType: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

export default mongoose.model<IFile>('File', FileSchema); 