import { Request, Response } from 'express';
import { SubjectService } from '../services/subjectService';
import { ISubject } from '../models/Subject';

export class SubjectController {
  // GET all subjects
  static async getAllSubjects(req: Request, res: Response): Promise<void> {
    try {
      const subjects = await SubjectService.getAllSubjects();
      res.json({
        success: true,
        data: subjects,
        count: subjects.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch subjects',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // GET subject by ID
  static async getSubjectById(req: Request, res: Response): Promise<void> {
    try {
      const subject = await SubjectService.getSubjectById(req.params.id);
      if (!subject) {
        res.status(404).json({
          success: false,
          error: 'Subject not found'
        });
        return;
      }
      
      res.json({
        success: true,
        data: subject
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch subject',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // POST create new subject
  static async createSubject(req: Request, res: Response): Promise<void> {
    try {
      const { subjectName, inReport, index } = req.body;

      // Validate required fields
      if (!subjectName || !inReport) {
        res.status(400).json({
          success: false,
          error: 'Subject name and inReport are required'
        });
        return;
      }

      const subject = await SubjectService.createSubject({ subjectName, inReport, index });
      res.status(201).json({
        success: true,
        data: subject
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to create subject',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // PUT update subject
  static async updateSubject(req: Request, res: Response): Promise<void> {
    try {
      const { subjectName, inReport, index } = req.body;
      const updateData: Partial<ISubject> = {};

      if (subjectName) updateData.subjectName = subjectName;
      if (inReport) updateData.inReport = inReport;
      if (index !== undefined) updateData.index = index;

      const subject = await SubjectService.updateSubject(req.params.id, updateData);
      if (!subject) {
        res.status(404).json({
          success: false,
          error: 'Subject not found'
        });
        return;
      }

      res.json({
        success: true,
        data: subject
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to update subject',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // DELETE subject
  static async deleteSubject(req: Request, res: Response): Promise<void> {
    try {
      const subject = await SubjectService.deleteSubject(req.params.id);
      if (!subject) {
        res.status(404).json({
          success: false,
          error: 'Subject not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Subject deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to delete subject',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // GET subjects by report
  static async getSubjectsByReport(req: Request, res: Response): Promise<void> {
    try {
      const { reportId } = req.params;
      const subjects = await SubjectService.getSubjectsByReport(reportId);
      
      res.json({
        success: true,
        data: subjects,
        count: subjects.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch subjects by report',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}

