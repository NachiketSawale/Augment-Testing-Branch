/*
 * Copyright(c) RIB Software GmbH
 */
import { IDescriptionInfo } from '@libs/platform/common';

/**
 * Properties for entity status lookup.
 */
export interface IEntityStatus {
	Id: number;
	DescriptionInfo: IDescriptionInfo;
	Sorting: number;
	IsDefault: boolean;
	Icon: number;
	IsOptionalUpwards: boolean;
	IsOptionalDownwards: boolean;
	IsLive: boolean;
	IsReadonly: boolean;
	BackGroundColor: number;
}