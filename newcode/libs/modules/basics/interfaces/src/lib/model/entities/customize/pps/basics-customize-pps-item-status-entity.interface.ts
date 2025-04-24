/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizePpsItemStatusEntity extends IEntityBase, IEntityIdentification {
	Code: string;
	DescriptionInfo?: IDescriptionInfo;
	Sorting: number;
	Icon: number;
	BackgroundColor: number;
	FontColor: number;
	IsInProduction: boolean;
	IsDeletable: boolean;
	IsDefault: boolean;
	IsLive: boolean;
	Userflag1: boolean;
	Userflag2: boolean;
	RubricCategoryFk: number;
	IsMergeAllowed: boolean;
	IsDone: boolean;
	IsForAutoAssignProduct: boolean;
	Isforpreliminary: boolean;
}
