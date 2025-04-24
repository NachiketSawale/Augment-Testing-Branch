/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo } from '@libs/platform/common';

export interface IPrcConfigurationLookUpVEntityGenerated {

  /**
   * ApprovalDealdline
   */
  ApprovalDealdline?: number | null;

  /**
   * ApprovalPeriod
   */
  ApprovalPeriod?: number | null;

  /**
   * BaselineIntegration
   */
  BaselineIntegration: boolean;

  /**
   * DescriptionInfo
   */
  DescriptionInfo?: IDescriptionInfo | null;

  /**
   * Id
   */
  Id: number;

  /**
   * IsDefault
   */
  IsDefault: boolean;

  /**
   * IsFreeItemsAllowed
   */
  IsFreeItemsAllowed: boolean;

  /**
   * IsLive
   */
  IsLive: boolean;

  /**
   * IsMaterial
   */
  IsMaterial: boolean;

  /**
   * IsNotAccrualPrr
   */
  IsNotAccrualPrr: boolean;

  /**
   * IsService
   */
  IsService: boolean;

  /**
   * PaymentTermFiFk
   */
  PaymentTermFiFk: number;

  /**
   * PaymentTermPaFk
   */
  PaymentTermPaFk: number;

  /**
   * PrcAwardMethodFk
   */
  PrcAwardMethodFk: number;

  /**
   * PrcConfigHeaderFk
   */
  PrcConfigHeaderFk: number;

  /**
   * PrcConfigHeaderTypeFk
   */
  PrcConfigHeaderTypeFk?: number | null;

  /**
   * PrcContractTypeFk
   */
  PrcContractTypeFk: number;

  /**
   * PrjContractTypeFk
   */
  PrjContractTypeFk?: number | null;

  /**
   * ProvingDealdline
   */
  ProvingDealdline?: number | null;

  /**
   * ProvingPeriod
   */
  ProvingPeriod?: number | null;

  /**
   * RubricCategoryFk
   */
  RubricCategoryFk: number;

  /**
   * RubricFk
   */
  RubricFk: number;

  /**
   * Sorting
   */
  Sorting: number;
}
