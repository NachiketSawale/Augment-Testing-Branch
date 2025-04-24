/*
 * Copyright(c) RIB Software GmbH
 */

import { ICompositeBaseEntity } from './composite-base-entity.interface';
import { ColumnDef } from '@libs/ui/common';

export interface ICompareGridState<T extends ICompositeBaseEntity<T>> {
	data: T[];
	columns?: ColumnDef<T>[]
}