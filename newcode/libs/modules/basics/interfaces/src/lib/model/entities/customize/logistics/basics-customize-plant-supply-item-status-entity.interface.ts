/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizePlantSupplyItemStatusEntity extends IEntityBase, IEntityIdentification {
	Code: string;
	DescriptionInfo?: IDescriptionInfo;
	IsSettled: boolean;
	IsReadyForSettlement: boolean;
	IsReadOnly: boolean;
	IsDefault: boolean;
	Sorting: number;
	Icon: number;
	IsLive: boolean;
}
