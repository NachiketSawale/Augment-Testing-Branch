/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface ICustomerCompanyEntityGenerated extends IEntityBase {

  /**
   * BankFk
   */
  BankFk?: number | null;

  /**
   * BasCompanyFk
   */
  BasCompanyFk: number;

  /**
   * BasPaymentMethodFk
   */
  BasPaymentMethodFk?: number | null;

  /**
   * BasPaymentTermFiFk
   */
  BasPaymentTermFiFk?: number | null;

  /**
   * BasPaymentTermPaFk
   */
  BasPaymentTermPaFk?: number | null;

  /**
   * BpdCustomerFk
   */
  BpdCustomerFk: number;

  /**
   * BusinessPostingGroupFk
   */
  BusinessPostingGroupFk?: number | null;

  /**
   * CustomerLedgerGroupFk
   */
  CustomerLedgerGroupFk?: number | null;

  /**
   * CustomerLedgerGroupIcFk
   */
  CustomerLedgerGroupIcFk?: number | null;

  /**
   * Id
   */
  Id: number;

  /**
   * Supplierno
   */
  Supplierno?: string | null;

  /**
   * VatGroupFk
   */
  VatGroupFk?: number | null;
}
