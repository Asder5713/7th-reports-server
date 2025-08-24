import express from 'express';
import { SlideController } from '../controllers/slideController';

const router = express.Router();

// GET all slides
router.get('/', SlideController.getAllSlides);

// GET slide by ID
router.get('/:id', SlideController.getSlideById);

// POST create new slide
router.post('/', SlideController.createSlide);

// PUT update slide
router.put('/:id', SlideController.updateSlide);

// DELETE slide
router.delete('/:id', SlideController.deleteSlide);

// GET slides by subject
router.get('/subject/:subjectId', SlideController.getSlidesBySubject);

export default router; 