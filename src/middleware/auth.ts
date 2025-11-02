import { Request, Response, NextFunction } from 'express';

// Secret key - in production, this should be in environment variables
const SECRET_KEY = process.env.API_SECRET_KEY || 'your-secret-key-here';

export const authenticateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const secretKey = req.headers['x-api-key'] || req.headers['authorization'];

  if (!secretKey) {
    res.status(401).json({
      success: false,
      error: 'Authentication required',
      message: 'Missing API key in headers'
    });
    return;
  }

  // Remove 'Bearer ' prefix if present
  const cleanKey =
    typeof secretKey === 'string' && secretKey.startsWith('Bearer ')
      ? secretKey.substring(7)
      : secretKey;

  if (cleanKey !== SECRET_KEY) {
    res.status(403).json({
      success: false,
      error: 'Authentication failed',
      message: 'Invalid API key'
    });
    return;
  }

  next();
};
