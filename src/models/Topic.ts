import mongoose, { Document, Schema } from 'mongoose';

export interface ITopic extends Document {
  _id: string;
  topicName: string;
  inReport: mongoose.Types.ObjectId;
  position?: number;
  createdAt: Date;
  updatedAt: Date;
}

const TopicSchema = new Schema<ITopic>({
  topicName: {
    type: String,
    required: true,
    trim: true
  },
  inReport: {
    type: Schema.Types.ObjectId,
    ref: 'Report'
  },
  position: {
    type: Number,
  }
}, {
  timestamps: true
});

// Add compound index to ensure unique position per report
TopicSchema.index({ inReport: 1, position: 1 }, { unique: true });

// Pre-save middleware to auto-increment position
TopicSchema.pre('save', async function(next) {
  // Only run this middleware if the document is new or inReport has changed
  if (this.isNew || this.isModified('inReport')) {
    if (this.inReport) {
      // Find the highest position for topics in the same report
      const highestTopic = await Topic.findOne(
        { inReport: this.inReport },
        { position: 1 }
      ).sort({ position: -1 });
      
      // Set position to 0 if no topics exist, otherwise increment
      this.position = highestTopic ? highestTopic.position! + 1 : 0;
    }
  }
  next();
});

const Topic = mongoose.model<ITopic>('Topic', TopicSchema);

export default Topic;