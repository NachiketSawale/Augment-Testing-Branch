/*
 * Copyright(c) RIB Software GmbH
 */

export interface IBillFromContractPaymentScheduleEntityGenerated {

  /**
   * BillNo
   */
  BillNo?: string | null;

  /**
   * BillTypeFk
   */
  BillTypeFk: number;

  /**
   * BoqFk
   */
  BoqFk: number;

  /**
   * BoqHeaderFk
   */
  BoqHeaderFk: number;

  /**
   * ClerkFk
   */
  ClerkFk: number;

  /**
   * ConfigurationFk
   */
  ConfigurationFk: number;

  /**
   * ContractId
   */
  ContractId: number;

  /**
   * Description
   */
  Description?: string | null;

  /**
   * PaymentScheduleDateRequest
   */
  PaymentScheduleDateRequest?: Date | string | null;

  /**
   * PaymentScheduleId
   */
  PaymentScheduleId: number;

  /**
   * PaymentSchedulePaymentBalanceNet
   */
  PaymentSchedulePaymentBalanceNet?: number | null;

  /**
   * PreviousBillFk
   */
  PreviousBillFk?: number | null;

  /**
   * RadioTypeId
   */
  RadioTypeId: number;

  /**
   * ResponsibleCompanyFk
   */
  ResponsibleCompanyFk: number;

  /**
   * RubricCategoryFk
   */
  RubricCategoryFk: number;

  /**
   * WipFk
   */
  WipFk?: number | null;
}
