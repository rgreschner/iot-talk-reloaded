// Host to connect to using SOCKET.IO.
export const HOST = 'localhost';

export const DATABASE_CONNECTION_STRING = 'mongodb://localhost:27017';
export const DATABASE_NAME = 'iot-data';
export const DATABASE_MAX_CONNECTION_RETRIES = 3;
export const DATABASE_CONNECTION_RETRY_INTERVAL_SECONDS = 10;
export const SENSOR_DATA_COLLECTION_NAME = 'sensorDataMock';
export const WEBSOCKET_CHANNEL_SENSOR_DATA_PUSH = 'sensor-data-push';

// Use original timestamp of recorded mock data.
export const USE_ORIGINAL_TIMESTAMP = false;
