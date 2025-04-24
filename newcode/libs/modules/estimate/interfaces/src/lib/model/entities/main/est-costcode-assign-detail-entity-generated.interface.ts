/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEstTotalsConfigDetailEntity } from './est-totals-config-detail-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IEstCostcodeAssignDetailEntityGenerated extends IEntityBase {

/*
 * Addorsubtract
 */
  Addorsubtract?: number | null;

/*
 * BasUomFk
 */
  BasUomFk?: number | null;

/*
 * CostcodeTypeFk
 */
  CostcodeTypeFk?: number | null;

/*
 * CurrencyFk
 */
  CurrencyFk?: number | null;

/*
 * Description
 */
  Description?: string | null;

/*
 * EstTotalsconfigdetailEntity
 */
  EstTotalsconfigdetailEntity?: IEstTotalsConfigDetailEntity | null;

/*
 * EstTotalsconfigdetailFk
 */
  EstTotalsconfigdetailFk?: number | null;

/*
 * Id
 */
  Id: number;

/*
 * IsCostRisk
 */
  IsCostRisk?: boolean | null;

/*
 * IsCustomProjectCostCode
 */
  IsCustomProjectCostCode?: boolean | null;

/*
 * IsDirectEnteredCost
 */
  IsDirectEnteredCost?: boolean | null;

/*
 * IsDirectRulesCost
 */
  IsDirectRulesCost?: boolean | null;

/*
 * IsIndirectCost
 */
  IsIndirectCost?: boolean | null;

/*
 * IsNonCostRisk
 */
  IsNonCostRisk?: boolean | null;

/*
 * MdcCostCodeFk
 */
  MdcCostCodeFk?: number | null;

/*
 * Project2mdcCstCdeFk
 */
  Project2mdcCstCdeFk?: number | null;
}
