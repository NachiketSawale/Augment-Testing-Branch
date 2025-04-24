/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */


import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';

import { IRubricIndexEntity } from './rubric-index-entity.interface';
import { IRubricCategoryEntity } from './rubric-category-entity.interface';
import { IRubricCategory2CompanyEntity } from './rubric-category-2company-entity.interface';
import { ICompanyNumberEntity } from './company-number-entity.interface';

export interface IRubricEntity extends IEntityBase {
	CompanyNumberEntities?: ICompanyNumberEntity[] | null;
	DescriptionInfo?: IDescriptionInfo | null;
	Id?: number | null;
	RubricCategory2CompanyEntities?: IRubricCategory2CompanyEntity[] | null;
	RubricCategoryEntities?: IRubricCategoryEntity[] | null;
	RubricIndexEntities?: IRubricIndexEntity[] | null;
}
