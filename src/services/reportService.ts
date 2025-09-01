import Report, { IReport } from '../models/Report';
import { TopicService } from './topicService';
import { SlideService } from './slideService';
import { ITopic } from '../models/Topic';
import { ISlide } from '../models/Slide';
import mongoose from 'mongoose';

export class ReportService {
  // Get all reports
  static async getAllReports(): Promise<IReport[]> {
    return await Report.find()
      .populate('reportImage')
      .select('-__v')
      .sort({ position: 1, createdAt: -1 });
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
      position: reportData.position
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


  // Get topics for a specific report
  static async getTopicsForReport(reportId: string): Promise<any[]> {
    return await TopicService.getTopicsByReport(reportId);
  }

  // Create complete report with topics and slides
  static async createCompleteReport(reportData: {
    report: Partial<IReport>;
    topics: Array<{
      topic: Partial<ITopic>;
      slides: Partial<ISlide>[];
    }>;
  }): Promise<IReport> {
    // Create the report first
    const report = new Report(reportData.report);
    const savedReport = await report.save();

    // Create topics and slides using their respective services
    for (const topicData of reportData.topics) {
      const savedTopic = await TopicService.createTopic({
        ...topicData.topic,
        inReport: new mongoose.Types.ObjectId(savedReport._id),
      });

      // Create slides for this topic
      for (const slideData of topicData.slides) {
        await SlideService.createSlide({
          ...slideData,
          inTopic: new mongoose.Types.ObjectId(savedTopic._id),
        });
      }
    }

    return savedReport;
  }

  static async getInitialReportData(id: string): Promise<any> {
    
  }
}

