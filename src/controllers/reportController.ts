import { Request, Response } from 'express';
import { ReportService } from '../services/reportService';
import { IReport } from '../models/Report';

export class ReportController {
  // GET all reports
  static async getAllReports(req: Request, res: Response): Promise<void> {
    try {
      const reports = await ReportService.getAllReports();
      res.json({
        success: true,
        data: reports,
        count: reports.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch reports',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // GET report by ID
  static async getReportById(req: Request, res: Response): Promise<void> {
    try {
      const report = await ReportService.getReportById(req.params.id);
      if (!report) {
        res.status(404).json({
          success: false,
          error: 'Report not found'
        });
        return;
      }

      res.json({
        success: true,
        data: report
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch report',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // POST create new report
  static async createReport(req: Request, res: Response): Promise<void> {
    try {
      const { name, description, unit, position } = req.body;

      // Validate required fields
      if (!name) {
        res.status(400).json({
          success: false,
          error: 'Report name is required'
        });
        return;
      }

      const report = await ReportService.createReport({
        name,
        description,
        unit,
        position
      });

      res.status(201).json({
        success: true,
        data: report
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to create report',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // PUT update report
  static async updateReport(req: Request, res: Response): Promise<void> {
    try {
      const { name, description, unit, position } = req.body;
      const updateData: Partial<IReport> = {};

      if (name) updateData.name = name;
      if (description !== undefined) updateData.description = description;
      if (unit !== undefined) updateData.unit = unit;
      if (position !== undefined) updateData.position = position;

      const report = await ReportService.updateReport(req.params.id, updateData);
      if (!report) {
        res.status(404).json({
          success: false,
          error: 'Report not found'
        });
        return;
      }

      res.json({
        success: true,
        data: report
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to update report',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // DELETE report
  static async deleteReport(req: Request, res: Response): Promise<void> {
    try {
      const report = await ReportService.deleteReport(req.params.id);
      if (!report) {
        res.status(404).json({
          success: false,
          error: 'Report not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Report deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to delete report',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // POST create complete report with topics and slides
  static async createCompleteReport(req: Request, res: Response): Promise<void> {
    try {
      const { report, topics } = req.body;

      // Validate required fields
      if (!report || !report.name) {
        res.status(400).json({
          success: false,
          error: 'Report data with name is required'
        });
        return;
      }

      if (!topics || !Array.isArray(topics) || topics.length === 0) {
        res.status(400).json({
          success: false,
          error: 'Topics array is required and must not be empty'
        });
        return;
      }

      // Validate each topic has required fields
      for (const topicData of topics) {
        if (!topicData.topic || !topicData.topic.name) {
          res.status(400).json({
            success: false,
            error: 'Each topic must have a name'
          });
          return;
        }
      }

      const completeReport = await ReportService.createCompleteReport({ report, topics });
      
      res.status(201).json({
        success: true,
        data: completeReport,
        message: 'Complete report created successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to create complete report',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  static async getInitialReportData(req: Request, res: Response): Promise<void> {
    try {
      const reportData = await ReportService.getInitialReportData(req.params.id);

      if (!reportData) {
        res.status(404).json({
          success: false,
          error: 'Report not found'
        });
        return;
      }

      res.json({
        success: true,
        data: reportData
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to get initial report data',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}
