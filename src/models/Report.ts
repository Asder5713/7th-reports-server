import mongoose, { Document, Schema } from 'mongoose';

export interface IReport extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  image?: mongoose.Types.ObjectId;
  unit: string;
  position?: number;
  createdAt: Date;
  updatedAt: Date;
}

const ReportSchema = new Schema<IReport>({
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
}, {
  timestamps: true
});

export default mongoose.model<IReport>('Report', ReportSchema); 