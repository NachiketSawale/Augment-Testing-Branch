/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */


import { IEntityBase } from '@libs/platform/common';
import { ICompanyNumberReserveEntity } from './company-number-reserve-entity.interface';
import { INumberSequenceEntity } from './number-sequence-entity.interface';
import { IRubricCategoryEntity } from './rubric-category-entity.interface';
import { IRubricEntity } from './rubric-entity.interface';
import { ICompanyEntity } from './company-entity.interface';

export interface ICompanyNumberEntity extends IEntityBase {
	CheckMask?: string | null;
	CheckNumber?: boolean | null;
	CodeGenerationSequenceTypeFk?: number | null;
	CompanyEntity?: ICompanyEntity | null;
	CompanyFk?: number | null;
	CompanyNumberReserveEntities?: ICompanyNumberReserveEntity[] | null;
	GenerateNumber?: boolean | null;
	Id?: number | null;
	MaxLength?: number | null;
	MinLength?: number | null;
	NumberIndex?: number | null;
	NumberMask?: string | null;
	NumberSequenceEntity?: INumberSequenceEntity | null;
	NumberSequenceFk?: number | null;
	RubricCategoryEntity?: IRubricCategoryEntity | null;
	RubricCategoryFk?: number | null;
	RubricEntity?: IRubricEntity | null;
	RubricFk?: number | null;
}
