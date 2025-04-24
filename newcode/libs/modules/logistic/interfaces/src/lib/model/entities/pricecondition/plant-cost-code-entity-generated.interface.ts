/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IPriceConditionEntity } from './price-condition-entity.interface';

export interface IPlantCostCodeEntityGenerated extends IEntityBase {

  /**
   * DayWotFk
   */
  DayWotFk?: number | null;

  /**
   * HourWotFk
   */
  HourWotFk?: number | null;

  /**
   * Id
   */
  Id: number;

  /**
   * IdleWotFk
   */
  IdleWotFk?: number | null;

  /**
   * IsManual
   */
  IsManual: boolean;

  /**
   * MonthWotFk
   */
  MonthWotFk?: number | null;

  /**
   * PercentageDay
   */
  PercentageDay?: number | null;

  /**
   * PercentageHour
   */
  PercentageHour?: number | null;

  /**
   * PercentageIdle
   */
  PercentageIdle?: number | null;

  /**
   * PercentageMonth
   */
  PercentageMonth?: number | null;

  /**
   * PlantGroupFk
   */
  PlantGroupFk: number;

  /**
   * PlantGroupSpecValueFk
   */
  PlantGroupSpecValueFk: number;

  /**
   * PriceConditionEntity
   */
  PriceConditionEntity?: IPriceConditionEntity | null;

  /**
   * PriceConditionFk
   */
  PriceConditionFk: number;

  /**
   * UomDayFk
   */
  UomDayFk?: number | null;

  /**
   * UomHourFk
   */
  UomHourFk?: number | null;

  /**
   * UomIdleFk
   */
  UomIdleFk?: number | null;

  /**
   * UomMonthFk
   */
  UomMonthFk?: number | null;
}
