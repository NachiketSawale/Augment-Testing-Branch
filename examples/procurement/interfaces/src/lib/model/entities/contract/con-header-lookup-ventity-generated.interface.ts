/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo } from '@libs/platform/common';

export interface IConHeaderLookupVEntityGenerated {

  /**
   * BankFk
   */
  BankFk?: number | null;

  /**
   * Bp2Name1
   */
  Bp2Name1?: string | null;

  /**
   * Bp2Name2
   */
  Bp2Name2?: string | null;

  /**
   * BpName1
   */
  BpName1?: string | null;

  /**
   * BpName2
   */
  BpName2?: string | null;

  /**
   * BpdContactFk
   */
  BpdContactFk?: number | null;

  /**
   * BpdSubsidiaryFk
   */
  BpdSubsidiaryFk?: number | null;

  /**
   * BpdSupplierFk
   */
  BpdSupplierFk?: number | null;

  /**
   * BpdVatGroupFk
   */
  BpdVatGroupFk?: number | null;

  /**
   * BusinessPartner2Fk
   */
  BusinessPartner2Fk?: number | null;

  /**
   * BusinessPartnerFk
   */
  BusinessPartnerFk: number;

  /**
   * ClerkPrcFk
   */
  ClerkPrcFk?: number | null;

  /**
   * ClerkReqFk
   */
  ClerkReqFk?: number | null;

  /**
   * Code
   */
  Code: string;

  /**
   * CodeQuotation
   */
  CodeQuotation?: string | null;

  /**
   * CompanyFk
   */
  CompanyFk: number;

  /**
   * ConHeaderFk
   */
  ConHeaderFk?: number | null;

  /**
   * ConStatusFk
   */
  ConStatusFk?: number | null;

  /**
   * ControllingUnitFk
   */
  ControllingUnitFk?: number | null;

  /**
   * CurrencyFk
   */
  CurrencyFk: number;

  /**
   * DateOrdered
   */
  DateOrdered: string;

  /**
   * Description
   */
  Description?: string | null;

  /**
   * Exchangerate
   */
  Exchangerate: number;

  /**
   * ExternalCode
   */
  ExternalCode?: string | null;

  /**
   * Icon
   */
  Icon?: number | null;

  /**
   * Id
   */
  Id: number;

  /**
   * IsFramework
   */
  IsFramework: boolean;

  /**
   * IsFreeItemsAllowed
   */
  IsFreeItemsAllowed: boolean;

  /**
   * MdcBillingSchemaFk
   */
  MdcBillingSchemaFk: number;

  /**
   * PaymentTermFiFk
   */
  PaymentTermFiFk?: number | null;

  /**
   * PaymentTermPaFk
   */
  PaymentTermPaFk?: number | null;

  /**
   * PrcConfigHeaderFk
   */
  PrcConfigHeaderFk: number;

  /**
   * PrcConfigurationFk
   */
  PrcConfigurationFk: number;

  /**
   * PrcCopyModeFk
   */
  PrcCopyModeFk: number;

  /**
   * PrcHeaderId
   */
  PrcHeaderId: number;

  /**
   * PrcPackage2HeaderFk
   */
  PrcPackage2HeaderFk?: number | null;

  /**
   * PrcPackageFk
   */
  PrcPackageFk?: number | null;

  /**
   * PrcStructureFk
   */
  PrcStructureFk?: number | null;

  /**
   * ProjectChangeFk
   */
  ProjectChangeFk?: number | null;

  /**
   * ProjectFk
   */
  ProjectFk?: number | null;

  /**
   * ProjectName
   */
  ProjectName?: string | null;

  /**
   * ProjectNo
   */
  ProjectNo?: string | null;

  /**
   * SalesTaxMethodFk
   */
  SalesTaxMethodFk: number;

  /**
   * SearchPattern
   */
  SearchPattern?: string | null;

  /**
   * StatusDescriptionInfo
   */
  StatusDescriptionInfo?: IDescriptionInfo | null;

  /**
   * StatusIsCanceled
   */
  StatusIsCanceled?: boolean | null;

  /**
   * StatusIsDelivered
   */
  StatusIsDelivered?: boolean | null;

  /**
   * StatusIsInvoiced
   */
  StatusIsInvoiced?: boolean | null;

  /**
   * StatusIsLive
   */
  StatusIsLive?: boolean | null;

  /**
   * StatusIsOrdered
   */
  StatusIsOrdered?: boolean | null;

  /**
   * StatusIsReadonly
   */
  StatusIsReadonly?: boolean | null;

  /**
   * StatusIsRejected
   */
  StatusIsRejected?: boolean | null;

  /**
   * StatusIsReported
   */
  StatusIsReported?: boolean | null;

  /**
   * StatusIsVirtual
   */
  StatusIsVirtual?: boolean | null;

  /**
   * Supplier2Code
   */
  Supplier2Code?: string | null;

  /**
   * SupplierCode
   */
  SupplierCode?: string | null;

  /**
   * TaxCodeFk
   */
  TaxCodeFk: number;

  /**
   * log
   */
  log?: string | null;
}
