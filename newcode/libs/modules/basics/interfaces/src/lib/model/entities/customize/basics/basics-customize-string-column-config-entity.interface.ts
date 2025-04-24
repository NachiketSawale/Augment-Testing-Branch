/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeStringColumnConfigEntity extends IEntityBase, IEntityIdentification {
	ModuleName: string;
	TableName: string;
	ColumnName: string;
	ColumnSize: number;
	MaxLength: number;
}
