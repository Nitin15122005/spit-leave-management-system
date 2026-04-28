import { Request, Response, NextFunction } from 'express';

// ============================================
// GLOBAL ERROR HANDLER
// ============================================
export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('[ERROR]', err.message, err.stack);

  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
};

// ============================================
// REQUEST LOGGER
// ============================================
export const requestLogger = (req: Request, _res: Response, next: NextFunction): void => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
};
