import { collection, connect } from './mongo.js';
import ExpressError from '../express-error.js';
import HttpStatusCode from '../HttpStatusCode.js';
import type { MongoClient } from 'mongodb';
import { Router } from 'express';
import jwt from 'jsonwebtoken';
// eslint-disable-next-line new-cap
const route = Router();
/**
 * Auth the user
 */
route.post<
  '/auth',
  Record<string, never>,
  { callBack: string },
  { userId: string; password: string; redirectUrl: string },
  Record<string, never>
  // eslint-disable-next-line max-statements
>('/auth', async (req, res, next) => {
  let client: MongoClient | null = null;
  try {
    client = await connect();
  } catch (dbError) {
    next(dbError);
    return;
  }
  try {
    const userCollection = collection(client, 'user');
    const user = await userCollection.findOne({
      userId: req.body.userId,
    });
    if (user === null)
      throw new ExpressError(
        'User not found',
        HttpStatusCode.Unauthorized
      );
    if (user.retry >= Number(process.env.MaxRetry))
      throw new ExpressError(
        'User blocked',
        HttpStatusCode.Forbidden
      );
    if (user.password === req.body.password)
      await userCollection.updateOne(
        { userId: req.body.userId },
        { $set: { retry: 0 } }
      );
    else {
      await userCollection.updateOne(
        { userId: req.body.userId },
        { $inc: { retry: 1 } }
      );
      throw new ExpressError(
        'Password incorrect',
        HttpStatusCode.Unauthorized
      );
    }
    const token = jwt.sign(
      { userId: req.body.userId },
      process.env.JwtSecret,
      { expiresIn: process.env.JwtExpireTime }
    );
    res.send({
      callBack: `/auth?token=${token}&redirectUrl=${req.body.redirectUrl}`,
    });
  } catch (error) {
    next(error);
  } finally {
    await client.close();
  }
});

route.get<
  '/time',
  Record<string, never>,
  { time: string },
  never,
  Record<string, never>
>(
  '/time',
  /** Auth middleware */
  (req, _, next) => {
    try {
      const token = req.headers.authorization!;
      jwt.verify(token, process.env.JwtSecret);
    } catch (error) {
      next(
        new ExpressError(
          (error as Error).message,
          HttpStatusCode.Unauthorized
        )
      );
    }
  },
  (_, res, next) => {
    try {
      res.json({ time: Date().toString() });
    } catch (error) {
      next(error);
    }
  }
);
export default route;
