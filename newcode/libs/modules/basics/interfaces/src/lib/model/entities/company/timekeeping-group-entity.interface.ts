/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */


import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';
import { IRubricCategoryEntity } from './rubric-category-entity.interface';


export interface ITimekeepingGroupEntity extends IEntityBase {
	ClerkFk?: number | null;
	Code?: string | null;
	CompanyFk?: number | null;
	DescriptionInfo?: IDescriptionInfo | null;
	Icon?: number | null;
	Id?: number | null;
	IsDefault?: boolean | null;
	IsLive?: boolean | null;
	RoundingConfigFk?: number | null;
	RubricCategoryEntity?: IRubricCategoryEntity | null;
	RubricCategoryFk?: number | null;
	Sorting?: number | null;
	TimesheetContextFk?: number | null;
}
