/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeProcurementConfigurationHeaderTypeEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	IsMaterial: boolean;
	IsEquipment: boolean;
	IsService: boolean;
	Sorting: number;
	IsLive: boolean;
}
