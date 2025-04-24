/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeLogisticsContextEntity extends IEntityBase, IEntityIdentification {
	Code: string;
	DescriptionInfo?: IDescriptionInfo;
	IsDefault: boolean;
	Sorting: number;
	IsLive: boolean;
	UomWeightFk: number;
	UomVolumeFk: number;
	UomDayFk: number;
	UomHourFk: number;
	UomMonthFk: number;
	UomIdleFk: number;
}
