import { MongoClient, Db, Collection, Cursor } from 'mongodb';
import { interval } from 'rxjs';
import { prompt } from 'inquirer';
import { take } from 'rxjs/operators';
import { logger } from './logger.const';
import * as io from 'socket.io-client';
import * as nyanProgress from 'nyan-progress';
import { GenericSensorData } from './generic-sensor-data.model';

import { TITLE, NYAN_MESSAGES } from './texts.const';
import {
  DATABASE_MAX_CONNECTION_RETRIES,
  DATABASE_CONNECTION_STRING,
  DATABASE_NAME,
  DATABASE_CONNECTION_RETRY_INTERVAL_SECONDS,
  HOST,
  SENSOR_DATA_COLLECTION_NAME,
  WEBSOCKET_CHANNEL_SENSOR_DATA_PUSH,
  USE_ORIGINAL_TIMESTAMP
} from './config.const';
import {
  EXIT_CODE_CONNECTION_ERROR,
  EXIT_CODE_SUCCESS
} from './exit-codes.const';

/**
 * Sleep for given time.
 * @param time Time in milliseconds.
 */
const sleep = (time: number) => {
  return interval(time)
    .pipe(take(1))
    .toPromise();
};

/**
 * Prompt user for ready confirmation.
 */
const askUserReady = async () => {
  const answers = await prompt([
    {
      type: 'confirm',
      name: 'ready',
      message: 'Ready to replay demo data?',
      default: false
    }
  ]);
  return answers.ready;
};

/**
 * Connect to MongoDB instance.
 */
const connectToMongoDB = async () => {
  let lastError: Error = null;
  for (
    let currentRetry = 1;
    currentRetry < DATABASE_MAX_CONNECTION_RETRIES;
    ++currentRetry
  ) {
    try {
      const mongoClient = await MongoClient.connect(
        DATABASE_CONNECTION_STRING,
        {
          useNewUrlParser: true
        }
      );
      const db = mongoClient.db(DATABASE_NAME);
      return Promise.resolve({ db, mongoClient });
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
};

/**
 * Send sensor data.
 * @param socket Socket.IO instance.
 * @param sensorData Sensor data to send.
 */
const sendSensorData = (socket: any, sensorData: GenericSensorData) => {
  delete sensorData._id;
  if (!USE_ORIGINAL_TIMESTAMP) {
    sensorData.payload.ts = new Date();
  }
  socket.emit(WEBSOCKET_CHANNEL_SENSOR_DATA_PUSH, { ...sensorData });
};

/**
 * Send mock data to API.
 * @param sensorDataCollection Collecion containing mock data.
 */
const sendMockData = async (sensorDataCollection: Collection) => {
  let currentDateInData = null;
  const cursor: Cursor = sensorDataCollection
    .find()
    .sort({ 'payload.ts': 1 });
  const count = await cursor.count();
  const progress = nyanProgress();
  progress.start({ message: NYAN_MESSAGES, total: count });
  const socket = io(`ws://${HOST}:3100`);
  while (await cursor.hasNext()) {
    const sensorData: any = await cursor.next();
    if (!!currentDateInData) {
      const deltaT =
        sensorData.payload.ts.getTime() - currentDateInData.getTime();
      // Simulate original timing behavior.
      await sleep(deltaT);
    }
    currentDateInData = sensorData.payload.ts;
    sendSensorData(socket, sensorData);
    progress.tick();
  }
  progress.terminate();
  return Promise.resolve();
};

/**
 * Application main method.
 */
const main = async () => {
  console.log(TITLE);
  console.log('='.repeat(TITLE.length));
  const skipUserReady = process.argv.indexOf('-y') >= 0;
  const ready = skipUserReady || (await askUserReady());
  if (!ready) {
    process.exit(0);
  }
  let mongoClient: MongoClient = null;
  let db: Db = null;
  try {
    const dbInitResult = await connectToMongoDB();
    db = dbInitResult.db;
    mongoClient = dbInitResult.mongoClient;
    if (!db) {
      throw new Error('Invalid database instance.');
    }
  } catch (err) {
    logger.error({ err }, 'Error connecting to MongoDB.');
    process.exit(EXIT_CODE_CONNECTION_ERROR);
  }
  const sensorDataCollection: Collection = db.collection(
    SENSOR_DATA_COLLECTION_NAME,
    {
      slaveOk: true
    }
  );
  await sendMockData(sensorDataCollection);
  await mongoClient.close();
  process.exit(EXIT_CODE_SUCCESS);
};

main();
