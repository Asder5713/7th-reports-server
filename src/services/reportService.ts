import Report, { IReport } from '../models/Report';
import Subject from '../models/Subject';

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
    return await Subject.find({ inReport: reportId })
      .select('-__v')
      .sort({ index: 1 });
  }
}

