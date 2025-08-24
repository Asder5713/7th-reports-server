import User, { IUser } from '../models/User';

export interface UserPermissions {
  hasAccess: boolean;
  accessLevel: 'full' | 'limited' | 'none';
}

export class UserService {
  // Get all users
  static async getAllUsers(): Promise<IUser[]> {
    return await User.find({}).select('-__v');
  }

  // Get user by ID
  static async getUserById(id: string): Promise<IUser | null> {
    return await User.findById(id).select('-__v');
  }

  // Create new user
  static async createUser(userData: { rank: string; armyId: string }): Promise<IUser> {
    // Check if user already exists
    const existingUser = await User.findOne({ armyId: userData.armyId });
    if (existingUser) {
      throw new Error('User with this army ID already exists');
    }

    const user = new User(userData);
    return await user.save();
  }

  // Update user
  static async updateUser(id: string, updateData: Partial<IUser>): Promise<IUser | null> {
    return await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-__v');
  }

  // Delete user
  static async deleteUser(id: string): Promise<IUser | null> {
    return await User.findByIdAndDelete(id);
  }

  // Check user permissions
  static async checkUserPermissions(userId: string): Promise<UserPermissions> {
    try {
      const user = await User.findById(userId);
      if (!user) {
        return { hasAccess: false, accessLevel: 'none' };
      }

      // If rank is "טוראי" (Private), check if they passed biases
      if (user.rank === "טוראי") {
        if (user.didPassBiases) {
          return { hasAccess: true, accessLevel: 'limited' };
        } else {
          return { hasAccess: false, accessLevel: 'none' };
        }
      }

      // Any other rank gets full access
      return { hasAccess: true, accessLevel: 'full' };
    } catch (error) {
      return { hasAccess: false, accessLevel: 'none' };
    }
  }

  // Check if user exists by army ID
  static async userExistsByArmyId(armyId: string): Promise<boolean> {
    const user = await User.findOne({ armyId });
    return !!user;
  }
}

