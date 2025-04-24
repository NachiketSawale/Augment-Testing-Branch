/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface ICashProjectionDetailEntityGenerated extends IEntityBase {

  /**
   * ActPeriodCash
   */
  ActPeriodCash: number;

  /**
   * ActPeriodCost
   */
  ActPeriodCost: number;

  /**
   * CalcCumCash
   */
  CalcCumCash: number;

  /**
   * CalcCumCost
   */
  CalcCumCost: number;

  /**
   * CalcPeriodCash
   */
  CalcPeriodCash: number;

  /**
   * CalcPeriodCost
   */
  CalcPeriodCost: number;

  // /**
  //  * CashProjectionEntity
  //  */
  // CashProjectionEntity?: ICashProjectionEntity | null;

  /**
   * CashProtectionFk
   */
  CashProtectionFk: number;

  /**
   * CompanyPeriodFk
   */
  CompanyPeriodFk: number;

  /**
   * CumCash
   */
  CumCash: number;

  /**
   * CumCost
   */
  CumCost: number;

  /**
   * EndDate
   */
  EndDate?: string | null;

  /**
   * Id
   */
  Id: number;

  /**
   * PercentOfCost
   */
  PercentOfCost: number;

  /**
   * PercentOfTime
   */
  PercentOfTime: number;

  /**
   * PeriodCash
   */
  PeriodCash: number;

  /**
   * PeriodCost
   */
  PeriodCost: number;
}
