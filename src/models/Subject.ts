import mongoose, { Document, Schema } from 'mongoose';

export interface ISubject extends Document {
  _id: string;
  subjectName: string;
  slideArray: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const SubjectSchema = new Schema<ISubject>({
  subjectName: {
    type: String,
    required: true,
    trim: true
  },
  slideArray: [{
    type: Schema.Types.ObjectId,
    ref: 'Slide'
  }]
}, {
  timestamps: true
});

export default mongoose.model<ISubject>('Subject', SubjectSchema); 