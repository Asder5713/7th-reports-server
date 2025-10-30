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
      .populate('image')
      .select('_id name description unit image')
      .sort({ position: 1 });
  }

  // Get report by ID
  static async getReportById(id: string): Promise<IReport | null> {
    return await Report.findById(id)
      .populate('image')
      .select('_id name description unit image');
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
      .select('_id reportName reportDescription reportImage');

    return populatedReport!;
  }

  // Update report
  static async updateReport(id: string, updateData: Partial<IReport>): Promise<IReport | null> {
    return await Report.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('image')
      .select('_id name description unit image');
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

  static async getInitialReportData(id: string): Promise<{
    topics: ITopic[];
    slides: ISlide[][];
  } | null> {
    try {
      // Query 1: Get all topics for the report using existing service method
      const topics = await TopicService.getTopicsByReport(id);

      if (topics.length === 0) {
        return null;
      }

      const topicIds = topics.map(topic => topic._id);

      // Use aggregation with $facet to apply different limits per topic efficiently
      const slidesResult = await SlideService.getSlidesForInitialFetch(topicIds);

      // Create a map for quick lookup
      const slidesMap = new Map();
      slidesResult.forEach((item: any) => {
        slidesMap.set(item.topicId.toString(), item.slides);
      });

      // Build the final slides array maintaining topic order
      const slides = topics.map(topic =>
        slidesMap.get(topic._id.toString()) || []
      );

      await Promise.all(slides.map(slide => slide.resolveFiles()));

      return {
        topics,
        slides
      };
    } catch (error) {
      throw new Error(`Failed to get initial report data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

