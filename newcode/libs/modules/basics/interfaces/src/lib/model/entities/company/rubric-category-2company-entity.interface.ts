/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */


import { IEntityBase } from '@libs/platform/common';
import { IRubricCategoryEntity } from './rubric-category-entity.interface';
import { ICompanyEntity } from './company-entity.interface';
import { IRubricEntity } from './rubric-entity.interface';


export interface IRubricCategory2CompanyEntity extends IEntityBase {
	CompanyEntity?: ICompanyEntity | null;
	CompanyFk?: number | null;
	Id?: number | null;
	RubricCategoryEntity?: IRubricCategoryEntity | null;
	RubricCategoryFk?: number | null;
	RubricEntity?: IRubricEntity | null;
	RubricFk?: number | null;
}
