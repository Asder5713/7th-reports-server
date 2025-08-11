import mongoose, { Document, Schema } from 'mongoose';

export interface ISlide extends Document {
  _id: string;
  content: any; // Object type for flexible content
  createdAt: Date;
  updatedAt: Date;
}

const SlideSchema = new Schema<ISlide>({
  content: {
    type: Schema.Types.Mixed,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model<ISlide>('Slide', SlideSchema); 