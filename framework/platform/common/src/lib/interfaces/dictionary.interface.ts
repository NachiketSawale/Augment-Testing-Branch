/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

export interface IDictionary<K, T> {

	add(key: K, value: T): void;

  remove(key: K): void;

  containsKey(key: K): boolean;

  get(key: K): T | undefined;

  values(): T[];

	keys(): K[];

}
