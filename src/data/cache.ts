import NodeCache, { ValueSetItem } from 'node-cache';

interface CacheItem {
  key: string;
  val: any;
  ttl?: string | number;
}

class Cache {
  private static instance: NodeCache;

  private constructor() {}

  static stdTTL = 24 * 60 * 60;
  public static getInstance(): NodeCache {
    if (!Cache.instance) {
      const stdTTL = Cache.stdTTL;
      Cache.instance = new NodeCache( { stdTTL });
    }
    return Cache.instance;
  }

  public static setItem(item: CacheItem): boolean {
    try {
      const cache = Cache.getInstance();
      return cache.set(item.key, item.val, item.ttl || Cache.stdTTL);
    } catch (error: any) {
      console.error(`Error in Cache.setItem: ${error.message}`);
      return false;
    }
  }

  public static getItem(key: string): any {
    try {
      const cache = Cache.getInstance();
      return cache.get(key);
    } catch (error: any) {
      console.error(`Error in Cache.getItem: ${error.message}`);
      return null;
    }
  }

  public static deleteItem(key: string): number {
    try {
      const cache = Cache.getInstance();
      return cache.del(key);
    } catch (error: any) {
      console.error(`Error in Cache.deleteItem: ${error.message}`);
      return 0;
    }
  }

  public static flush(): void {
    try {
      const cache = Cache.getInstance();
      cache.flushAll();
    } catch (error: any) {
      console.error(`Error in Cache.flush: ${error.message}`);
    }
  }

  public static getKeys(): string[] {
    try {
      const cache = Cache.getInstance();
      return cache.keys();
    } catch (error: any) {
      console.error(`Error in Cache.getKeys: ${error.message}`);
      return [];
    }
  }

  public static mSet(items: ValueSetItem<unknown>[]): void {
    try {
      const cache = Cache.getInstance();
      cache.mset(items);
    } catch (error: any) {
      console.error(`Error in Cache.mSet: ${error.message}`);
    }
  }
}

export default Cache;
