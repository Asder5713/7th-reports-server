import express, { Request, Response } from 'express';
import Report, { IReport } from '../models/Report';
import Subject from '../models/Subject';

const router = express.Router();

// GET all reports
router.get('/', async (req: Request, res: Response) => {
  try {
    const reports = await Report.find()
      .populate('subjectsArray')
      .select('-__v')
      .sort({ createdAt: -1 });
    
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
});

// GET report by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('subjectsArray')
      .select('-__v');
    
    if (!report) {
      return res.status(404).json({
        success: false,
        error: 'Report not found'
      });
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
});

// POST create new report
router.post('/', async (req: Request, res: Response) => {
  try {
    const { reportName, reportDescription, subjectsArray } = req.body;

    // Validate required fields
    if (!reportName) {
      return res.status(400).json({
        success: false,
        error: 'Report name is required'
      });
    }

    // Validate subjects if provided
    if (subjectsArray && subjectsArray.length > 0) {
      const subjects = await Subject.find({
        _id: { $in: subjectsArray }
      });
      
      if (subjects.length !== subjectsArray.length) {
        return res.status(400).json({
          success: false,
          error: 'One or more subjects not found'
        });
      }
    }

    const report = new Report({
      reportName,
      reportDescription,
      subjectsArray: subjectsArray || []
    });

    const savedReport = await report.save();
    const populatedReport = await Report.findById(savedReport._id)
      .populate('subjectsArray')
      .select('-__v');

    res.status(201).json({
      success: true,
      data: populatedReport
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create report',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// PUT update report
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { reportName, reportDescription, subjectsArray } = req.body;
    const updateData: Partial<IReport> = {};

    if (reportName) updateData.reportName = reportName;
    if (reportDescription !== undefined) updateData.reportDescription = reportDescription;
    if (subjectsArray) updateData.subjectsArray = subjectsArray;

    const report = await Report.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('subjectsArray')
      .select('-__v');

    if (!report) {
      return res.status(404).json({
        success: false,
        error: 'Report not found'
      });
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
});

// DELETE report
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const report = await Report.findByIdAndDelete(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        error: 'Report not found'
      });
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
});

export default router; 