import express from 'express';
import { UserController } from '../controllers/userController';

const router = express.Router();

// GET all users
router.get('/', UserController.getAllUsers);

// GET user by ID
router.get('/:id', UserController.getUserById);

// POST create new user
router.post('/', UserController.createUser);

// PUT update user
router.put('/:id', UserController.updateUser);

// DELETE user
router.delete('/:id', UserController.deleteUser);

// GET check user permissions
router.get('/permissions/:userId', UserController.checkUserPermissions);

// PATCH set user confidentiality
router.patch('/:id/confidentiality', UserController.setConfidentiality);

router.put('/login', UserController.getOrCreateUser);

export default router; 