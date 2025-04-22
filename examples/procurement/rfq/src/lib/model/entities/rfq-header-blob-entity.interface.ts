/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IRfqHeaderblobEntity extends IEntityBase, IEntityIdentification {
	Id: number;
	PrcTexttypeFk: number;
	RfqHeaderFk: number;
	Content?: string
	PlainText?: string;
	TextModuleTypeFk?: number;
	IsProject: boolean;
}