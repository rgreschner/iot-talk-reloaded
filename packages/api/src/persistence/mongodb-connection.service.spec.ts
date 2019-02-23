import { MongoDBConnectionService } from './mongodb-connection.service';
import { expect } from 'chai';

// tslint:disable:no-unused-expression

describe('MongoDBConnectionService', () => {
  describe('basic tests', () => {
    it('should initialize', async () => {
      const mongoDBConnectionService = new MongoDBConnectionService();
      expect(mongoDBConnectionService.db).to.not.exist;
      await mongoDBConnectionService.initialize();
      expect(mongoDBConnectionService.db).to.exist;
      await mongoDBConnectionService.teardown();
    });
  });

  describe('single instance tests', () => {
    let mongoDBConnectionService = null;

    beforeAll(async () => {
      mongoDBConnectionService = new MongoDBConnectionService();
      await mongoDBConnectionService.initialize();
    });

    it('should use expected database', async () => {
      const EXPECTED_DATABASE_NAME = 'iot-data';
      expect(mongoDBConnectionService.db.databaseName).to.equal(
        EXPECTED_DATABASE_NAME
      );
    });

    it('should get server status', async () => {
      const serverStatus = await mongoDBConnectionService.getServerStatus();
      expect(serverStatus.ok).to.equal(1);
    });

    afterAll(async () => {
      await mongoDBConnectionService.teardown();
    });
  });
});
