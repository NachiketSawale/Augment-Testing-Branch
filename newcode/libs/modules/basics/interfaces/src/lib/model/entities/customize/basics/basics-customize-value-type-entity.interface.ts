/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeValueTypeEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	Sorting: number;
	IsDefault: boolean;
	IsLive: boolean;
	IsActualValue: boolean;
	IsPreliminaryActual: boolean;
	IsAccrual: boolean;
	IsAdditional: boolean;
	IsActualForRevenueRecognition: boolean;
}
