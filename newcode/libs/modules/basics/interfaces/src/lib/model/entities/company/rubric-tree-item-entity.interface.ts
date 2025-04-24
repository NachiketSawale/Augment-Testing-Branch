/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */


import { IEntityBase } from '@libs/platform/common';

export interface IRubricTreeItemEntity extends IEntityBase {

	Children?: IRubricTreeItemEntity[] | null;
	//DescriptionInfo?: IDescriptionTranslateType | null;
	HasChildren?: boolean | null;
	Id?: number | null;
	IndexId?: number | null;
	OriginId?: number | null;
	ParentId?: number | null;
	RubricCategoryId?: number | null;
	RubricId?: number | null;
	Type?: string | null;
}
