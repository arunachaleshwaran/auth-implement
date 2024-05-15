import { collection, connect } from './mongo.js';
import ExpressError from '../express-error.js';
import HttpStatusCode from '../HttpStatusCode.js';
import type { JwtPayload } from 'jsonwebtoken';
import type { MongoClient } from 'mongodb';
import { Router } from 'express';
import type { Schema } from '@auth-implement/shared';
import jwt from 'jsonwebtoken';
// eslint-disable-next-line new-cap
const route = Router();

const AccessTokenCache: Record<
  Schema['user']['userId'],
  Array<string>
> = {};
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
    const { userId, password, redirectUrl } = req.body;
    const user = await userCollection.findOne({
      userId,
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
    if (user.password === password)
      await userCollection.updateOne(
        { userId },
        { $set: { retry: 0 } }
      );
    else {
      await userCollection.updateOne(
        { userId },
        { $inc: { retry: 1 } }
      );
      throw new ExpressError(
        'Password incorrect',
        HttpStatusCode.Unauthorized
      );
    }
    const token: string = jwt.sign(
      { userId: req.body.userId },
      process.env.JwtSecret,
      { expiresIn: process.env.JwtExpireTime }
    );
    AccessTokenCache[userId] = (AccessTokenCache[userId] ??
      []) as Array<string>;
    AccessTokenCache[userId].push(token);
    res.send({
      callBack: `/auth?token=${token}&redirectUrl=${redirectUrl}`,
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
      const { userId } = jwt.verify(
        token,
        process.env.JwtSecret
      ) as JwtPayload & { userId: Schema['user']['userId'] };
      if (!AccessTokenCache[userId].find(t => t === token))
        throw new Error('Session kicked out. Please login again');
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
route.get<
  '/kick-out',
  Record<string, never>,
  string,
  never,
  { userId: Schema['user']['userId'] }
>(
  '/kick-out',
  /** Auth middleware */
  (req, res, next) => {
    console.log('first', req.query.userId);
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete AccessTokenCache[req.query.userId];
    res.status(HttpStatusCode.Ok).send('Done');
  }
);

export default route;
