import express, { Request, Response } from 'express';
import File, { IFile } from '../models/File';

const router = express.Router();

// GET all files
router.get('/', async (req: Request, res: Response) => {
  try {
    const files = await File.find().select('-__v');
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
});

// GET file by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const file = await File.findById(req.params.id).select('-__v');
    if (!file) {
      return res.status(404).json({
        success: false,
        error: 'File not found'
      });
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
});

// POST create new file
router.post('/', async (req: Request, res: Response) => {
  try {
    const { fileKey, mimeType } = req.body;

    // Validate required fields
    if (!fileKey || !mimeType) {
      return res.status(400).json({
        success: false,
        error: 'File key and mime type are required'
      });
    }

    const file = new File({
      fileKey,
      mimeType
    });

    const savedFile = await file.save();
    res.status(201).json({
      success: true,
      data: savedFile
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create file',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// PUT update file
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { fileKey, mimeType } = req.body;
    const updateData: Partial<IFile> = {};

    if (fileKey) updateData.fileKey = fileKey;
    if (mimeType) updateData.mimeType = mimeType;

    const file = await File.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-__v');

    if (!file) {
      return res.status(404).json({
        success: false,
        error: 'File not found'
      });
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
});

// DELETE file
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const file = await File.findByIdAndDelete(req.params.id);
    if (!file) {
      return res.status(404).json({
        success: false,
        error: 'File not found'
      });
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
});

export default router; 