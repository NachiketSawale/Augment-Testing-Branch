/*
 * Copyright(c) RIB Software GmbH
 */

export interface IPaymentScheduleRecalculateParameterGenerated {

  /**
   * ProjectFk
   */
  ProjectFk?: number | null;

  /**
   * exchangeRate
   */
  exchangeRate: number;

  /**
   * mainItemId
   */
  mainItemId: number;

  /**
   * moduleName
   */
  moduleName?: string | null;

  /**
   * parentHeaderId
   */
  parentHeaderId: number;

  /**
   * prcHeaderFk
   */
  prcHeaderFk: number;

  /**
   * taxCodeFk
   */
  taxCodeFk: number;
}
