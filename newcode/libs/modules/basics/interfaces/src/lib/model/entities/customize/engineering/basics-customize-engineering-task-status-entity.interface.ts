/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeEngineeringTaskStatusEntity extends IEntityBase, IEntityIdentification {
	RubricCategoryFk: number;
	Code: string;
	DescriptionInfo?: IDescriptionInfo;
	Sorting: number;
	Icon: number;
	IsDefault: boolean;
	Isdeletable: boolean;
	Showintasklist: boolean;
	IsLive: boolean;
	Userflag1: boolean;
	Userflag2: boolean;
	Backgroundcolor: number;
	IsEngineering: boolean;
	IsEngineered: boolean;
}
