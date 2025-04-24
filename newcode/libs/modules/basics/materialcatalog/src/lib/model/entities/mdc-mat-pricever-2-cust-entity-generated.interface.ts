/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IMdcMatPricever2custEntityGenerated extends IEntityBase {

  /**
   * BasPaymentTermFk
   */
  BasPaymentTermFk?: number | null;

  /**
   * BpdBusinesspartnerFk
   */
  BpdBusinesspartnerFk: number;

  /**
   * BpdCustomerFk
   */
  BpdCustomerFk?: number | null;

  /**
   * BpdSubsidiaryFk
   */
  BpdSubsidiaryFk?: number | null;

  /**
   * Id
   */
  Id: number;

  /**
   * MdcBillingSchemaFk
   */
  MdcBillingSchemaFk?: number | null;

  /**
   * MdcMatPriceverFk
   */
  MdcMatPriceverFk: number;

  /**
   * TermsConditions
   */
  TermsConditions?: string | null;
}
