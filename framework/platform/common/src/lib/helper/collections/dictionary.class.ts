/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IDictionary } from '../../interfaces/dictionary.interface';
export class Dictionary<K, T> implements IDictionary<K, T> {
  private data: Map<K, T> = new Map<K, T>();

  public add(key: K, value: T): void {
    this.data.set(key, value);
  }

  public remove(key: K): void {
    this.data.delete(key);
  }

  public containsKey(key: K): boolean {
    return this.data.has(key);
  }

  public get(key: K): T | undefined {
    return this.data.get(key);
  }

  public keys(): K[] {
    const keys: K[] = [];
    for (const aKey of this.data.keys()) {
      keys.push(aKey);
    }
    return keys;
  }
  public values(): T[] {
    const values: T[] = [];
    for (const aValue of this.data.values()) {
      values.push(aValue);
    }
    return values;
  }
}
