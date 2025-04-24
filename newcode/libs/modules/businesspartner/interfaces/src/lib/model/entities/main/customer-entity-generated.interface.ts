/*
 * Copyright(c) RIB Software GmbH
 */

import { ICustomerBranchEntity } from './customer-branch-entity.interface';
import { ICustomerCompanyEntity } from './customer-company-entity.interface';
import { ICustomerStatusEntity } from './customer-status-entity.interface';
import { ISubsidiaryEntity } from './subsidiary-entity.interface';
import { IVatGroupEntity } from './vat-group-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface ICustomerEntityGenerated extends IEntityBase {

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
   * BpdDunninggroupFk
   */
  BpdDunninggroupFk: number;

  /**
   * BusinessPartnerFk
   */
  BusinessPartnerFk: number;

  /**
   * BusinessPostingGroupFk
   */
  BusinessPostingGroupFk: number;

  /**
   * BusinessUnitFk
   */
  BusinessUnitFk: number;

  /**
   * BuyerReference
   */
  BuyerReference?: string | null;

  /**
   * Code
   */
  Code: string;

  /**
   * CreditLimit
   */
  CreditLimit: number;

  /**
   * CustomerBranchEntity
   */
  CustomerBranchEntity?: ICustomerBranchEntity | null;

  /**
   * CustomerBranchFk
   */
  CustomerBranchFk?: number | null;

  /**
   * CustomerLedgerGroupFk
   */
  CustomerLedgerGroupFk: number;

  /**
   * CustomerLedgerGroupIcFk
   */
  CustomerLedgerGroupIcFk?: number | null;

  /**
   * CustomerStatusEntity
   */
  CustomerStatusEntity?: ICustomerStatusEntity | null;

  /**
   * CustomerStatusFk
   */
  CustomerStatusFk?: number | null;

  /**
   * CustomercompanyEntities
   */
  CustomercompanyEntities?: ICustomerCompanyEntity[] | null;

  /**
   * Description
   */
  Description?: string | null;

  /**
   * Description2
   */
  Description2?: string | null;

  /**
   * Einvoice
   */
  Einvoice: boolean;

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
   * SubsidiaryEntity
   */
  SubsidiaryEntity?: ISubsidiaryEntity | null;

  /**
   * SubsidiaryFk
   */
  SubsidiaryFk?: number | null;

  /**
   * SupplierNo
   */
  SupplierNo?: string | null;

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
   * VatGroupEntity
   */
  VatGroupEntity?: IVatGroupEntity | null;

  /**
   * VatGroupFk
   */
  VatGroupFk?: number | null;
}
