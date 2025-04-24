/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ILookupContext } from './lookup-context.interface';

/**
 * The value type returns from server side filter
 */
export type ServerSideFilterValueType = string | object;

/**
 * Server side filter
 */
export interface ILookupServerSideFilter<TItem extends object, TEntity extends object> {
	/**
	 * Key
	 */
	key: string;

	/**
	 * Executor
	 * @param context
	 */
	execute(context: ILookupContext<TItem, TEntity>): ServerSideFilterValueType | Promise<ServerSideFilterValueType>;
}