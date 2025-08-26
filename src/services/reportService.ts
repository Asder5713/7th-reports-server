import Report, { IReport } from '../models/Report';
import { SubjectService } from './subjectService';
import { SlideService } from './slideService';
import { ISubject } from '../models/Subject';
import { ISlide } from '../models/Slide';
import mongoose from 'mongoose';

export class ReportService {
  // Get all reports
  static async getAllReports(): Promise<IReport[]> {
    return await Report.find()
      .populate('reportImage')
      .select('-__v')
      .sort({ index: 1, createdAt: -1 });
  }

  // Get report by ID
  static async getReportById(id: string): Promise<IReport | null> {
    return await Report.findById(id)
      .populate('reportImage')
      .select('-__v');
  }

  // Create new report
  static async createReport(reportData: Partial<IReport>): Promise<IReport> {
    const report = new Report({
      reportName: reportData.reportName,
      reportDescription: reportData.reportDescription,
      reportImage: reportData.reportImage,
      index: reportData.index
    });

    const savedReport = await report.save();
    const populatedReport = await Report.findById(savedReport._id)
      .populate('reportImage')
      .select('-__v');

    return populatedReport!;
  }

  // Update report
  static async updateReport(id: string, updateData: Partial<IReport>): Promise<IReport | null> {
    return await Report.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('reportImage')
      .select('-__v');
  }

  // Delete report
  static async deleteReport(id: string): Promise<IReport | null> {
    return await Report.findByIdAndDelete(id);
  }


  // Get subjects for a specific report
  static async getSubjectsForReport(reportId: string): Promise<any[]> {
    return await SubjectService.getSubjectsByReport(reportId);
  }

  // Create complete report with subjects and slides
  static async createCompleteReport(reportData: {
    report: Partial<IReport>;
    subjects: Array<{
      subject: Partial<ISubject>;
      slides: Partial<ISlide>[];
    }>;
  }): Promise<IReport> {
    // Create the report first
    const report = new Report(reportData.report);
    const savedReport = await report.save();

    // Create subjects and slides using their respective services
    for (const subjectData of reportData.subjects) {
      const savedSubject = await SubjectService.createSubject({
        ...subjectData.subject,
        inReport: new mongoose.Types.ObjectId(savedReport._id),
      });

      // Create slides for this subject
      for (const slideData of subjectData.slides) {
        await SlideService.createSlide({
          ...slideData,
          inSubject: new mongoose.Types.ObjectId(savedSubject._id),
        });
      }
    }

    return savedReport;
  }
}

