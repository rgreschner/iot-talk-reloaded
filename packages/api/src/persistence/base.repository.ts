import { MongoDBConnectionService } from './mongodb-connection.service';
import { Injectable } from '@nestjs/common';

/**
 * Repository base class.
 */
@Injectable()
export abstract class BaseRepository<T> {
  constructor(
    protected readonly _mongoConnectionService: MongoDBConnectionService
  ) {}

  /**
   * Get collection.
   */
  public abstract get collection();

  /**
   * Find one document by id.
   * @param _id Id of document to find.
   */
  public async findOneById(_id: any): Promise<T> {
    return await this.collection.findOne({ _id });
  }

  /**
   * Find all documents.
   * @param query Query to match.
   * @param projection Projection options.
   */
  public async findAll(query?: any, projection?: any): Promise<T[]> {
    return await this.collection
      .find(query)
      .project(projection)
      .toArray();
  }

  /**
   * Perform aggregation.
   * @param pipeline Aggregation pipeline.
   */
  public async aggregate(pipeline: any): Promise<any[]> {
    return await this.collection.aggregate(pipeline).toArray();
  }

  /**
   * Insert one document.
   * @param data Document to insert.
   */
  public insertOne(data: T) {
    return this.collection.insertOne(data);
  }
}
