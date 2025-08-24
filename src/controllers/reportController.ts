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
      const { reportName, reportDescription, reportImage, index } = req.body;

      // Validate required fields
      if (!reportName) {
        res.status(400).json({
          success: false,
          error: 'Report name is required'
        });
        return;
      }

      const report = await ReportService.createReport({ 
        reportName, 
        reportDescription, 
        reportImage,
        index
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
      const { reportName, reportDescription, reportImage, index } = req.body;
      const updateData: Partial<IReport> = {};

      if (reportName) updateData.reportName = reportName;
      if (reportDescription !== undefined) updateData.reportDescription = reportDescription;
      if (reportImage) updateData.reportImage = reportImage;
      if (index !== undefined) updateData.index = index;

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



  // POST create complete report with subjects and slides
  static async createCompleteReport(req: Request, res: Response): Promise<void> {
    try {
      const { report, subjects } = req.body;

      // Validate required fields
      if (!report || !report.reportName) {
        res.status(400).json({
          success: false,
          error: 'Report data with reportName is required'
        });
        return;
      }

      if (!subjects || !Array.isArray(subjects) || subjects.length === 0) {
        res.status(400).json({
          success: false,
          error: 'Subjects array is required and must not be empty'
        });
        return;
      }

      // Validate each subject has required fields
      for (const subjectData of subjects) {
        if (!subjectData.subject || !subjectData.subject.subjectName) {
          res.status(400).json({
            success: false,
            error: 'Each subject must have a subjectName'
          });
          return;
        }
      }

      const completeReport = await ReportService.createCompleteReport({ report, subjects });
      
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
}

