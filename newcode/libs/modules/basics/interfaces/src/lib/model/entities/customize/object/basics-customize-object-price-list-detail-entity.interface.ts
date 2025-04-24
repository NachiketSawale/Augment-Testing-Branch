/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeObjectPriceListDetailEntity extends IEntityBase, IEntityIdentification {
	Code: string;
	DescriptionInfo?: IDescriptionInfo;
	Specification: string;
	UomFk: number;
	Unitprice: number;
	StructureFk: number;
	PricelistFk: number;
	IsDefault: boolean;
	Sorting: number;
	IsLive: boolean;
}
