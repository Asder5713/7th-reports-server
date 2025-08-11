import express, { Request, Response } from 'express';
import Subject, { ISubject } from '../models/Subject';

const router = express.Router();

// GET all subjects
router.get('/', async (req: Request, res: Response) => {
  try {
    const subjects = await Subject.find()
      .populate('slideArray')
      .select('-__v');
    
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
});

// GET subject by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const subject = await Subject.findById(req.params.id)
      .populate('slideArray')
      .select('-__v');
    
    if (!subject) {
      return res.status(404).json({
        success: false,
        error: 'Subject not found'
      });
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
});

// POST create new subject
router.post('/', async (req: Request, res: Response) => {
  try {
    const { subjectName, slideArray } = req.body;

    // Validate required fields
    if (!subjectName) {
      return res.status(400).json({
        success: false,
        error: 'Subject name is required'
      });
    }

    const subject = new Subject({
      subjectName,
      slideArray: slideArray || []
    });

    const savedSubject = await subject.save();
    const populatedSubject = await Subject.findById(savedSubject._id)
      .populate('slideArray')
      .select('-__v');

    res.status(201).json({
      success: true,
      data: populatedSubject
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create subject',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// PUT update subject
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { subjectName, slideArray } = req.body;
    const updateData: Partial<ISubject> = {};

    if (subjectName) updateData.subjectName = subjectName;
    if (slideArray) updateData.slideArray = slideArray;

    const subject = await Subject.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('slideArray')
      .select('-__v');

    if (!subject) {
      return res.status(404).json({
        success: false,
        error: 'Subject not found'
      });
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
});

// DELETE subject
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.id);

    if (!subject) {
      return res.status(404).json({
        success: false,
        error: 'Subject not found'
      });
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
});

export default router; 