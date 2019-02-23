import { Module, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { MongoDBConnectionService } from './mongodb-connection.service';
import { logger } from '../logging/logger.const';

/**
 * Base persistence module.
 */
@Module({
  providers: [MongoDBConnectionService],
  exports: [MongoDBConnectionService]
})
export class PersistenceModule implements OnModuleInit, OnModuleDestroy {
  constructor(
    private readonly _mongodbConnectionService: MongoDBConnectionService
  ) {}

  public async onModuleInit() {
    logger.info('Initializing MongoDB Connection.');
    await this._mongodbConnectionService.initialize();
    logger.info('Initialized MongoDB Connection.');
  }

  public async onModuleDestroy() {
    await this._mongodbConnectionService.teardown();
  }
}
