import { Request, Response } from 'express';
import { TopicService } from '../services/topicService';
import { ITopic } from '../models/Topic';

export class topicController {
  // GET all topics
  static async getAllTopics(req: Request, res: Response): Promise<void> {
    try {
      const topics = await TopicService.getAllTopics();
      res.json({
        success: true,
        data: topics,
        count: topics.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch topics',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // GET topic by ID
  static async getTopicById(req: Request, res: Response): Promise<void> {
    try {
      const topic = await TopicService.getTopicById(req.params.id);
      if (!topic) {
        res.status(404).json({
          success: false,
          error: 'Topic not found'
        });
        return;
      }
      
      res.json({
        success: true,
        data: topic
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch topic',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // POST create new topic
  static async createTopic(req: Request, res: Response): Promise<void> {
    try {
      const { topicName, inReport } = req.body;

      // Validate required fields
      if (!topicName || !inReport) {
        res.status(400).json({
          success: false,
          error: 'Topic name and inReport are required'
        });
        return;
      }

      const topic = await TopicService.createTopic({ topicName, inReport });
      res.status(201).json({
        success: true,
        data: topic
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to create topic',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // PUT update topic
  static async updateTopic(req: Request, res: Response): Promise<void> {
    try {
      const { topicName, inReport, position } = req.body;
      const updateData: Partial<ITopic> = {};

      if (topicName) updateData.topicName = topicName;
      if (inReport) updateData.inReport = inReport;
      if (position !== undefined) updateData.position = position;

      const topic = await TopicService.updateTopic(req.params.id, updateData);
      if (!topic) {
        res.status(404).json({
          success: false,
          error: 'Topic not found'
        });
        return;
      }

      res.json({
        success: true,
        data: topic
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to update topic',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // DELETE topic
  static async deleteTopic(req: Request, res: Response): Promise<void> {
    try {
      const topic = await TopicService.deleteTopic(req.params.id);
      if (!topic) {
        res.status(404).json({
          success: false,
          error: 'Topic not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Topic deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to delete topic',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // GET topics by report
  static async getTopicsByReport(req: Request, res: Response): Promise<void> {
    try {
      const { reportId } = req.params;
      const topics = await TopicService.getTopicsByReport(reportId);
      
      res.json({
        success: true,
        data: topics,
        count: topics.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch topics by report',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}

