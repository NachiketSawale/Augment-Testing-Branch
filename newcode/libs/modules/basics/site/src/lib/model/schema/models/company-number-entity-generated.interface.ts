/*
 * Copyright(c) RIB Software GmbH
 */

import { ICompanyEntity } from './company-entity.interface';
import { ICompanyNumberReserveEntity } from './company-number-reserve-entity.interface';
import { INumberSequenceEntity } from './number-sequence-entity.interface';
import { IRubricCategoryEntity } from './rubric-category-entity.interface';
import { IRubricEntity } from './rubric-entity.interface';

export interface ICompanyNumberEntityGenerated {
  CheckMask?: string;
  CheckNumber?: boolean;
  CodeGenerationSequenceTypeFk?: number;
  CompanyEntity?: ICompanyEntity;
  CompanyFk?: number;
  CompanyNumberReserveEntities?: Array<ICompanyNumberReserveEntity>;
  GenerateNumber?: boolean;
  Id?: number;
  MaxLength?: number;
  MinLength?: number;
  NumberIndex?: number;
  NumberMask?: string;
  NumberSequenceEntity?: INumberSequenceEntity;
  NumberSequenceFk?: number;
  RubricCategoryEntity?: IRubricCategoryEntity;
  RubricCategoryFk?: number;
  RubricEntity?: IRubricEntity;
  RubricFk?: number;
}
