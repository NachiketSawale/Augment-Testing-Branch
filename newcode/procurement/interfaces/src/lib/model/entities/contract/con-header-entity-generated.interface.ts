/*
 * Copyright(c) RIB Software GmbH
 */

import { IConHeaderEntity } from './con-header-entity.interface';
import { IEntityBase } from '@libs/platform/common';
import { AddressEntity } from '@libs/basics/shared';
import { IConHeaderApprovalEntity } from './con-header-approval-entity.interface';
import { IConStatusEntity } from './con-status-entity.interface';
import { IConTotalEntity } from '../con-total-entity.interface';
import { IPrcHeaderEntity } from '../prc-header-entity.interface';
import { IConHeader2customerEntity } from './con-header-2-customer-entity.interface';
import { IPrcHeaderblobEntity } from '../prcheader/prc-headerblob-entity.interface';

export interface IConHeaderEntityGenerated extends IEntityBase {

  /**
   * AddressEntity
   */
  AddressEntity?: AddressEntity | null;

  /**
   * AddressFk
   */
  AddressFk?: number | null;

  /**
   * ApprovalDealdline
   */
  ApprovalDealdline?: number | null;

  /**
   * ApprovalPeriod
   */
  ApprovalPeriod?: number | null;

  /**
   * AwardmethodFk
   */
  AwardmethodFk: number;

  /**
   * BankFk
   */
  BankFk?: number | null;

  /**
   * BasAccassignAccountFk
   */
  BasAccassignAccountFk?: number | null;

  /**
   * BasAccassignBusinessFk
   */
  BasAccassignBusinessFk?: number | null;

  /**
   * BasAccassignConTypeFk
   */
  BasAccassignConTypeFk?: number | null;

  /**
   * BasAccassignControlFk
   */
  BasAccassignControlFk?: number | null;

  /**
   * BasCurrencyFk
   */
  BasCurrencyFk: number;

  /**
   * BaselinePath
   */
  BaselinePath?: string | null;

  /**
   * BaselineUpdate
   */
  BaselineUpdate?: string | null;

  /**
   * BasisCPO
   */
  BasisCPO?: string | null;

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
  BillingSchemaFk: number;

  /**
   * BlobAction
   */
  BlobAction: number;

  /**
   * BoqWicCatBoqFk
   */
  BoqWicCatBoqFk?: number | null;

  /**
   * BoqWicCatFk
   */
  BoqWicCatFk?: number | null;

  /**
   * BpdVatGroupFk
   */
  BpdVatGroupFk?: number | null;

  /**
   * BusinessPartner2Fk
   */
  BusinessPartner2Fk?: number | null;

  /**
   * BusinessPartnerAgentFk
   */
  BusinessPartnerAgentFk?: number | null;

  /**
   * BusinessPartnerFk
   */
  BusinessPartnerFk: number;

  /**
   * CallOffGross
   */
  CallOffGross: number;

  /**
   * CallOffGrossOc
   */
  CallOffGrossOc: number;

  /**
   * CallOffNet
   */
  CallOffNet: number;

  /**
   * CallOffNetOc
   */
  CallOffNetOc: number;

  /**
   * CallOffVat
   */
  CallOffVat: number;

  /**
   * CallOffVatOc
   */
  CallOffVatOc: number;

  /**
   * CanChangeCode
   */
  CanChangeCode: boolean;

  /**
   * ChangeOrderGross
   */
  ChangeOrderGross: number;

  /**
   * ChangeOrderGrossOc
   */
  ChangeOrderGrossOc: number;

  /**
   * ChangeOrderNet
   */
  ChangeOrderNet: number;

  /**
   * ChangeOrderNetOc
   */
  ChangeOrderNetOc: number;

  /**
   * ChangeOrderVat
   */
  ChangeOrderVat: number;

  /**
   * ChangeOrderVatOc
   */
  ChangeOrderVatOc: number;

  /**
   * ChildItems
   */
  ChildItems?: IConHeaderEntity[] | null;

  /**
   * ClerkPrcFk
   */
  ClerkPrcFk?: number | null;

  /**
   * ClerkPrcItem
   */
  // ClerkPrcItem?: IClerkEntity | null;

  /**
   * ClerkReqFk
   */
  ClerkReqFk?: number | null;

  /**
   * ClerkReqItem
   */
  // ClerkReqItem?: IClerkEntity | null;

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
   * CompanyInvoiceFk
   */
  CompanyInvoiceFk?: number | null;

  /**
   * ConHeader2customerEntities
   */
  ConHeader2customerEntities?: IConHeader2customerEntity[] | null;

  /**
   * ConHeaderFk
   */
  ConHeaderFk?: number | null;

  /**
   * ConHeaderapprovalEntities
   */
  ConHeaderapprovalEntities?: IConHeaderApprovalEntity[] | null;

  /**
   * ConStatus
   */
  ConStatus?: IConStatusEntity | null;

  /**
   * ConStatusFk
   */
  ConStatusFk: number;

  /**
   * ConTotalValueNet
   */
  ConTotalValueNet: number;

  /**
   * ConTypeFk
   */
  ConTypeFk: number;

  /**
   * ConfigurationFk
   */
  ConfigurationFk: number;

  /**
   * ConfirmationCode
   */
  ConfirmationCode?: string | null;

  /**
   * ConfirmationDate
   */
  ConfirmationDate?: string | null;

  /**
   * Contact2Fk
   */
  Contact2Fk?: number | null;

  /**
   * ContactFk
   */
  ContactFk?: number | null;

  /**
   * ContractHeaderFk
   */
  ContractHeaderFk?: number | null;

  /**
   * ContracttypeFk
   */
  ContracttypeFk: number;

  /**
   * ControllingUnitFk
   */
  ControllingUnitFk?: number | null;

  /**
   * CustomerCode
   */
  CustomerCode?: string | null;

  /**
   * CustomerFk
   */
  CustomerFk?: number | null;

  /**
   * DateCallofffrom
   */
  DateCallofffrom?: string | null;

  /**
   * DateCalloffto
   */
  DateCalloffto?: string | null;

  /**
   * DateCanceled
   */
  DateCanceled?: string | null;

  /**
   * DateDelivery
   */
  DateDelivery?: string | null;

  /**
   * DateEffective
   */
  DateEffective: string;

  /**
   * DateOrdered
   */
  DateOrdered: string;

  /**
   * DatePenalty
   */
  DatePenalty?: string | null;

  /**
   * DateQuotation
   */
  DateQuotation?: string | null;

  /**
   * DateReported
   */
  DateReported?: string | null;

  /**
   * DealWithRateUpdateLater
   */
  DealWithRateUpdateLater?: boolean | null;

  /**
   * DeliveryAddressDescription
   */
  DeliveryAddressDescription?: string | null;

  /**
   * Description
   */
  Description?: string | null;

  /**
   * ExchangeRate
   */
  ExchangeRate: number;

  /**
   * ExecutionEnd
   */
  ExecutionEnd?: string | null;

  /**
   * ExecutionStart
   */
  ExecutionStart?: string | null;

  /**
   * ExternalCode
   */
  ExternalCode?: string | null;

  /**
   * FrameworkConHeaderFk
   */
  FrameworkConHeaderFk?: number | null;

  /**
   * GrandGross
   */
  GrandGross: number;

  /**
   * GrandGrossOc
   */
  GrandGrossOc: number;

  /**
   * GrandNet
   */
  GrandNet: number;

  /**
   * GrandNetOc
   */
  GrandNetOc: number;

  /**
   * GrandVat
   */
  GrandVat: number;

  /**
   * GrandVatOc
   */
  GrandVatOc: number;

  /**
   * Gross
   */
  Gross: number;

  /**
   * GrossOc
   */
  GrossOc: number;

  /**
   * HasChanges
   */
  HasChanges: boolean;

  /**
   * HasChildren
   */
  HasChildren: boolean;

  /**
   * HasItems
   */
  HasItems: boolean;

  /**
   * Id
   */
  Id: number;

  /**
   * IncotermFk
   */
  IncotermFk?: number | null;

  /**
   * IsFramework
   */
  IsFramework: boolean;

  /**
   * IsFreeItemsAllowed
   */
  IsFreeItemsAllowed: boolean;

  /**
   * IsFromDeepCopy
   */
  IsFromDeepCopy: boolean;

  /**
   * IsInvAccountChangeable
   */
  IsInvAccountChangeable: boolean;

  /**
   * IsNotAccrualPrr
   */
  IsNotAccrualPrr: boolean;

  /**
   * IsSearchItem
   */
  IsSearchItem: boolean;

  /**
   * IsStatusReadonly
   */
  IsStatusReadonly: boolean;

  /**
   * MaterialCatalogFk
   */
  MaterialCatalogFk?: number | null;

  /**
   * MdcPriceListFk
   */
  MdcPriceListFk?: number | null;

  /**
   * Net
   */
  Net: number;

  /**
   * NetOc
   */
  NetOc: number;

  /**
   * OrdHeaderFk
   */
  OrdHeaderFk?: number | null;

  /**
   * OrderText
   */
  OrderText?: string | null;

  /**
   * OverallDiscount
   */
  OverallDiscount: number;

  /**
   * OverallDiscountOc
   */
  OverallDiscountOc: number;

  /**
   * OverallDiscountPercent
   */
  OverallDiscountPercent: number;

  /**
   * Package2HeaderFk
   */
  Package2HeaderFk?: number | null;

  /**
   * PackageFk
   */
  PackageFk?: number | null;

  /**
   * PaymentTermAdFk
   */
  PaymentTermAdFk?: number | null;

  /**
   * PaymentTermFiFk
   */
  PaymentTermFiFk?: number | null;

  /**
   * PaymentTermPaFk
   */
  PaymentTermPaFk?: number | null;

  /**
   * PenaltyComment
   */
  PenaltyComment?: string | null;

  /**
   * PenaltyPercentMax
   */
  PenaltyPercentMax: number;

  /**
   * PenaltyPercentPerDay
   */
  PenaltyPercentPerDay: number;

  /**
   * PermissionObjectInfo
   */
  PermissionObjectInfo?: string | null;

  /**
   * PrcCopyModeFk
   */
  PrcCopyModeFk: number;

  /**
   * PrcHeaderBlob
   */
  PrcHeaderBlob?: IPrcHeaderblobEntity[] | null;

  /**
   * PrcHeaderEntity
   */
  PrcHeaderEntity: IPrcHeaderEntity;

  /**
   * PrcHeaderFk
   */
  PrcHeaderFk: number;

  /**
   * PrcTotalsDto
   */
  PrcTotalsDto?: IConTotalEntity[] | null;

  /**
   * ProjectChangeCode
   */
  ProjectChangeCode?: string | null;

  /**
   * ProjectChangeDescription
   */
  ProjectChangeDescription?: string | null;

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
   * ProjectStatusFk
   */
  ProjectStatusFk?: number | null;

  /**
   * ProvingDealdline
   */
  ProvingDealdline?: number | null;

  /**
   * ProvingPeriod
   */
  ProvingPeriod?: number | null;

  /**
   * PurchaseOrders
   */
  PurchaseOrders?: number | null;

  /**
   * QtnHeaderFk
   */
  QtnHeaderFk?: number | null;

  /**
   * Remark
   */
  Remark?: string | null;

  /**
   * ReqHeaderFk
   */
  ReqHeaderFk?: number | null;

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
   * Subsidiary2Fk
   */
  Subsidiary2Fk?: number | null;

  /**
   * SubsidiaryFk
   */
  SubsidiaryFk?: number | null;

  /**
   * Supplier2Fk
   */
  Supplier2Fk?: number | null;

  /**
   * SupplierFk
   */
  SupplierFk?: number | null;

  /**
   * SupplierText
   */
  SupplierText?: string | null;

  /**
   * TaxCodeFk
   */
  TaxCodeFk: number;

  /**
   * TotalLeadTime
   */
  TotalLeadTime: number;

  /**
   * Userdefined1
   */
  Userdefined1?: string | null;

  /**
   * Userdefined2
   */
  Userdefined2?: string | null;

  /**
   * Userdefined3
   */
  Userdefined3?: string | null;

  /**
   * Userdefined4
   */
  Userdefined4?: string | null;

  /**
   * Userdefined5
   */
  Userdefined5?: string | null;

  /**
   * ValidFrom
   */
  ValidFrom?: string | null;

  /**
   * ValidTo
   */
  ValidTo?: string | null;

  /**
   * Vat
   */
  Vat: number;

  /**
   * VatOc
   */
  VatOc: number;

  /**
   * VatPercent
   */
  VatPercent: number;
}
