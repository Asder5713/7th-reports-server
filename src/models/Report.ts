import mongoose, { Document, Schema } from 'mongoose';
import File from './File';
import { fetchS3File } from '../middleware/s3fetch';

export interface IReport extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  image?: mongoose.Types.ObjectId;
  unit: string;
  position?: number;
  createdAt: Date;
  updatedAt: Date;
  resolveFiles: () => Promise<void>;
}

const ReportSchema = new Schema<IReport>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    unit: {
      type: String,
      required: true
    },
    image: {
      type: Schema.Types.ObjectId,
      ref: 'File'
    },
    position: {
      type: Number
    }
  },
  {
    timestamps: true
  }
);

ReportSchema.methods.resolveFiles = async function () {
  if (this.image) {
    const file =
      typeof this.image === 'object'
        ? this.image
        : await File.findById(this.image);
    if (!file) return;
    const url = await fetchS3File(file.fileKey);
    this.image = url;
  }
};

export default mongoose.model<IReport>('Report', ReportSchema);
