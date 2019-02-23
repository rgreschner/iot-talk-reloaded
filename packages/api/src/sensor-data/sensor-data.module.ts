import { Module } from '@nestjs/common';
import { SensorDataRepository } from './sensor-data.repository';
import { PersistenceModule } from '../persistence/persistence.module';

/**
 * Sensor data module.
 */
@Module({
  imports: [PersistenceModule],
  providers: [SensorDataRepository],
  exports: [SensorDataRepository]
})
export class SensorDataModule {}
