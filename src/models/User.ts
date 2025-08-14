import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  rank: string;
  armyId: string; // personalNumber
  createdAt: Date;
  updatedAt: Date;
  lastVisitedSlide: mongoose.Types.ObjectId;
  passedBiases: boolean;
}

const UserSchema = new Schema<IUser>({
  rank: {
    type: String,
    required: true,
    trim: true
  },
  armyId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  lastVisitedSlide: {
    type: Schema.Types.ObjectId,
    ref: 'Slide',
    default: null
  },
  passedBiases: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.model<IUser>('User', UserSchema); 