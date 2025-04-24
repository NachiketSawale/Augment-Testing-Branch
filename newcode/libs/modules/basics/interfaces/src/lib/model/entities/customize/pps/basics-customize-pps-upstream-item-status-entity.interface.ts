/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizePpsUpstreamItemStatusEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	Sorting: number;
	Icon: number;
	IsDefault: boolean;
	IsDeletable: boolean;
	IsFullySpecified: boolean;
	IsDone: boolean;
	UserFlag1: boolean;
	UserFlag2: boolean;
	IsLive: boolean;
	BackgroundColor: number;
	FontColor: number;
	IsInProduction: boolean;
	RubricCategoryFk: number;
	LockForCad: boolean;
}
