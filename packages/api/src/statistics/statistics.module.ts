import { Module } from '@nestjs/common';
import { PersistenceModule } from '../persistence/persistence.module';
import { StatisticsController } from './statistics.controller';
import { SensorDataModule } from '../sensor-data/sensor-data.module';

/**
 * Statistics module.
 */
@Module({
  imports: [PersistenceModule, SensorDataModule],
  controllers: [StatisticsController]
})
export class StatisticsModule {}
