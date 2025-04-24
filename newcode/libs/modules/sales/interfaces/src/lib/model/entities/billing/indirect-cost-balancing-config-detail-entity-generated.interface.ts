/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IIndirectCostBalancingConfigDetailEntityGenerated extends IEntityBase {

  /**
   * AdminGeneralPercentage
   */
  AdminGeneralPercentage: number;

  /**
   * CalculationBase
   */
  CalculationBase: number;

  /**
   * ContractId
   */
  ContractId?: number | null;

  /**
   * Id
   */
  Id: number;

  /**
   * IsBalanceBoqItemPrjChg
   */
  IsBalanceBoqItemPrjChg: boolean;

  /**
   * IsBalanceBoqItemType2BaseAlt
   */
  IsBalanceBoqItemType2BaseAlt: boolean;

  /**
   * IsBalanceBoqItemTypeDwtmItem
   */
  IsBalanceBoqItemTypeDwtmItem: boolean;

  /**
   * IsBalanceBoqItemTypeOptional
   */
  IsBalanceBoqItemTypeOptional: boolean;

  /**
   * IsDeficitDjcProfit
   */
  IsDeficitDjcProfit: boolean;

  /**
   * IsDeficitDjcRisk
   */
  IsDeficitDjcRisk: boolean;

  /**
   * IsDeficitGcProfit
   */
  IsDeficitGcProfit: boolean;

  /**
   * IsDeficitGcRisk
   */
  IsDeficitGcRisk: boolean;

  /**
   * IsLowerLimitPrjChgItem
   */
  IsLowerLimitPrjChgItem: boolean;

  /**
   * IsLowerLimitStrdBaseAlternItem
   */
  IsLowerLimitStrdBaseAlternItem: boolean;

  /**
   * IsSurplusGcOnly
   */
  IsSurplusGcOnly: boolean;

  /**
   * IsUpperLimitPrjChgItem
   */
  IsUpperLimitPrjChgItem: boolean;

  /**
   * IsUpperLimitStrdBaseAlternItem
   */
  IsUpperLimitStrdBaseAlternItem: boolean;

  /**
   * LowerLimitPrjChgItem
   */
  LowerLimitPrjChgItem: number;

  /**
   * LowerLimitStrdBaseAlternItem
   */
  LowerLimitStrdBaseAlternItem: number;

  /**
   * ProfitPercentage
   */
  ProfitPercentage: number;

  /**
   * RiskPercentage
   */
  RiskPercentage: number;

  /**
   * UpperLimitPrjChgItem
   */
  UpperLimitPrjChgItem: number;

  /**
   * UpperLimitStrdBaseAlternItem
   */
  UpperLimitStrdBaseAlternItem: number;
}
