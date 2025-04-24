/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo } from '@libs/platform/common';

export interface IUrbConfigType{
	Id: number;

	ContextFk: number;

	DescriptionInfo: IDescriptionInfo;

	EstUppConfigFk: number;

	IsDefault: boolean;

	IsLive: boolean;
}