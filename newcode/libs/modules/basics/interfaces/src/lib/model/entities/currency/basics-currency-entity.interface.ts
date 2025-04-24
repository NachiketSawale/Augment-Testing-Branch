/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCurrencyEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	Currency:string,
	SortBy:boolean,
	IsDefault:boolean,
	DisplayPrecision:number,
	ConversionPrecision:number,
	RoundLogicTypeFk:number
}
