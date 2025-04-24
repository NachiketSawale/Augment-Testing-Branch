/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeMainStatusEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	Isplanned: boolean;
	Isactual: boolean;
	IsDefault: boolean;
	Sorting: number;
	Icon: number;
	IsLive: boolean;
	IsDue: boolean;
	Code: string;
	TrafficLightFk: number;
	IsReadOnly: boolean;
}
