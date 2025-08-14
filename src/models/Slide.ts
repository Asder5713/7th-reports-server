import mongoose, { Document, Schema } from 'mongoose';

export interface ISlide extends Document {
  _id: string;
  content: any; // Object type for flexible content
  inSubject: mongoose.Types.ObjectId;
  index?: number;
  createdAt: Date;
  updatedAt: Date;
}

const SlideSchema = new Schema<ISlide>({
  content: {
    type: Schema.Types.Mixed,
    required: true
  },
  inSubject: {
    type: Schema.Types.ObjectId,
    ref: 'Subject'
  },
  index: {
    type: Number
  }
}, {
  timestamps: true
});

// Add compound index to ensure unique index per subject
SlideSchema.index({ inSubject: 1, index: 1 }, { unique: true });

// Pre-save middleware to auto-increment index
SlideSchema.pre('save', async function(next) {
  // Only run this middleware if the document is new or inSubject has changed
  if (this.isNew || this.isModified('inSubject')) {
    if (this.inSubject) {
      // Find the highest index for slides in the same subject
      const highestSlide = await Slide.findOne(
        { inSubject: this.inSubject },
        { index: 1 }
      ).sort({ index: -1 });
      
      // Set index to 0 if no slides exist, otherwise increment
      this.index = highestSlide ? highestSlide.index! + 1 : 0;
    }
  }
  next();
});



const Slide = mongoose.model<ISlide>('Slide', SlideSchema);

export default Slide;