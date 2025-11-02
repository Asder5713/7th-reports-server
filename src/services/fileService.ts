import File, { IFile } from '../models/File';

export class FileService {
  // Get all files
  static async getAllFiles(): Promise<IFile[]> {
    return await File.find({}).select('-__v');
  }

  // Get file by ID
  static async getFileById(id: string): Promise<IFile | null> {
    return await File.findById(id).select('-__v');
  }

  // Create new file
  static async createFile(fileData: Partial<IFile>): Promise<IFile> {
    const file = new File(fileData);
    return await file.save();
  }

  // Update file
  static async updateFile(
    id: string,
    updateData: Partial<IFile>
  ): Promise<IFile | null> {
    return await File.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    }).select('-__v');
  }

  // Delete file
  static async deleteFile(id: string): Promise<IFile | null> {
    return await File.findByIdAndDelete(id);
  }

  // Check if file exists by file key
  static async fileExistsByFileKey(fileKey: string): Promise<boolean> {
    const file = await File.findOne({ fileKey });
    return !!file;
  }
}
