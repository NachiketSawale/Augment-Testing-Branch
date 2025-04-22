/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { ISupplierCompanyEntity } from './supplier-company-entity.interface';

export interface ISupplierEntityGenerated extends IEntityBase {

  /**
   * BankFk
   */
  BankFk?: number | null;

  /**
   * BasPaymentMethodFk
   */
  BasPaymentMethodFk?: number | null;

  /**
   * BillingSchemaFk
   */
  BillingSchemaFk?: number | null;

  /**
   * BlockingReasonFk
   */
  BlockingReasonFk?: number | null;

  /**
   * BusinessPartnerFk
   */
  BusinessPartnerFk: number;

  /**
   * BusinessPartnerName1
   */
  BusinessPartnerName1?: string | null;

  /**
   * BusinessPostGrpWhtFk
   */
  BusinessPostGrpWhtFk?: number | null;

  /**
   * BusinessPostingGroupFk
   */
  BusinessPostingGroupFk: number;

  /**
   * Code
   */
  Code: string;

  /**
   * CustomerNo
   */
  CustomerNo?: string | null;

  /**
   * Description
   */
  Description?: string | null;

  /**
   * Description2
   */
  Description2?: string | null;

  /**
   * Id
   */
  Id: number;

  /**
   * PaymentTermFiFk
   */
  PaymentTermFiFk?: number | null;

  /**
   * PaymentTermPaFk
   */
  PaymentTermPaFk?: number | null;

  /**
   * RubricCategoryFk
   */
  RubricCategoryFk?: number | null;

  /**
   * SubledgerContextFk
   */
  SubledgerContextFk: number;

  /**
   * SubsidiaryFk
   */
  SubsidiaryFk?: number | null;

  /**
   * SupplierLedgerGroupFk
   */
  SupplierLedgerGroupFk: number;

  /**
   * SupplierLedgerGroupIcFk
   */
  SupplierLedgerGroupIcFk?: number | null;

  /**
   * SupplierStatusFk
   */
  SupplierStatusFk?: number | null;

  /**
   * SuppliercompanyEntities
   */
  SuppliercompanyEntities?: ISupplierCompanyEntity[] | null;

  /**
   * UserDefined1
   */
  UserDefined1?: string | null;

  /**
   * UserDefined2
   */
  UserDefined2?: string | null;

  /**
   * UserDefined3
   */
  UserDefined3?: string | null;

  /**
   * UserDefined4
   */
  UserDefined4?: string | null;

  /**
   * UserDefined5
   */
  UserDefined5?: string | null;

  /**
   * VatGroupFk
   */
  VatGroupFk?: number | null;
}
