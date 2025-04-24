/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';

/**
 * qto share line type entity interface
 */
export interface IQtoShareLineTypeEntity extends IEntityBase {
	Id: number;
	CodeInfo: IDescriptionInfo | null;
	DescriptionInfo: IDescriptionInfo | null;
	Sorting: number;
	IsDefault: boolean;
	IsLive: boolean;
}
