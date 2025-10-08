import { Request, Response } from 'express';
import { SlideService } from '../services/slideService';
import { ISlide } from '../models/Slide';

export class SlideController {
  // GET all slides
  static async getAllSlides(req: Request, res: Response): Promise<void> {
    try {
      const slides = await SlideService.getAllSlides();
      await Promise.all(slides.map(slide => slide.resolveFiles()));
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
      
      await slide.resolveFiles();
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
      const { content, inTopic } = req.body;

      // Validate required fields
      if (!content || !inTopic) {
        res.status(400).json({
          success: false,
          error: 'Content and inTopic are required'
        });
        return;
      }

      const slide = await SlideService.createSlide({ content, inTopic });
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
      const { content, inTopic, position } = req.body;
      const updateData: Partial<ISlide> = {};

      if (content) updateData.content = content;
      if (inTopic) updateData.inTopic = inTopic;
      if (position !== undefined) updateData.position = position;

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
}

