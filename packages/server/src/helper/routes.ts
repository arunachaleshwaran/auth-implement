import { collection, connect } from './mongo.js';
import ExpressError from '../express-error.js';
import HttpStatusCode from '../HttpStatusCode.js';
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
  never,
  Record<string, never>
>('/auth', (_, res, next) => {
  try {
    res.send({ callBack: 'Authenticated' });
  } catch (error) {
    next(error);
  }
});
export default route;
