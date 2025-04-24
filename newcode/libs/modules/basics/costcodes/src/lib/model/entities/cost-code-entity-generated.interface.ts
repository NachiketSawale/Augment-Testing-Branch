/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IAbcClassificationEntity } from './abc-classification-entity.interface';
import { ICostCode2ResTypeEntity } from './cost-code-2res-type-entity.interface';
import { ICostCodeEntity } from './cost-code-entity.interface';
import { ICostCodeCompanyEntity } from './cost-code-company-entity.interface';
import { ICostcodePortionsEntity } from './costcode-portions-entity.interface';
import { ICostcodeTypeEntity } from './costcode-type-entity.interface';
import { ICostgroupPortionsEntity } from './costgroup-portions-entity.interface';
import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';

export interface ICostCodeEntityGenerated extends IEntityBase {

/*
 * AbcClassificationEntity
 */
  AbcClassificationEntity?: IAbcClassificationEntity | null;

/*
 * AbcClassificationFk
 */
  AbcClassificationFk?: number | null;

/*
 * Co2Project
 */
  Co2Project?: number | null;

/*
 * Co2Source
 */
  Co2Source?: number | null;

/*
 * Co2SourceFk
 */
  Co2SourceFk?: number | null;

/*
 * Code
 */
  Code?: string | null;

/*
 * ContextFk
 */
  ContextFk?: number | null;

/*
 * ContrCostCodeFk
 */
  ContrCostCodeFk: number;

/*
 * Contribution
 */
  Contribution?: number | null;

/*
 * CostCode2resTypeEntities
 */
  CostCode2resTypeEntities?: ICostCode2ResTypeEntity[] | null;

/*
 * CostCodeChildren
 */
  CostCodeChildren?: ICostCodeEntity[] | null;

/*
 * CostCodeCompanyEntities
 */
  CostCodeCompanyEntities?: ICostCodeCompanyEntity[] | null;

/*
 * CostCodeEntities_CostCodeLevel2Fk
 */
  CostCodeEntities_CostCodeLevel2Fk?: ICostCodeEntity[] | null;

/*
 * CostCodeEntities_CostCodeLevel3Fk
 */
  CostCodeEntities_CostCodeLevel3Fk?: ICostCodeEntity[] | null;

/*
 * CostCodeEntities_CostCodeLevel4Fk
 */
  CostCodeEntities_CostCodeLevel4Fk?: ICostCodeEntity[] | null;

/*
 * CostCodeEntities_CostCodeLevel5Fk
 */
  CostCodeEntities_CostCodeLevel5Fk?: ICostCodeEntity[] | null;

/*
 * CostCodeEntities_CostCodeLevel6Fk
 */
  CostCodeEntities_CostCodeLevel6Fk?: ICostCodeEntity[] | null;

/*
 * CostCodeEntities_CostCodeLevel7Fk
 */
  CostCodeEntities_CostCodeLevel7Fk?: ICostCodeEntity[] | null;

/*
 * CostCodeEntities_CostCodeLevel8Fk
 */
  CostCodeEntities_CostCodeLevel8Fk?: ICostCodeEntity[] | null;

/*
 * CostCodeEntity_CostCodeLevel2Fk
 */
  CostCodeEntity_CostCodeLevel2Fk?: ICostCodeEntity | null;

/*
 * CostCodeEntity_CostCodeLevel3Fk
 */
  CostCodeEntity_CostCodeLevel3Fk?: ICostCodeEntity | null;

/*
 * CostCodeEntity_CostCodeLevel4Fk
 */
  CostCodeEntity_CostCodeLevel4Fk?: ICostCodeEntity | null;

/*
 * CostCodeEntity_CostCodeLevel5Fk
 */
  CostCodeEntity_CostCodeLevel5Fk?: ICostCodeEntity | null;

/*
 * CostCodeEntity_CostCodeLevel6Fk
 */
  CostCodeEntity_CostCodeLevel6Fk?: ICostCodeEntity | null;

/*
 * CostCodeEntity_CostCodeLevel7Fk
 */
  CostCodeEntity_CostCodeLevel7Fk?: ICostCodeEntity | null;

/*
 * CostCodeEntity_CostCodeLevel8Fk
 */
  CostCodeEntity_CostCodeLevel8Fk?: ICostCodeEntity | null;

/*
 * CostCodeLevel1Fk
 */
  CostCodeLevel1Fk?: number | null;

/*
 * CostCodeLevel2Fk
 */
  CostCodeLevel2Fk?: number | null;

/*
 * CostCodeLevel3Fk
 */
  CostCodeLevel3Fk?: number | null;

/*
 * CostCodeLevel4Fk
 */
  CostCodeLevel4Fk?: number | null;

/*
 * CostCodeLevel5Fk
 */
  CostCodeLevel5Fk?: number | null;

/*
 * CostCodeLevel6Fk
 */
  CostCodeLevel6Fk?: number | null;

/*
 * CostCodeLevel7Fk
 */
  CostCodeLevel7Fk?: number | null;

/*
 * CostCodeLevel8Fk
 */
  CostCodeLevel8Fk?: number | null;

/*
 * CostCodeParent
 */
  CostCodeParent?: ICostCodeEntity | null;

/*
 * CostCodeParentFk
 */
  CostCodeParentFk?: number | null;

/*
 * CostCodePortionsFk
 */
  CostCodePortionsFk?: number | null;

/*
 * CostCodeTypeFk
 */
  CostCodeTypeFk?: number | null;

/*
 * CostCodes
 */
  CostCodes?: ICostCodeEntity[] | null;

/*
 * CostGroupPortionsFk
 */
  CostGroupPortionsFk?: number | null;

/*
 * CostcodePortionsEntity
 */
  CostcodePortionsEntity?: ICostcodePortionsEntity | null;

/*
 * CostcodeTypeEntity
 */
  CostcodeTypeEntity?: ICostcodeTypeEntity | null;

/*
 * CostgroupPortionsEntity
 */
  CostgroupPortionsEntity?: ICostgroupPortionsEntity | null;

/*
 * CurrencyFk
 */
  CurrencyFk?: number | null;

/*
 * DayWorkRate
 */
  DayWorkRate?: number | null;

/*
 * Description2Info
 */
  Description2Info?: IDescriptionInfo | null;

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * EfbType221Fk
 */
  EfbType221Fk?: number | null;

/*
 * EfbType222Fk
 */
  EfbType222Fk?: number | null;

/*
 * EstCostTypeFk
 */
  EstCostTypeFk?: number | null;

/*
 * FactorCosts
 */
  FactorCosts?: number | null;

/*
 * FactorHour
 */
  FactorHour?: number | null;

/*
 * FactorQuantity
 */
  FactorQuantity?: number | null;

/*
 * HasChildren
 */
  HasChildren?: boolean | null;

/*
 * HourUnit
 */
  HourUnit?: number | null;

/*
 * Id
 */
  Id: number ;

/*
 * IsBudget
 */
  IsBudget?: boolean | null;

/*
 * IsCost
 */
  IsCost?: boolean | null;

/*
 * IsCustomProjectCostCode
 */
  IsCustomProjectCostCode?: boolean | null;

/*
 * IsEditable
 */
  IsEditable?: boolean | null;

/*
 * IsEstimateCostCode
 */
  IsEstimateCostCode?: boolean | null;

/*
 * IsInformation
 */
  IsInformation?: boolean | null;

/*
 * IsLabour
 */
  IsLabour?: boolean | null;

/*
 * IsOnlyProjectCostCode
 */
  IsOnlyProjectCostCode?: boolean | null;

/*
 * IsProjectChildAllowed
 */
  IsProjectChildAllowed?: boolean | null;

/*
 * IsRate
 */
  IsRate?: boolean | null;

/*
 * IsRefereToProjectCostCode
 */
  IsRefereToProjectCostCode?: boolean | null;

/*
 * IsRuleMarkupCostCode
 */
  IsRuleMarkupCostCode?: boolean | null;

/*
 * IsSubcontractor
 */
  IsSubcontractor?: boolean | null;

/*
 * OriginalPrjCostCodeId
 */
  OriginalPrjCostCodeId?: number | null;

/*
 * PrcStructureFk
 */
  PrcStructureFk?: number | null;

/*
 * Rate
 */
  Rate?: number | null;

/*
 * RealFactorCosts
 */
  RealFactorCosts?: number | null;

/*
 * RealFactorQuantity
 */
  RealFactorQuantity?: number | null;

/*
 * Remark
 */
  Remark?: string | null;

/*
 * SearchPattern
 */
  SearchPattern?: string | null;

/*
 * Surcharge
 */
  Surcharge?: number | null;

/*
 * UomFk
 */
  UomFk?: number | null;

/*
 * UserDefined1
 */
  UserDefined1?: string | null;

/*
 * UserDefined2
 */
  UserDefined2?: string | null;

/*
 * UserDefined3
 */
  UserDefined3?: string | null;

/*
 * UserDefined4
 */
  UserDefined4?: string | null;

/*
 * UserDefined5
 */
  UserDefined5?: string | null;

/*
 * UserDefinedcolVal
 */
  UserDefinedcolVal?: unknown | null;

/*
 * isOverwrite
 */
  isOverwrite?:boolean|null;


/*
 * isAssignToChildren
 */
  isAssignToChildren?:boolean|null;
  
/*
 * image
 */
  Image?: string | null;

/*
 * dtos
 */
  dtos?: ICostCodeEntity[];
}
