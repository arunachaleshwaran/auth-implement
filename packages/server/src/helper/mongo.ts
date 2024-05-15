import { MongoClient, ServerApiVersion } from 'mongodb';
import type { Collection } from 'mongodb';
import type { Schema } from '@auth-implement/shared';

/**
 * Connects to the MongoDB server.
 * need to close the client after use.
 * like
 * ```ts
 * const client = await connect();
 * // some more code
 * await client.close();
 * ```
 */
export async function connect() {
  const client = new MongoClient('mongodb://localhost:27017', {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
    },
  });
  await client.connect();
  return client;
}

/**
 * @param dbName got from DB schema present in shared package
 * @returns collection of the database with all types
 */
export function collection<T extends keyof Schema>(
  client: MongoClient,
  dbName: T
): Collection<Schema[T]> {
  const database = client.db('dev_db');
  return database.collection<Schema[T]>(dbName);
}
