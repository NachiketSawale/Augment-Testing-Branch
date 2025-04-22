/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {ILookupEvent, ILookupMultiSelectEvent} from './interfaces/lookup-event.interface';
import { ILookupContext } from './interfaces/lookup-context.interface';

export class LookupEvent<TItem extends object, TEntity extends object> implements ILookupEvent<TItem, TEntity> {
	public instance: unknown;

	public constructor(public context: ILookupContext<TItem, TEntity>, public selectedItem?: TItem | null, public originalEvent?: Event) {
	}
}

export class LookupMultiSelectEvent<TItem extends object, TEntity extends object> implements ILookupMultiSelectEvent<TItem, TEntity> {
	public instance: unknown;

	public constructor(public context: ILookupContext<TItem, TEntity>, public selectedItems?: TItem[] | null, public originalEvent?: Event) {
	}
}