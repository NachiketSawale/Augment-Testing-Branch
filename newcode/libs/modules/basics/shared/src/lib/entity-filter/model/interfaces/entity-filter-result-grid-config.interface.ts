/*
 * Copyright(c) RIB Software GmbH
 */

import { ColumnDef, IMenuItemsList } from '@libs/ui/common';
import { IEntityIdentification } from '@libs/platform/common';

/**
 * Interface of entity filter result grid configuration
 */
export interface IEntityFilterResultGridConfig<TEntity extends IEntityIdentification> {
	gridId: string;
	gridColumns: ColumnDef<TEntity>[];
	gridTools?: IMenuItemsList
}