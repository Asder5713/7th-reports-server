import mongoose, { Document, Schema } from 'mongoose';

export interface ISubject extends Document {
  _id: string;
  subjectName: string;
  inReport: mongoose.Types.ObjectId;
  index?: number;
  createdAt: Date;
  updatedAt: Date;
}

const SubjectSchema = new Schema<ISubject>({
  subjectName: {
    type: String,
    required: true,
    trim: true
  },
  inReport: {
    type: Schema.Types.ObjectId,
    ref: 'Report'
  },
  index: {
    type: Number,
  }
}, {
  timestamps: true
});

// Add compound index to ensure unique index per report
SubjectSchema.index({ inReport: 1, index: 1 }, { unique: true });

// Pre-save middleware to auto-increment index
SubjectSchema.pre('save', async function(next) {
  // Only run this middleware if the document is new or inReport has changed
  if (this.isNew || this.isModified('inReport')) {
    if (this.inReport) {
      // Find the highest index for subjects in the same report
      const highestSubject = await Subject.findOne(
        { inReport: this.inReport },
        { index: 1 }
      ).sort({ index: -1 });
      
      // Set index to 0 if no subjects exist, otherwise increment
      this.index = highestSubject ? highestSubject.index! + 1 : 0;
    }
  }
  next();
});

const Subject = mongoose.model<ISubject>('Subject', SubjectSchema);

export default Subject;