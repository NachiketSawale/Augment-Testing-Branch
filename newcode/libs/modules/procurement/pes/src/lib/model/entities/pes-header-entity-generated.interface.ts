/*
 * Copyright(c) RIB Software GmbH
 */

import { IPesCommentEntity } from './pes-comment-entity.interface';
import { IPesSelfBillingEntity } from './pes-self-billing-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IPesHeaderEntityGenerated extends IEntityBase {

  /**
   * BillingSchemaFinal
   */
  BillingSchemaFinal?: number | null;

  /**
   * BillingSchemaFinalOC
   */
  BillingSchemaFinalOC?: number | null;

  /**
   * BillingSchemaFk
   */
  BillingSchemaFk?: number | null;

  /**
   * BpdVatGroupFk
   */
  BpdVatGroupFk?: number | null;

  /**
   * BusinessPartnerFk
   */
  BusinessPartnerFk: number;

  /**
   * ClerkPrcDescription
   */
  ClerkPrcDescription?: number | null;

  /**
   * ClerkPrcFk
   */
  ClerkPrcFk: number;

  /**
   * ClerkReqDescription
   */
  ClerkReqDescription?: number | null;

  /**
   * ClerkReqFk
   */
  ClerkReqFk?: number | null;

  /**
   * Code
   */
  Code: string;

  /**
   * CompanyFk
   */
  CompanyFk: number;

  /**
   * ConHeaderDescription
   */
  ConHeaderDescription?: number | null;

  /**
   * ConHeaderFk
   */
  ConHeaderFk?: number | null;

  /**
   * ConfigHeaderIsConsolidateChange
   */
  ConfigHeaderIsConsolidateChange?: boolean | null;

  /**
   * ControllingUnitDescription
   */
  ControllingUnitDescription?: number | null;

  /**
   * ControllingUnitFk
   */
  ControllingUnitFk?: number | null;

  /**
   * CurrencyFk
   */
  CurrencyFk: number;

  /**
   * DateDelivered
   */
  DateDelivered: string;

  /**
   * DateDeliveredFrom
   */
  DateDeliveredFrom?: string | null;

  /**
   * DateEffective
   */
  DateEffective: string;

  /**
   * DealWithRateUpdateLater
   */
  DealWithRateUpdateLater?: boolean | null;

  /**
   * Description
   */
  Description?: string | null;

  /**
   * DocumentDate
   */
  DocumentDate?: string | null;

  /**
   * ExchangeRate
   */
  ExchangeRate: number;

  /**
   * ExternalCode
   */
  ExternalCode?: string | null;

  /**
   * Id
   */
  Id: number;

  /**
   * IsInvoicedStatus
   */
  IsInvoicedStatus: boolean;

  /**
   * IsNotAccrual
   */
  IsNotAccrual: boolean;

  /**
   * IsReadOnly
   */
  IsReadOnly: boolean;

  /**
   * MaxBoqPackageId
   */
  MaxBoqPackageId?: number | null;

  /**
   * PackageDescription
   */
  PackageDescription?: number | null;

  /**
   * PackageFk
   */
  PackageFk?: number | null;

  /**
   * PermissionObjectInfo
   */
  PermissionObjectInfo?: string | null;

  /**
   * PesCommentEntities
   */
  PesCommentEntities?: IPesCommentEntity[] | null;

  /**
   * PesHeaderFk
   */
  PesHeaderFk?: number | null;

  /**
   * PesSelfbillingEntities
   */
  PesSelfbillingEntities?: IPesSelfBillingEntity[] | null;

  /**
   * PesShipmentinfoFk
   */
  PesShipmentinfoFk?: number | null;

  /**
   * PesStatusFk
   */
  PesStatusFk: number;

  /**
   * PesValue
   */
  PesValue: number;

  /**
   * PesValueOc
   */
  PesValueOc: number;

  /**
   * PesVat
   */
  PesVat: number;

  /**
   * PesVatOc
   */
  PesVatOc: number;

  /**
   * PrcConfigurationFk
   */
  PrcConfigurationFk: number;

  /**
   * PrcStructureFk
   */
  PrcStructureFk?: number | null;

  /**
   * ProjectFk
   */
  ProjectFk?: number | null;

  /**
   * ProjectName
   */
  ProjectName?: number | null;

  /**
   * ProjectStatusFk
   */
  ProjectStatusFk?: number | null;

  /**
   * Remark
   */
  Remark?: string | null;

  /**
   * RubricCategoryFk
   */
  RubricCategoryFk: number;

  /**
   * SalesTaxMethodFk
   */
  SalesTaxMethodFk: number;

  /**
   * SearchPattern
   */
  SearchPattern?: string | null;

  /**
   * SubsidiaryFk
   */
  SubsidiaryFk?: number | null;

  /**
   * SupplierBPName
   */
  SupplierBPName?: number | null;

  /**
   * SupplierFk
   */
  SupplierFk?: number | null;

  /**
   * TotalStandardCost
   */
  TotalStandardCost: number;

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
}
