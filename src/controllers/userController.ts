import { Request, Response } from 'express';
import { UserService } from '../services/userService';

export class UserController {
  // GET all users
  static async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await UserService.getAllUsers();
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
  }

  // GET user by ID
  static async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const user = await UserService.getUserById(req.params.id);
      if (!user) {
        res.status(404).json({
          success: false,
          error: 'User not found'
        });
        return;
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
  }

  // POST create new user
  static async createUser(req: Request, res: Response): Promise<void> {
    try {
      const { rank, armyId } = req.body;

      // Validate required fields
      if (!rank || !armyId) {
        res.status(400).json({
          success: false,
          error: 'Rank and armyId are required'
        });
        return;
      }

      const user = await UserService.createUser({ rank, armyId });
      res.status(201).json({
        success: true,
        data: user
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'User with this army ID already exists') {
        res.status(409).json({
          success: false,
          error: 'User with this army ID already exists'
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: 'Failed to create user',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // PUT update user
  static async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const { rank, armyId } = req.body;
      const updateData: Partial<{ rank: string; armyId: string }> = {};

      if (rank) updateData.rank = rank;
      if (armyId) updateData.armyId = armyId;

      const user = await UserService.updateUser(req.params.id, updateData);
      if (!user) {
        res.status(404).json({
          success: false,
          error: 'User not found'
        });
        return;
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
  }

  // DELETE user
  static async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const user = await UserService.deleteUser(req.params.id);
      if (!user) {
        res.status(404).json({
          success: false,
          error: 'User not found'
        });
        return;
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
  }

  // GET check user permissions
  static async checkUserPermissions(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      
      if (!userId) {
        res.status(400).json({
          success: false,
          error: 'User ID is required'
        });
        return;
      }

      const permissions = await UserService.checkUserPermissions(userId);
      
      res.json({
        success: true,
        data: permissions
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to check user permissions',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // PATCH set user confidentiality
  static async setConfidentiality(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      if (!id) {
        res.status(400).json({
          success: false,
          error: 'User ID is required'
        });
        return;
      }

      const user = await UserService.updateUser(id, { didConfirmConfidentiality: true });
      if (!user) {
        res.status(404).json({
          success: false,
          error: 'User not found'
        });
        return;
      }

      res.json({
        success: true,
        data: user,
        message: 'User confidentiality set successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to set user confidentiality',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  static async getOrCreateUser(req: Request, res: Response): Promise<void> {
    try {
      const { armyId } = req.body;
      const user = await UserService.getUserByArmyId(armyId);

      if (!user) {
        const newUser = await UserService.createUser(req.body);
        res.status(201).json({
          success: true,
          data: newUser
        });
      } else {
        res.status(200).json({
          success: true,
          data: user
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to get or create user',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}

