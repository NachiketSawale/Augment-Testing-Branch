/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';
import { IBoqItemEntity } from './boq-item-entity.interface';

export interface IBoqWic2assemblyEntityGenerated extends IEntityBase {

/*
 * BasUomFk
 */
  BasUomFk?: number | null;

/*
 * BoqHeaderFk
 */
  BoqHeaderFk: number;

/*
 * BoqItemEntity
 */
  BoqItemEntity?: IBoqItemEntity | null;

/*
 * BoqItemFk
 */
  BoqItemFk: number;

/*
 * Code
 */
  Code?: string | null;

/*
 * CommentText
 */
  CommentText?: string | null;

/*
 * CostFactor1
 */
  CostFactor1?: number | null;

/*
 * CostFactor2
 */
  CostFactor2?: number | null;

/*
 * CostFactorDetail1
 */
  CostFactorDetail1?: string | null;

/*
 * CostFactorDetail2
 */
  CostFactorDetail2?: string | null;

/*
 * CostTotal
 */
  CostTotal?: number | null;

/*
 * CostUnit
 */
  CostUnit?: number | null;

/*
 * CostUnitTarget
 */
  CostUnitTarget?: number | null;

/*
 * EstAssemblyCatFk
 */
  EstAssemblyCatFk?: number | null;

/*
 * EstAssemblyFk
 */
  EstAssemblyFk?: number | null;

/*
 * EstCostRiskFk
 */
  EstCostRiskFk?: number | null;

/*
 * EstHeaderFk
 */
  EstHeaderFk: number;

/*
 * EstLineItemFk
 */
  EstLineItemFk: number;

/*
 * HoursTotal
 */
  HoursTotal?: number | null;

/*
 * HoursUnit
 */
  HoursUnit?: number | null;

/*
 * HoursUnitTarget
 */
  HoursUnitTarget?: number | null;

/*
 * Id
 */
  Id: number;

/*
 * IsDisabled
 */
  IsDisabled?: boolean | null;

/*
 * IsLumpsum
 */
  IsLumpsum?: boolean | null;

/*
 * LgmJobFk
 */
  LgmJobFk?: number | null;

/*
 * LicCostGroup1Fk
 */
  LicCostGroup1Fk?: number | null;

/*
 * LicCostGroup2Fk
 */
  LicCostGroup2Fk?: number | null;

/*
 * LicCostGroup3Fk
 */
  LicCostGroup3Fk?: number | null;

/*
 * LicCostGroup4Fk
 */
  LicCostGroup4Fk?: number | null;

/*
 * LicCostGroup5Fk
 */
  LicCostGroup5Fk?: number | null;

/*
 * ProductivityFactor
 */
  ProductivityFactor?: number | null;

/*
 * Quantity
 */
  Quantity?: number | null;

/*
 * QuantityDetail
 */
  QuantityDetail?: string | null;

/*
 * QuantityFactor1
 */
  QuantityFactor1?: number | null;

/*
 * QuantityFactor2
 */
  QuantityFactor2?: number | null;

/*
 * QuantityFactor3
 */
  QuantityFactor3?: number | null;

/*
 * QuantityFactor4
 */
  QuantityFactor4?: number | null;

/*
 * QuantityFactorDetail1
 */
  QuantityFactorDetail1?: string | null;

/*
 * QuantityFactorDetail2
 */
  QuantityFactorDetail2?: string | null;

/*
 * QuantityTotal
 */
  QuantityTotal?: number | null;

/*
 * QuantityUnitTarget
 */
  QuantityUnitTarget?: number | null;

/*
 * Wic2AssemblyQuantity
 */
  Wic2AssemblyQuantity: number;

/*
 * WicEstAssembly2WicFlagFk
 */
  WicEstAssembly2WicFlagFk: number;

/*
 * WorkContentInfo
 */
  WorkContentInfo?: IDescriptionInfo | null;
}
