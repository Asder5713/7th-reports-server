import express, { Request, Response } from 'express';
import User, { IUser } from '../models/User';

const router = express.Router();

// GET all users
router.get('/', async (req: Request, res: Response) => {
  try {
    const users = await User.find({}).select('-__v');
    res.json({
      success: true,
      data: users,
      count: users.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET user by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select('-__v');
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST create new user
router.post('/', async (req: Request, res: Response) => {
  try {
    const { rank, armyId } = req.body;

    // Validate required fields
    if (!rank || !armyId) {
      return res.status(400).json({
        success: false,
        error: 'Rank and armyId are required'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ armyId });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'User with this army ID already exists'
      });
    }

    const user = new User({
      rank,
      armyId
    });

    const savedUser = await user.save();
    res.status(201).json({
      success: true,
      data: savedUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create user',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// PUT update user
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { rank, armyId } = req.body;
    const updateData: Partial<IUser> = {};

    if (rank) updateData.rank = rank;
    if (armyId) updateData.armyId = armyId;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-__v');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update user',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// DELETE user
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete user',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router; 