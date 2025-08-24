import { Request, Response } from 'express';
import { FileService } from '../services/fileService';

export class FileController {
  // GET all files
  static async getAllFiles(req: Request, res: Response): Promise<void> {
    try {
      const files = await FileService.getAllFiles();
      res.json({
        success: true,
        data: files,
        count: files.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch files',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // GET file by ID
  static async getFileById(req: Request, res: Response): Promise<void> {
    try {
      const file = await FileService.getFileById(req.params.id);
      if (!file) {
        res.status(404).json({
          success: false,
          error: 'File not found'
        });
        return;
      }
      
      res.json({
        success: true,
        data: file
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch file',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // POST create new file
  static async createFile(req: Request, res: Response): Promise<void> {
    try {
      const { fileKey, mimeType } = req.body;

      // Validate required fields
      if (!fileKey || !mimeType) {
        res.status(400).json({
          success: false,
          error: 'File key and mime type are required'
        });
        return;
      }

      const file = await FileService.createFile({ fileKey, mimeType });
      res.status(201).json({
        success: true,
        data: file
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to create file',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // PUT update file
  static async updateFile(req: Request, res: Response): Promise<void> {
    try {
      const { fileKey, mimeType } = req.body;
      const updateData: Partial<{ fileKey: string; mimeType: string }> = {};

      if (fileKey) updateData.fileKey = fileKey;
      if (mimeType) updateData.mimeType = mimeType;

      const file = await FileService.updateFile(req.params.id, updateData);
      if (!file) {
        res.status(404).json({
          success: false,
          error: 'File not found'
        });
        return;
      }

      res.json({
        success: true,
        data: file
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to update file',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // DELETE file
  static async deleteFile(req: Request, res: Response): Promise<void> {
    try {
      const file = await FileService.deleteFile(req.params.id);
      if (!file) {
        res.status(404).json({
          success: false,
          error: 'File not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'File deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to delete file',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}
