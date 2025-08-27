import Topic, { ITopic } from '../models/Topic';
import { SlideService } from './slideService';

export class TopicService {
  // Get all topics
  static async getAllTopics(): Promise<ITopic[]> {
    return await Topic.find()
      .select('-__v')
      .sort({ position: 1, createdAt: -1 });
  }

  // Get topic by ID
  static async getTopicById(id: string): Promise<ITopic | null> {
    return await Topic.findById(id)
      .select('-__v');
  }

  // Create new topic
  static async createTopic(topicData: Partial<ITopic>): Promise<ITopic> {
    const topic = new Topic({
      topicName: topicData.topicName,
      inReport: topicData.inReport
    });

    const savedTopic = await topic.save();
    const populatedTopic = await Topic.findById(savedTopic._id)
      .select('-__v');

    return populatedTopic!;
  }

  // Update topic
  static async updateTopic(id: string, updateData: Partial<ITopic>): Promise<ITopic | null> {
    return await Topic.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
      .select('-__v');
  }

  // Delete topic
  static async deleteTopic(id: string): Promise<ITopic | null> {
    return await Topic.findByIdAndDelete(id);
  }

  // Get topics by report
  static async getTopicsByReport(reportId: string): Promise<ITopic[]> {
    return await Topic.find({ inReport: reportId })
      .select('-__v')
      .sort({ position: 1 })
      .lean();
  }

  // Get slides for a specific topic
  static async getSlidesForTopic(topicId: string): Promise<any[]> {
    return await SlideService.getSlidesByTopic(topicId);
  }
}

