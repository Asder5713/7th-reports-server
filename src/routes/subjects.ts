import express from 'express';
import { SubjectController } from '../controllers/subjectController';

const router = express.Router();

// GET all subjects
router.get('/', SubjectController.getAllSubjects);

// GET subject by ID
router.get('/:id', SubjectController.getSubjectById);

// POST create new subject
router.post('/', SubjectController.createSubject);

// PUT update subject
router.put('/:id', SubjectController.updateSubject);

// DELETE subject
router.delete('/:id', SubjectController.deleteSubject);

// GET subjects by report
router.get('/report/:reportId', SubjectController.getSubjectsByReport);

export default router; 