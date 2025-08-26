import mongoose, { Document, Schema } from 'mongoose';

export interface ISlide extends Document {
  _id: string;
  content: any; // Object type for flexible content
  position: number;
  title?: string;
  contentUrl: string
  createdAt: Date;
  updatedAt: Date;
}

const SlideSchema = new Schema<ISlide>({
  content: {
    type: Schema.Types.Mixed,
    required: true
  },
  title: {
    type: String
  },
  position: { type: Number, required: true },
}, {
  timestamps: true
});

export default mongoose.model<ISlide>('Slide', SlideSchema);