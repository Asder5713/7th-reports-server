import express, { Request, Response } from 'express';
import Slide, { ISlide } from '../models/Slide';

const router = express.Router();

// GET all slides
router.get('/', async (req: Request, res: Response) => {
  try {
    const slides = await Slide.find().select('-__v');
    
    res.json({
      success: true,
      data: slides,
      count: slides.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch slides',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET slide by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const slide = await Slide.findById(req.params.id).select('-__v');
    
    if (!slide) {
      return res.status(404).json({
        success: false,
        error: 'Slide not found'
      });
    }
    
    res.json({
      success: true,
      data: slide
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch slide',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST create new slide
router.post('/', async (req: Request, res: Response) => {
  try {
    const { content } = req.body;

    // Validate required fields
    if (!content) {
      return res.status(400).json({
        success: false,
        error: 'Content is required'
      });
    }

    const slide = new Slide({
      content
    });

    const savedSlide = await slide.save();
    res.status(201).json({
      success: true,
      data: savedSlide
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create slide',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// PUT update slide
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { content } = req.body;
    const updateData: Partial<ISlide> = {};

    if (content) updateData.content = content;

    const slide = await Slide.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-__v');

    if (!slide) {
      return res.status(404).json({
        success: false,
        error: 'Slide not found'
      });
    }

    res.json({
      success: true,
      data: slide
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update slide',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// DELETE slide
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const slide = await Slide.findByIdAndDelete(req.params.id);

    if (!slide) {
      return res.status(404).json({
        success: false,
        error: 'Slide not found'
      });
    }

    res.json({
      success: true,
      message: 'Slide deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete slide',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router; 