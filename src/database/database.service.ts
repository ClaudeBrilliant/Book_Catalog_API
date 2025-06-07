import { Pool, PoolClient } from 'pg';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { createDatabasePool } from 'src/config/database.config';

@Injectable()
export class DatabaseService implements OnModuleDestroy, OnModuleInit {
  private pool: Pool;

  async onModuleInit() {
    this.pool = createDatabasePool();
    await this.testConnection();
  }

  async onModuleDestroy() {
    if (this.pool) {
      await this.pool.end();
    }
  }

  private async testConnection(): Promise<void> {
    try {
      const client = await this.pool.connect();
      await client.query('SELECT 1');
      client.release();
      console.log('Database connection established successfully');
    } catch (error) {
      console.error('Failed to connect to database', error);
      throw error;
    }
  }

  async query(text: string, Params?: any[]): Promise<any> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(text, Params);
      return result;
    } finally {
      client.release();
    }
  }

  async getClient(): Promise<PoolClient> {
    return this.pool.connect();
  }

  async Transaction<T>(
    callback: (client: PoolClient) => Promise<T>,
  ): Promise<T> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}
