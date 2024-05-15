import { collection, connect } from './mongo.js';
import ExpressError from '../express-error.js';
import HttpStatusCode from '../HttpStatusCode.js';
import type { MongoClient } from 'mongodb';
import { Router } from 'express';

// eslint-disable-next-line new-cap
const route = Router();
/**
 * Fetch order id from mongodb and fetch its details from RTA server.
 * and cache the value for future use.
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
    if (user.retry >= 3)
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
    res.send({
      callBack: `/auth?token=token&redirectUrl=${req.body.redirectUrl}`,
    });
  } catch (error) {
    next(error);
  } finally {
    await client.close();
  }
});
export default route;
