/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo } from '@libs/platform/common';

export interface ICustomerSearchViewEntityGenerated {

  /**
   * AddressLine
   */
  AddressLine?: string | null;

  /**
   * BillingSchemaFk
   */
  BillingSchemaFk?: number | null;

  /**
   * BusinessPartnerFk
   */
  BusinessPartnerFk: number;

  /**
   * BusinessPartnerName1
   */
  BusinessPartnerName1?: string | null;

  /**
   * BusinessPartnerName2
   */
  BusinessPartnerName2?: string | null;

  /**
   * BusinessPartnerStatusFk
   */
  BusinessPartnerStatusFk: number;

  /**
   * BusinessUnitFk
   */
  BusinessUnitFk: number;

  /**
   * Code
   */
  Code: string;

  /**
   * CustomerBranchFk
   */
  CustomerBranchFk?: number | null;

  /**
   * CustomerLedgerGroupFk
   */
  CustomerLedgerGroupFk: number;

  /**
   * CustomerStatusDescriptionInfo
   */
  CustomerStatusDescriptionInfo?: IDescriptionInfo | null;

  /**
   * CustomerStatusFk
   */
  CustomerStatusFk?: number | null;

  /**
   * Description
   */
  Description?: string | null;

  /**
   * Description2
   */
  Description2?: string | null;

  /**
   * Icon
   */
  Icon?: number | null;

  /**
   * Id
   */
  Id: number;

  /**
   * IsLive
   */
  IsLive: boolean;

  /**
   * PaymentTermFiFk
   */
  PaymentTermFiFk?: number | null;

  /**
   * PaymentTermPaFk
   */
  PaymentTermPaFk?: number | null;

  /**
   * SupplierNo
   */
  SupplierNo?: string | null;

  /**
   * Userdefined1
   */
  Userdefined1?: string | null;
}
