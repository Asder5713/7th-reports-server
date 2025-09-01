import mongoose, { Document, Schema } from 'mongoose';

export interface ISlide extends Document {
  _id: string;
  content: any; // Object type for flexible content
  inTopic: mongoose.Types.ObjectId;
  position?: number;
  createdAt: Date;
  updatedAt: Date;
}

const SlideSchema = new Schema<ISlide>({
  content: {
    type: Schema.Types.Mixed,
    required: true
  },
  inTopic: {
    type: Schema.Types.ObjectId,
    ref: 'Topic'
  },
  position: {
    type: Number
  }
}, {
  timestamps: true
});

// Add compound index to ensure unique position per topic
SlideSchema.index({ inTopic: 1, position: 1 }, { unique: true });

// Pre-save middleware to auto-increment position
SlideSchema.pre('save', async function(next) {
  // Only run this middleware if the document is new or inTopic has changed
  if (this.isNew || this.isModified('inTopic')) {
    if (this.inTopic) {
      // Find the highest position for slides in the same topic
      const highestSlide = await Slide.findOne(
        { inTopic: this.inTopic },
        { position: 1 }
      ).sort({ position: -1 });
      
      // Set position to 0 if no slides exist, otherwise increment
      this.position = highestSlide ? highestSlide.position! + 1 : 0;
    }
  }
  next();
});



const Slide = mongoose.model<ISlide>('Slide', SlideSchema);

export default Slide;