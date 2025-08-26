import mongoose, { Document, Schema } from 'mongoose';

export interface ISubject extends Document {
  _id: string;
  title: string;
  orderIndex: number;
  slidesAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

//TODO Consider rename topic
const SubjectSchema = new Schema<ISubject>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slidesAmount: {
    type: Number,
    required: true,
    default: 0
  },
  orderIndex: { type: Number, required: true },

}, {
  timestamps: true
});

SubjectSchema.index({ reportId: 1, orderIndex: 1 }, { unique: true });

export default mongoose.model<ISubject>('Subject', SubjectSchema);