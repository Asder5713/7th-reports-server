import { Request, Response } from 'express';
import { SlideService } from '../services/slideService';
import { ISlide } from '../models/Slide';

export class SlideController {
  // GET all slides
  static async getAllSlides(req: Request, res: Response): Promise<void> {
    try {
      const slides = await SlideService.getAllSlides();
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
  }

  // GET slide by ID
  static async getSlideById(req: Request, res: Response): Promise<void> {
    try {
      const slide = await SlideService.getSlideById(req.params.id);
      if (!slide) {
        res.status(404).json({
          success: false,
          error: 'Slide not found'
        });
        return;
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
  }

  // POST create new slide
  static async createSlide(req: Request, res: Response): Promise<void> {
    try {
      const { content, inSubject, index } = req.body;

      // Validate required fields
      if (!content || !inSubject) {
        res.status(400).json({
          success: false,
          error: 'Content and inSubject are required'
        });
        return;
      }

      const slide = await SlideService.createSlide({ content, inSubject, index });
      res.status(201).json({
        success: true,
        data: slide
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to create slide',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // PUT update slide
  static async updateSlide(req: Request, res: Response): Promise<void> {
    try {
      const { content, inSubject, index } = req.body;
      const updateData: Partial<ISlide> = {};

      if (content) updateData.content = content;
      if (inSubject) updateData.inSubject = inSubject;
      if (index !== undefined) updateData.index = index;

      const slide = await SlideService.updateSlide(req.params.id, updateData);
      if (!slide) {
        res.status(404).json({
          success: false,
          error: 'Slide not found'
        });
        return;
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
  }

  // DELETE slide
  static async deleteSlide(req: Request, res: Response): Promise<void> {
    try {
      const slide = await SlideService.deleteSlide(req.params.id);
      if (!slide) {
        res.status(404).json({
          success: false,
          error: 'Slide not found'
        });
        return;
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
  }

  // GET slides by subject
  static async getSlidesBySubject(req: Request, res: Response): Promise<void> {
    try {
      const { subjectId } = req.params;
      const slides = await SlideService.getSlidesBySubject(subjectId);
      
      res.json({
        success: true,
        data: slides,
        count: slides.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch slides by subject',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}

