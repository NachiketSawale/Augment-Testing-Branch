/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEquipmentGroupEntity } from '@libs/resource/interfaces';
import { IDescriptionInfo, IEntityIdentification, IEntityBase } from '@libs/platform/common';

export interface IEquipmentGroupEntityGenerated extends IEntityIdentification, IEntityBase {
	EquipmentContextFk: number;
	Code: string;
	EquipmentGroupFk?: number;
	PricingGroupFk: number;
	DescriptionInfo?: IDescriptionInfo;
	IsLive: boolean;
	RubricCategoryFk: number;
	SearchPattern?: string;
	CommentText?: string;
	Specification?: string;
	ResTypeFk: number;
	SubGroups?: IEquipmentGroupEntity[];
}