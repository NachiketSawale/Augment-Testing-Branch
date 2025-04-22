/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ILookupContext } from './lookup-context.interface';

/**
 * Client side filter
 */
export interface ILookupClientSideFilter<TItem extends object, TEntity extends object> {
	/**
	 * Executor for each lookup item
	 * @param item
	 * @param context
	 */
	execute(item: TItem, context: ILookupContext<TItem, TEntity>): boolean;
}


/**
 * Client side async filter
 */
export interface ILookupClientSideAsyncFilter<TItem extends object, TEntity extends object> {
	/**
	 * Execution
	 * @param items
	 * @param context
	 */
	execute(items: TItem[], context: ILookupContext<TItem, TEntity>): Promise<TItem[]>;
}