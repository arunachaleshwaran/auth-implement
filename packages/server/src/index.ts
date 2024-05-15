import type { ErrorRequestHandler } from 'express';
import ExpressError from './express-error.js';
import HttpStatusCode from './HttpStatusCode.js';
import cors from 'cors';
import express from 'express';
import route from './helper/routes.js';
const PORT = 4000;
const app = express();
app.use(
  cors({
    origin: 'http://localhost:3000',
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(route);

app.use(((err, _req, res, _) => {
  console.error(err);
  if (err instanceof ExpressError)
    res.status(err.status).send(err.message);
  else
    res
      .status(HttpStatusCode.InternalServerError)
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions, @typescript-eslint/no-unsafe-member-access
      .send(err?.message || 'Something went wrong');
}) as ErrorRequestHandler);
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
