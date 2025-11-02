import mongoose, { Document, Schema, Types } from 'mongoose';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import File from './File';
import { s3 } from '../config/s3';

export interface ISlide extends Document {
  _id: mongoose.Types.ObjectId;
  content: any; // Object type for flexible content
  inTopic: mongoose.Types.ObjectId;
  position?: number;
  createdAt: Date;
  updatedAt: Date;
  resolveFiles: () => Promise<void>;
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
      const highestSlide = await (this.constructor as any).findOne(
        { inTopic: this.inTopic },
        { position: 1 }
      ).sort({ position: -1 });
      
      // Set position to 0 if no slides exist, otherwise increment
      this.position = highestSlide ? highestSlide.position! + 1 : 0;
    }
  }
  next();
});

SlideSchema.methods.resolveFiles = async function () {
  const S3_BUCKET = process.env.S3_BUCKET!;
  
  for (const key of Object.keys(this.content)) {
    const value = this.content[key];

    if (
      // Either an objectID
      Types.ObjectId.isValid(value) || 
      // Or already populated
      (typeof value === "object" && value?.fileKey && value?._id)
    ) {
      const fileDoc = typeof value === "object" ? value : await File.findById(value);
      if (!fileDoc) continue;

      const command = new GetObjectCommand({
        Bucket: S3_BUCKET,
        Key: fileDoc.fileKey,
      });

      const url = await getSignedUrl(s3, command, { expiresIn: +process.env.SIGNED_URL_EXPIRATION_TIME! });

      this.content[key] = {
        _id: fileDoc._id,
        mimeType: fileDoc.mimeType,
        url,
      };
    }
  }
};

const Slide = mongoose.model<ISlide>('Slide', SlideSchema);

export default Slide;