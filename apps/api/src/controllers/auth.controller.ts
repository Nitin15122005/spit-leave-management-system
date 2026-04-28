import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/database';

export const loginController = async (req: Request, res: Response): Promise<void> => {
  const { uid, password } = req.body;

  const user = await prisma.user.findUnique({ where: { uid } });

  if (!user) {
    res.status(401).json({ success: false, error: 'Invalid UID or password' });
    return;
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    res.status(401).json({ success: false, error: 'Invalid UID or password' });
    return;
  }

  const expiresIn = (process.env.JWT_EXPIRES_IN || '7d') as unknown as number;
  const token = jwt.sign(
    { userId: user.id, uid: user.uid, role: user.role },
    process.env.JWT_SECRET as string,
    { expiresIn }
  );

  res.json({
    success: true,
    token,
    userId: user.id,
    uid: user.uid,
    name: user.name,
    role: user.role,
    class: user.class ?? undefined,
    mobile: user.mobile ?? undefined,
  });
};

export const getMeController = async (req: Request, res: Response): Promise<void> => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.userId },
    select: { id: true, uid: true, name: true, role: true, class: true, mobile: true, department: true, email: true },
  });

  if (!user) {
    res.status(404).json({ success: false, error: 'User not found' });
    return;
  }

  res.json({ success: true, ...user });
};
