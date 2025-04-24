/*
 * Copyright(c) RIB Software GmbH
 */

import { ICosInstanceEntity } from './cos-instance-entity.interface';
import { IEstLineItemEntity } from './est-line-item-entity.interface';
import { IEstLineitemFormDataEntity } from './est-lineitem-form-data-entity.interface';
import { IFormEntity } from './form-entity.interface';
import { ILgmJobEntity } from './lgm-job-entity.interface';
import { IOrdHeaderEntity } from './ord-header-entity.interface';
import { IPrcPackageEntity } from './prc-package-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IEstLineItemEntityGenerated extends IEntityBase {

  /**
   * AdvancedAllowance
   */
  AdvancedAllowance: number;

  /**
   * AdvancedAllowanceCostUnit
   */
  AdvancedAllowanceCostUnit: number;

  /**
   * Budget
   */
  Budget: number;

  /**
   * BudgetDifference
   */
  BudgetDifference?: number | null;

  /**
   * BudgetUnit
   */
  BudgetUnit: number;

  /**
   * Code
   */
  Code: string;

  /**
   * CommentText
   */
  CommentText?: string | null;

  /**
   * CosInsHeaderFk
   */
  CosInsHeaderFk?: number | null;

  /**
   * CosInstanceEntity
   */
  CosInstanceEntity?: ICosInstanceEntity | null;

  /**
   * CosInstanceFk
   */
  CosInstanceFk?: number | null;

  /**
   * CosMatchtext
   */
  CosMatchtext?: string | null;

  /**
   * CostExchangeRate1
   */
  CostExchangeRate1?: number | null;

  /**
   * CostExchangeRate2
   */
  CostExchangeRate2?: number | null;

  /**
   * CostFactor1
   */
  CostFactor1: number;

  /**
   * CostFactor2
   */
  CostFactor2: number;

  /**
   * CostFactorDetail1
   */
  CostFactorDetail1?: string | null;

  /**
   * CostFactorDetail2
   */
  CostFactorDetail2?: string | null;

  /**
   * CostTotal
   */
  CostTotal: number;

  /**
   * CostUnit
   */
  CostUnit: number;

  /**
   * CostUnitTarget
   */
  CostUnitTarget: number;

  /**
   * Description
   */
  Description?: string | null;

  /**
   * DescriptionTr
   */
  DescriptionTr?: number | null;

  /**
   * DirCostTotal
   */
  DirCostTotal: number;

  /**
   * DirCostUnit
   */
  DirCostUnit: number;

  /**
   * DirCostUnitTarget
   */
  DirCostUnitTarget: number;

  /**
   * DirHoursTotal
   */
  DirHoursTotal: number;

  /**
   * DirHoursUnit
   */
  DirHoursUnit: number;

  /**
   * DirHoursUnitTarget
   */
  DirHoursUnitTarget: number;

  /**
   * DruCostTotal
   */
  DruCostTotal: number;

  /**
   * DruCostUnit
   */
  DruCostUnit: number;

  /**
   * DruCostUnitTarget
   */
  DruCostUnitTarget: number;

  /**
   * DruHoursTotal
   */
  DruHoursTotal: number;

  /**
   * DruHoursUnit
   */
  DruHoursUnit: number;

  /**
   * DruHoursUnitTarget
   */
  DruHoursUnitTarget: number;

  /**
   * EntCostTotal
   */
  EntCostTotal: number;

  /**
   * EntCostUnit
   */
  EntCostUnit: number;

  /**
   * EntCostUnitTarget
   */
  EntCostUnitTarget: number;

  /**
   * EntHoursTotal
   */
  EntHoursTotal: number;

  /**
   * EntHoursUnit
   */
  EntHoursUnit: number;

  /**
   * EntHoursUnitTarget
   */
  EntHoursUnitTarget: number;

  /**
   * EstAssemblyCatFk
   */
  EstAssemblyCatFk?: number | null;

  /**
   * EstAssemblyFk
   */
  EstAssemblyFk?: number | null;

  /**
   * EstCostriskFk
   */
  EstCostriskFk?: number | null;

  /**
   * EstHeaderAssemblyFk
   */
  EstHeaderAssemblyFk?: number | null;

  /**
   * EstHeaderFk
   */
  EstHeaderFk: number;

  /**
   * EstLineItemEntities_EstHeaderAssemblyFk_EstAssemblyFk
   */
  EstLineItemEntities_EstHeaderAssemblyFk_EstAssemblyFk?: IEstLineItemEntity[] | null;

  /**
   * EstLineItemEntities_EstHeaderFk_EstLineItemFk
   */
  EstLineItemEntities_EstHeaderFk_EstLineItemFk?: IEstLineItemEntity[] | null;

  /**
   * EstLineItemEntity_EstHeaderAssemblyFk_EstAssemblyFk
   */
  EstLineItemEntity_EstHeaderAssemblyFk_EstAssemblyFk?: IEstLineItemEntity | null;

  /**
   * EstLineItemEntity_EstHeaderFk_EstLineItemFk
   */
  EstLineItemEntity_EstHeaderFk_EstLineItemFk?: IEstLineItemEntity | null;

  /**
   * EstLineItemFk
   */
  EstLineItemFk?: number | null;

  /**
   * EstLineItemStatusFk
   */
  EstLineItemStatusFk?: number | null;

  /**
   * EstLineitemFormdataEntities
   */
  EstLineitemFormdataEntities?: IEstLineitemFormDataEntity[] | null;

  /**
   * EstQtyRelActFk
   */
  EstQtyRelActFk?: number | null;

  /**
   * EstQtyRelBoqFk
   */
  EstQtyRelBoqFk?: number | null;

  /**
   * EstQtyRelGtuFk
   */
  EstQtyRelGtuFk?: number | null;

  /**
   * EstQtyTelAotFk
   */
  EstQtyTelAotFk?: number | null;

  /**
   * EstRuleSourceFk
   */
  EstRuleSourceFk?: number | null;

  /**
   * FormEntity
   */
  FormEntity?: IFormEntity | null;

  /**
   * FormFk
   */
  FormFk?: number | null;

  /**
   * Fromdate
   */
  Fromdate?: Date | string | null;

  /**
   * HeaderFk
   */
  HeaderFk?: number | null;

  /**
   * Hint
   */
  Hint?: string | null;

  /**
   * HoursTotal
   */
  HoursTotal: number;

  /**
   * HoursUnit
   */
  HoursUnit: number;

  /**
   * HoursUnitTarget
   */
  HoursUnitTarget: number;

  /**
   * Id
   */
  Id: number;

  /**
   * IndCostTotal
   */
  IndCostTotal: number;

  /**
   * IndCostUnit
   */
  IndCostUnit: number;

  /**
   * IndCostUnitTarget
   */
  IndCostUnitTarget: number;

  /**
   * IndHoursTotal
   */
  IndHoursTotal: number;

  /**
   * IndHoursUnit
   */
  IndHoursUnit: number;

  /**
   * IndHoursUnitTarget
   */
  IndHoursUnitTarget: number;

  /**
   * Ischecked
   */
  Ischecked: boolean;

  /**
   * Isdisabled
   */
  Isdisabled: boolean;

  /**
   * IsfixedBudget
   */
  IsfixedBudget: boolean;

  /**
   * Isgc
   */
  Isgc: boolean;

  /**
   * Islumpsum
   */
  Islumpsum: boolean;

  /**
   * Isnomarkup
   */
  Isnomarkup: boolean;

  /**
   * Isoptional
   */
  Isoptional: boolean;

  /**
   * Istemp
   */
  Istemp: boolean;

  /**
   * ItemFk
   */
  ItemFk?: number | null;

  /**
   * LgmJobEntity
   */
  LgmJobEntity?: ILgmJobEntity | null;

  /**
   * LgmJobFk
   */
  LgmJobFk?: number | null;

  /**
   * LineItemType
   */
  LineItemType: number;

  /**
   * MdcAssetMasterFk
   */
  MdcAssetMasterFk?: number | null;

  /**
   * MdcControllingunitFk
   */
  MdcControllingunitFk?: number | null;

  /**
   * MdcCostCodeFk
   */
  MdcCostCodeFk?: number | null;

  /**
   * MdcMaterialFk
   */
  MdcMaterialFk?: number | null;

  /**
   * MdcWicFk
   */
  MdcWicFk?: number | null;

  /**
   * MdcWorkCategoryFk
   */
  MdcWorkCategoryFk?: number | null;

  /**
   * OrdHeaderEntity
   */
  OrdHeaderEntity?: IOrdHeaderEntity | null;

  /**
   * OrdHeaderFk
   */
  OrdHeaderFk?: number | null;

  /**
   * PrcPackage2headerFk
   */
  PrcPackage2headerFk?: number | null;

  /**
   * PrcPackageEntity
   */
  PrcPackageEntity?: IPrcPackageEntity | null;

  /**
   * PrcPackageFk
   */
  PrcPackageFk?: number | null;

  /**
   * PrcStructureFk
   */
  PrcStructureFk?: number | null;

  /**
   * PrjChangeFk
   */
  PrjChangeFk?: number | null;

  /**
   * PrjLocationFk
   */
  PrjLocationFk?: number | null;

  /**
   * PrjSortcode01Fk
   */
  PrjSortcode01Fk?: number | null;

  /**
   * PrjSortcode02Fk
   */
  PrjSortcode02Fk?: number | null;

  /**
   * PrjSortcode03Fk
   */
  PrjSortcode03Fk?: number | null;

  /**
   * PrjSortcode04Fk
   */
  PrjSortcode04Fk?: number | null;

  /**
   * PrjSortcode05Fk
   */
  PrjSortcode05Fk?: number | null;

  /**
   * PrjSortcode06Fk
   */
  PrjSortcode06Fk?: number | null;

  /**
   * PrjSortcode07Fk
   */
  PrjSortcode07Fk?: number | null;

  /**
   * PrjSortcode08Fk
   */
  PrjSortcode08Fk?: number | null;

  /**
   * PrjSortcode09Fk
   */
  PrjSortcode09Fk?: number | null;

  /**
   * PrjSortcode10Fk
   */
  PrjSortcode10Fk?: number | null;

  /**
   * ProductivityFactor
   */
  ProductivityFactor: number;

  /**
   * ProductivityFactorDetail
   */
  ProductivityFactorDetail?: string | null;

  /**
   * PsdActivityFk
   */
  PsdActivityFk?: number | null;

  /**
   * Quantity
   */
  Quantity: number;

  /**
   * QuantityDetail
   */
  QuantityDetail?: string | null;

  /**
   * QuantityFactor1
   */
  QuantityFactor1: number;

  /**
   * QuantityFactor2
   */
  QuantityFactor2: number;

  /**
   * QuantityFactor3
   */
  QuantityFactor3: number;

  /**
   * QuantityFactor4
   */
  QuantityFactor4: number;

  /**
   * QuantityFactorDetail1
   */
  QuantityFactorDetail1?: string | null;

  /**
   * QuantityFactorDetail2
   */
  QuantityFactorDetail2?: string | null;

  /**
   * QuantityTarget
   */
  QuantityTarget: number;

  /**
   * QuantityTargetDetail
   */
  QuantityTargetDetail?: string | null;

  /**
   * QuantityTotal
   */
  QuantityTotal: number;

  /**
   * QuantityUnitTarget
   */
  QuantityUnitTarget: number;

  /**
   * Revenue
   */
  Revenue: number;

  /**
   * Todate
   */
  Todate?: Date | string | null;

  /**
   * UomFk
   */
  UomFk: number;

  /**
   * UomTargetFk
   */
  UomTargetFk: number;

  /**
   * Userdefined1
   */
  Userdefined1?: string | null;

  /**
   * Userdefined2
   */
  Userdefined2?: string | null;

  /**
   * Userdefined3
   */
  Userdefined3?: string | null;

  /**
   * Userdefined4
   */
  Userdefined4?: string | null;

  /**
   * Userdefined5
   */
  Userdefined5?: string | null;

  /**
   * WbsQuantity
   */
  WbsQuantity: number;

  /**
   * WicBoqHeaderFk
   */
  WicBoqHeaderFk?: number | null;

  /**
   * WicBoqItemFk
   */
  WicBoqItemFk?: number | null;

  /**
   * WicCatFk
   */
  WicCatFk?: number | null;
}
