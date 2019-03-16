import { Module, OnModuleInit } from '@nestjs/common';
import { WebsocketService } from './sensor-data/websocket-sensor-data.service';
import { PersistenceModule } from './persistence/persistence.module';
import { SensorDataModule } from './sensor-data/sensor-data.module';
import { StatisticsModule } from './statistics/statistics.module';

/**
 * Application module.
 */
@Module({
  imports: [PersistenceModule, SensorDataModule, StatisticsModule],
  controllers: [],
  providers: [WebsocketService]
})
export class AppModule implements OnModuleInit {
  constructor(private _websocketService: WebsocketService) {}
  public onModuleInit() {
    this._websocketService.initialize();
  }
}
