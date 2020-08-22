import Redis, { Redis as RedisClient } from 'ioredis';
import cacheConfig from '@config/cache';
import ICacheProvider from '../models/ICacheProvider';

export default class RedisCacheProvider implements ICacheProvider {
  private client: RedisClient;

  constructor() {
    this.client = new Redis(cacheConfig.config.redis);
  }

  public async save(key: string, value: any): Promise<void> {
    // salvar uma informação dentro do redis
    await this.client.set(key, JSON.stringify(value));
  }

  public async invalidate(key: string): Promise<void> {
    await this.client.del(key);
  }

  public async invalidadePrefix(prefix: string): Promise<void> {
    // buscar todas as chaves que iniciam com um prefixo X
    const keys = await this.client.keys(`${prefix}:*`);
    const pipeline = this.client.pipeline();

    keys.forEach(key => {
      pipeline.del(key);
    });

    await pipeline.exec();
  }

  public async recovery<T>(key: string): Promise<T | null> {
    const data = await this.client.get(key);
    if (!data) {
      return null;
    }
    const parsedData = JSON.parse(data) as T;
    return parsedData;
  }
}
