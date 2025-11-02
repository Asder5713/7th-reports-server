import mongoose, { Document, Schema } from 'mongoose';

export interface ICognitiveAnswers extends Document {
  _id: mongoose.Types.ObjectId;
  // userId: mongoose.Types.ObjectId;
  // subjectId: mongoose.Types.ObjectId;
  // slideId: mongoose.Types.ObjectId;
  // question: string;
  // answer: string;
  // confidence: number; // 1-5 scale
  // timeSpent: number; // in seconds
  // isCorrect: boolean;
  // createdAt: Date;
  // updatedAt: Date;
}

const CognitiveAnswersSchema = new Schema<ICognitiveAnswers>({
//   userId: {
//     type: Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   subjectId: {
//     type: Schema.Types.ObjectId,
//     ref: 'Subject',
//     required: true
//   },
//   slideId: {
//     type: Schema.Types.ObjectId,
//     ref: 'Slide',
//     required: true
//   },
//   question: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   answer: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   confidence: {
//     type: Number,
//     required: true,
//     min: 1,
//     max: 5
//   },
//   timeSpent: {
//     type: Number,
//     required: true,
//     min: 0
//   },
//   isCorrect: {
//     type: Boolean,
//     required: true
//   }
// }, {
//   timestamps: true
// 
});

// Index for efficient querying
// CognitiveAnswersSchema.index({ userId: 1, subjectId: 1, slideId: 1 });

export default mongoose.model<ICognitiveAnswers>('CognitiveAnswers', CognitiveAnswersSchema); 