/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface ISupplierCompanyEntityGenerated extends IEntityBase {

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
   * BpdSupplierFk
   */
  BpdSupplierFk: number;

  /**
   * BusinessPostGrpWhtFk
   */
  BusinessPostGrpWhtFk?: number | null;

  /**
   * BusinessPostingGroupFk
   */
  BusinessPostingGroupFk?: number | null;

  /**
   * CustomerNo
   */
  CustomerNo?: string | null;

  /**
   * Id
   */
  Id: number;

  /**
   * SupplierLedgerGroupFk
   */
  SupplierLedgerGroupFk?: number | null;

  /**
   * SupplierLedgerGroupIcFk
   */
  SupplierLedgerGroupIcFk?: number | null;

  /**
   * VatGroupFk
   */
  VatGroupFk?: number | null;
}
