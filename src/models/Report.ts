import mongoose, { Document, Schema } from 'mongoose';

export interface IReport extends Document {
  _id: string;
  reportName: string;
  reportDescription: string;
  subjectsArray: mongoose.Types.ObjectId[];
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
  subjectsArray: [{
    type: Schema.Types.ObjectId,
    ref: 'Subject'
  }]
}, {
  timestamps: true
});

export default mongoose.model<IReport>('Report', ReportSchema); 