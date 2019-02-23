import { MongoClient, Db } from 'mongodb';
import { Injectable } from '@nestjs/common';
import { logger } from '../logging/logger.const';
import { sleep } from '../shared/sleep';
import {
  DATABASE_CONNECTION_STRING,
  DATABASE_NAME,
  DATABASE_MAX_CONNECTION_RETRIES,
  DATABASE_CONNECTION_RETRY_INTERVAL_SECONDS
} from '../shared/config.const';

/**
 * Connection service for MongoDB.
 */
@Injectable()
export class MongoDBConnectionService {
  /**
   * Used database instance.
   */
  private _db: Db;

  /**
   * Used MongoClient.
   */
  private _mongoClient: MongoClient;

  /**
   * Connect to MongoDB.
   */
  public async initialize() {
    let lastError: Error = null;
    for (
      let currentRetry = 1;
      currentRetry < DATABASE_MAX_CONNECTION_RETRIES;
      ++currentRetry
    ) {
      try {
        this._mongoClient = await MongoClient.connect(
          DATABASE_CONNECTION_STRING,
          {
            useNewUrlParser: true
          }
        );
        this._db = this._mongoClient.db(DATABASE_NAME);
        return Promise.resolve();
      } catch (err) {
        const isRetrying = currentRetry < DATABASE_MAX_CONNECTION_RETRIES;
        if (!isRetrying) {
          lastError = err;
          break;
        }
        logger.warn(
          { err },
          `Error connecting to MongoDB in attempt #${currentRetry}, retrying in ${DATABASE_CONNECTION_RETRY_INTERVAL_SECONDS} seconds.`
        );
        await sleep(DATABASE_CONNECTION_RETRY_INTERVAL_SECONDS * 1000);
      }
    }
    return Promise.reject(lastError);
  }

  /**
   * Teardown connection.
   */
  public async teardown() {
    return this._mongoClient.close();
  }

  /**
   * Get database instance.
   */
  public get db() {
    return this._db;
  }

  /**
   * Get server status.
   */
  public getServerStatus() {
    return this._db.command({ serverStatus: 1 });
  }
}
