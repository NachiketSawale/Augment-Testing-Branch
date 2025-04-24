/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizePriceListEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	ContextFk: number;
	IsDefault: boolean;
	Sorting: number;
	CurrencyFk: number;
	IsLive: boolean;
}
