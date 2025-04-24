/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizePpsProductionSetStatusEntity extends IEntityBase, IEntityIdentification {
	Id: number;
	RubricCategoryFk: number;
	DescriptionInfo?: IDescriptionInfo;
	Sorting: number;
	Icon: number;
	IsDefault: boolean;
	Isdeletable: boolean;
	Userflag1: boolean;
	Userflag2: boolean;
	IsLive: boolean;
	BackgroundColor: number;
	FontColor: number;
	IsDone: boolean;
	IsFullyCovered: boolean;
	IsNesting: boolean;
	IsNested: boolean;
	Code: string;
	IsLockedDate: boolean;
	IsAssigned: boolean;
	IsLockedQty: boolean;
	IsLockedDateAndQty: boolean;
}
