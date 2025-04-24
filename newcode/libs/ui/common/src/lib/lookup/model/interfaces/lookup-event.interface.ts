/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ILookupContext } from './lookup-context.interface';

export interface ILookupEvent<TItem extends object, TEntity extends object> {
	context: ILookupContext<TItem, TEntity>,
	selectedItem?: TItem | null,
	originalEvent?: Event
}

export interface ILookupMultiSelectEvent<TItem extends object, TEntity extends object> {
	context: ILookupContext<TItem, TEntity>,
	selectedItems?: TItem[] | null,
	originalEvent?: Event
}