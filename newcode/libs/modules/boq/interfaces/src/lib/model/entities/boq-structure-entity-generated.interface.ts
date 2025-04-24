/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IBoqStructureDetailEntity } from './boq-structure-detail-entity.interface';
import { IEntityBase } from '@libs/platform/common';
import { IBoqCatAssignConfEntity } from './boq-cat-assign-conf-entity.interface';
import { IBoqCatAssignConfTypeEntity } from './boq-cat-assign-conf-type-entity.interface';
import { IBoqRoundingConfigEntity } from './boq-rounding-config-entity.interface';
import { IBoqRoundingConfigTypeEntity } from './boq-rounding-config-type-entity.interface';

export interface IBoqStructureEntityGenerated extends IEntityBase {

/*
 * AutoAtCopy
 */
  AutoAtCopy: boolean;

/*
 * BoqCatAssignConfEntity
 */
  BoqCatAssignConfEntity?: IBoqCatAssignConfEntity | null;

/*
 * BoqCatAssignConfTypeEntity
 */
  BoqCatAssignConfTypeEntity?: IBoqCatAssignConfTypeEntity | null;

/*
 * BoqCatAssignConfTypeFk
 */
  BoqCatAssignConfTypeFk?: number | null;

/*
 * BoqCatAssignFk
 */
  BoqCatAssignFk?: number | null;

/*
 * BoqRoundingConfig
 */
  BoqRoundingConfig?: IBoqRoundingConfigEntity | null;

/*
 * BoqRoundingConfigFk
 */
  BoqRoundingConfigFk: number;

/*
 * BoqRoundingConfigTypeFk
 */
  BoqRoundingConfigTypeFk?: number | null;

/*
 * BoqRoundingconfigtypeEntity
 */
  BoqRoundingconfigtypeEntity?: IBoqRoundingConfigTypeEntity | null;

/*
 * BoqStandardFk
 */
  BoqStandardFk?: number | null;

/*
 * BoqStructureDetailEntities
 */
  BoqStructureDetailEntities?: IBoqStructureDetailEntity[] | null;

/*
 * Boqmask
 */
  Boqmask?: string | null;

/*
 * CalcFromUrb
 */
  CalcFromUrb: boolean;

/*
 * CopyEstimateOrAssembly
 */
  CopyEstimateOrAssembly: boolean;

/*
 * DefaultSpecification
 */
  DefaultSpecification: boolean;

/*
 * Description
 */
  Description?: string | null;

/*
 * DescriptionTr
 */
  DescriptionTr?: number | null;

/*
 * DiscountAllowed
 */
  DiscountAllowed: boolean;

/*
 * EnforceStructure
 */
  EnforceStructure: boolean;

/*
 * Id
 */
  Id: number;

/*
 * Isdefault
 */
  Isdefault: boolean;

/*
 * KeepBudget
 */
  KeepBudget: boolean;

/*
 * KeepQuantity
 */
  KeepQuantity: boolean;

/*
 * KeepRefNo
 */
  KeepRefNo: boolean;

/*
 * KeepUnitRate
 */
  KeepUnitRate: boolean;

/*
 * LeadingZeros
 */
  LeadingZeros: boolean;

/*
 * NameUrb1
 */
  NameUrb1?: string | null;

/*
 * NameUrb2
 */
  NameUrb2?: string | null;

/*
 * NameUrb3
 */
  NameUrb3?: string | null;

/*
 * NameUrb4
 */
  NameUrb4?: string | null;

/*
 * NameUrb5
 */
  NameUrb5?: string | null;

/*
 * NameUrb6
 */
  NameUrb6?: string | null;

/*
 * NameUserdefined1
 */
  NameUserdefined1?: string | null;

/*
 * NameUserdefined2
 */
  NameUserdefined2?: string | null;

/*
 * NameUserdefined3
 */
  NameUserdefined3?: string | null;

/*
 * NameUserdefined4
 */
  NameUserdefined4?: string | null;

/*
 * NameUserdefined5
 */
  NameUserdefined5?: string | null;

/*
 * PredefinedStructure
 */
  PredefinedStructure?: boolean | null;

/*
 * SectionAllowed
 */
  SectionAllowed: boolean;

/*
 * SkippedHierarchiesAllowed
 */
  SkippedHierarchiesAllowed: boolean;

/*
 * Sorting
 */
  Sorting: number;

/*
 * SpecificationLimit
 */
  SpecificationLimit: number;

/*
 * TotalHour
 */
  TotalHour: boolean;
}
