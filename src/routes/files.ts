import express from 'express';
import { FileController } from '../controllers/fileController';

const router = express.Router();

// GET all files
router.get('/', FileController.getAllFiles);

// GET file by ID
router.get('/:id', FileController.getFileById);

// POST create new file
router.post('/', FileController.createFile);

// PUT update file
router.put('/:id', FileController.updateFile);

// DELETE file
router.delete('/:id', FileController.deleteFile);

export default router; 