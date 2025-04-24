/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo } from '@libs/platform/common';

export interface IEstColumnConfigLineTypeEntity{
	Id: number;
	ShortKeyInfo: IDescriptionInfo;
	DescriptionInfo: IDescriptionInfo;
	Sorting: number
}