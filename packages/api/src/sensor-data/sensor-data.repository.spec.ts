import { Test } from '@nestjs/testing';
import * as chai from 'chai';
import { expect } from 'chai';
import { MongoDBConnectionService } from '../persistence/mongodb-connection.service';
import { SensorDataRepository } from './sensor-data.repository';
import * as sinon from 'sinon';
import * as chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);

// tslint:disable:prefer-const

describe('SensorDataRepository', () => {
  let sensorDataRepository: SensorDataRepository = null;
  let mongoDBConnectionService: MongoDBConnectionService = null;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      controllers: [],
      providers: [MongoDBConnectionService, SensorDataRepository]
    }).compile();
    mongoDBConnectionService = module.get<MongoDBConnectionService>(
      MongoDBConnectionService
    );
    sensorDataRepository = module.get<SensorDataRepository>(
      SensorDataRepository
    );
  });

  it('should initialize', async () => {
    await mongoDBConnectionService.initialize();
  });

  describe('with method getMeanAccelerationInDateRange', () => {
    it('should throw on invalid start date', async () => {
      // tslint:disable-next-line:no-unused-expression
      expect(
        sensorDataRepository.getMeanAccelerationInDateRange(null, new Date())
      ).rejectedWith(Error, 'Invalid start date.');
    });

    it('should throw on invalid end date', async () => {
      // tslint:disable-next-line:no-unused-expression
      expect(
        sensorDataRepository.getMeanAccelerationInDateRange(new Date(), null)
      ).rejectedWith(Error, 'Invalid end date.');
    });

    it('should calculate mean acceleration correctly', async () => {
      const EXPECTED_MEAN_ACCELERATION = {
        x: -0.5826690910994381,
        y: 0.21681132224808677,
        z: 0.10753701787754522
      };
      const START_DATE = new Date('2019-02-23T14:11:15.885Z');
      const END_DATE = new Date('2019-02-23T14:11:45.707Z');
      const meanAcceleration = await sensorDataRepository.getMeanAccelerationInDateRange(
        START_DATE,
        END_DATE
      );
      for (let key of Object.keys(EXPECTED_MEAN_ACCELERATION)) {
        const delta = Math.abs(
          EXPECTED_MEAN_ACCELERATION[key] - meanAcceleration[key]
        );
        expect(delta).to.be.lessThan(0.001);
      }
    });

    it('should calculate mean acceleration correctly by stub', async () => {
      const EXPECTED_MEAN_ACCELERATION = {
        x: -0.5826690910994381,
        y: 0.21681132224808677,
        z: 0.10753701787754522
      };
      const START_DATE = new Date('2019-02-23T14:11:15.885Z');
      const END_DATE = new Date('2019-02-23T14:11:45.707Z');
      const meanAccelerationStub = sinon.stub(
        sensorDataRepository,
        'getMeanAccelerationInDateRange'
      );
      meanAccelerationStub
        .withArgs(START_DATE, END_DATE)
        .returns(Promise.resolve(EXPECTED_MEAN_ACCELERATION));
      const meanAcceleration = await sensorDataRepository.getMeanAccelerationInDateRange(
        START_DATE,
        END_DATE
      );
      for (let key of Object.keys(EXPECTED_MEAN_ACCELERATION)) {
        const delta = Math.abs(
          EXPECTED_MEAN_ACCELERATION[key] - meanAcceleration[key]
        );
        expect(delta).to.be.lessThan(0.001);
      }
    });
  });

  afterAll(async () => {
    await mongoDBConnectionService.teardown();
  });
});
