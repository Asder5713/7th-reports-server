import Subject, { ISubject } from '../models/Subject';
import Slide from '../models/Slide';

export class SubjectService {
  // Get all subjects
  static async getAllSubjects(): Promise<ISubject[]> {
    return await Subject.find()
      .select('-__v')
      .sort({ index: 1, createdAt: -1 });
  }

  // Get subject by ID
  static async getSubjectById(id: string): Promise<ISubject | null> {
    return await Subject.findById(id)
      .select('-__v');
  }

  // Create new subject
  static async createSubject(subjectData: Partial<ISubject>): Promise<ISubject> {
    const subject = new Subject({
      subjectName: subjectData.subjectName,
      inReport: subjectData.inReport,
      index: subjectData.index
    });

    const savedSubject = await subject.save();
    const populatedSubject = await Subject.findById(savedSubject._id)
      .select('-__v');

    return populatedSubject!;
  }

  // Update subject
  static async updateSubject(id: string, updateData: Partial<ISubject>): Promise<ISubject | null> {
    return await Subject.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
      .select('-__v');
  }

  // Delete subject
  static async deleteSubject(id: string): Promise<ISubject | null> {
    return await Subject.findByIdAndDelete(id);
  }

  // Get subjects by report
  static async getSubjectsByReport(reportId: string): Promise<ISubject[]> {
    return await Subject.find({ inReport: reportId })
      .select('-__v')
      .sort({ index: 1 });
  }

  // Get slides for a specific subject
  static async getSlidesForSubject(subjectId: string): Promise<any[]> {
    return await Slide.find({ inSubject: subjectId })
      .select('-__v')
      .sort({ index: 1 });
  }
}

