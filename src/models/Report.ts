import mongoose, { Document, Schema } from 'mongoose';

export interface IReport extends Document {
  _id: string;
  reportName: string;
  reportDescription: string;
  reportImage: mongoose.Types.ObjectId;
  position?: number;
  createdAt: Date;
  updatedAt: Date;
}

const ReportSchema = new Schema<IReport>({
  reportName: {
    type: String,
    required: true,
    trim: true
  },
  reportDescription: {
    type: String,
    trim: true
  },
  reportImage: {
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