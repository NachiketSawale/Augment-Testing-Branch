/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo } from '@libs/platform/common';

/**
 * TODO-DRIZZLE: Using the global definition.
 */
export interface ILookupDataEntity {
	Id: number;
	ValueMember: number
	DisplayMember: string;
	Sorting?: number;
	IsDefault?: boolean;
	IsLive?: boolean;
	MasterDataContextFk?: number;
	CompanyFk?: number;
	DescriptionInfo: IDescriptionInfo;
	Icon?: number;
	CustomIntegerAttribute?: number;
	CustomIntegerAttribute1?: number;
	CustomBoolAttribute?: boolean;
	CustomBoolAttribute1?: boolean;
}

export interface ICustomItemType extends ILookupDataEntity {
	DisplayName: string;
}