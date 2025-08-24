import express from 'express';
import { ReportController } from '../controllers/reportController';

const router = express.Router();

// GET all reports
router.get('/', ReportController.getAllReports);

// GET report by ID
router.get('/:id', ReportController.getReportById);

// POST create new report
router.post('/', ReportController.createReport);

// PUT update report
router.put('/:id', ReportController.updateReport);

// DELETE report
router.delete('/:id', ReportController.deleteReport);

export default router; 