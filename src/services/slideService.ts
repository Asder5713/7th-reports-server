import Slide, { ISlide } from '../models/Slide';
import Subject from '../models/Subject';

export class SlideService {
  // Get all slides
  static async getAllSlides(): Promise<ISlide[]> {
    return await Slide.find()
      .select('-__v')
      .sort({ index: 1, createdAt: -1 });
  }

  // Get slide by ID
  static async getSlideById(id: string): Promise<ISlide | null> {
    return await Slide.findById(id)
      .select('-__v');
  }

  // Create new slide
  static async createSlide(slideData: Partial<ISlide>): Promise<ISlide> {
    const slide = new Slide({
      content: slideData.content,
      inSubject: slideData.inSubject,
      index: slideData.index
    });

    return await slide.save();
  }

  // Update slide
  static async updateSlide(id: string, updateData: Partial<ISlide>): Promise<ISlide | null> {
    return await Slide.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
      .select('-__v');
  }

  // Delete slide
  static async deleteSlide(id: string): Promise<ISlide | null> {
    return await Slide.findByIdAndDelete(id);
  }

  // Get slides by subject
  static async getSlidesBySubject(subjectId: string): Promise<ISlide[]> {
    return await Slide.find({ inSubject: subjectId })
      .select('-__v')
      .sort({ index: 1 });
  }

  // Get subject for a specific slide
  static async getSubjectForSlide(slideId: string): Promise<any> {
    return await Slide.findById(slideId)
      .select('-__v');
  }
}

