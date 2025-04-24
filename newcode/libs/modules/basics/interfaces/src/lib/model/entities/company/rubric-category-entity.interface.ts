/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */


import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';
import { IRubricEntity } from './rubric-entity.interface';
import { ICompanyNumberEntity } from './company-number-entity.interface';
import { IRubricCategory2CompanyEntity } from './rubric-category-2company-entity.interface';

export interface IRubricCategoryEntity extends IEntityBase {
	BasRubricFk?: number | null;
	CompanyNumberEntities?: ICompanyNumberEntity[] | null;
	DescriptionInfo?: IDescriptionInfo | null;
	DescriptionInfoShort?: IDescriptionInfo | null;
	Id?: number | null;
	Isdefault?: boolean | null;
	Islive?: boolean | null;
	RubricCategory2CompanyEntities?: IRubricCategory2CompanyEntity[] | null;
	RubricEntity?: IRubricEntity | null;
	Sorting?: number | null;
}
