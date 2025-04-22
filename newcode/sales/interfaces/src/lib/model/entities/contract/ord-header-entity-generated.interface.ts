/*
 * Copyright(c) RIB Software GmbH
 */

import { IOrdHeaderEntity } from './ord-header-entity.interface';
import { IDocumentEntity } from './document-entity.interface';
import { IOrdBillingschemaEntity } from './ord-billingschema-entity.interface';
import { IOrdBoqEntity } from './ord-boq-entity.interface';
import { IGeneralsEntity } from './generals-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';
import { IAddressEntity } from '@libs/ui/map';
import { IOrdStatusEntity } from './ord-status-entity.interface';

export interface IOrdHeaderEntityGenerated extends IEntityBase {

  /**
   * AddressEntity
   */
  AddressEntity?: IAddressEntity | null;

  /**
   * AddressFk
   */
  AddressFk?: number | null;

  /**
   * AmountGross
   */
  AmountGross: number;

  /**
   * AmountGrossOc
   */
  AmountGrossOc: number;

  /**
   * AmountNet
   */
  AmountNet: number;

  /**
   * AmountNetOc
   */
  AmountNetOc: number;

  /**
   * ApprovedChangeOrderGrossOc
   */
  ApprovedChangeOrderGrossOc: number;

  /**
   * ApprovedChangeOrderNetOc
   */
  ApprovedChangeOrderNetOc: number;

  /**
   * BankFk
   */
  BankFk?: number | null;

  /**
   * BasSalesTaxMethodFk
   */
  BasSalesTaxMethodFk: number;

  /**
   * BidHeaderCode
   */
  BidHeaderCode?: string | null;

  /**
   * BidHeaderDescription
   */
  BidHeaderDescription?: IDescriptionInfo | null;

  /**
   * BidHeaderFk
   */
  BidHeaderFk?: number | null;

  /**
   * BillToFk
   */
  BillToFk?: number | null;

  /**
   * BillingMethodFk
   */
  BillingMethodFk?: number | null;

  /**
   * BillingSchemaFk
   */
  BillingSchemaFk: number;

  /**
   * BlobsBillToPartyFk
   */
  BlobsBillToPartyFk?: number | null;

  /**
   * BlobsFooterFk
   */
  BlobsFooterFk?: number | null;

  /**
   * BlobsHeaderFk
   */
  BlobsHeaderFk?: number | null;

  /**
   * BlobsReferenceFk
   */
  BlobsReferenceFk?: number | null;

  /**
   * BlobsSalutationFk
   */
  BlobsSalutationFk?: number | null;

  /**
   * BlobsSubjectFk
   */
  BlobsSubjectFk?: number | null;

  /**
   * BoqWicCatBoqFk
   */
  BoqWicCatBoqFk?: number | null;

  /**
   * BoqWicCatFk
   */
  BoqWicCatFk?: number | null;

  /**
   * BusinesspartnerBilltoFk
   */
  BusinesspartnerBilltoFk?: number | null;

  /**
   * BusinesspartnerFk
   */
  BusinesspartnerFk: number;

  /**
   * ChildItems
   */
  ChildItems?: IOrdHeaderEntity[] | null;

  /**
   * ClerkFk
   */
  ClerkFk: number;

  /**
   * ClobsBillToPartyFk
   */
  ClobsBillToPartyFk?: number | null;

  /**
   * ClobsFooterFk
   */
  ClobsFooterFk?: number | null;

  /**
   * ClobsHeaderFk
   */
  ClobsHeaderFk?: number | null;

  /**
   * ClobsReferenceFk
   */
  ClobsReferenceFk?: number | null;

  /**
   * ClobsSalutationFk
   */
  ClobsSalutationFk?: number | null;

  /**
   * ClobsSubjectFk
   */
  ClobsSubjectFk?: number | null;

  /**
   * Code
   */
  Code: string;

  /**
   * Comment
   */
  Comment?: string | null;

  /**
   * CommentText
   */
  CommentText?: string | null;

  /**
   * CompanyFk
   */
  CompanyFk: number;

  /**
   * CompanyResponsibleFk
   */
  CompanyResponsibleFk: number;

  /**
   * ConfigurationFk
   */
  ConfigurationFk?: number | null;

  /**
   * ContactBilltoFk
   */
  ContactBilltoFk?: number | null;

  /**
   * ContactFk
   */
  ContactFk?: number | null;

  /**
   * ContractTypeFk
   */
  ContractTypeFk: number;

  /**
   * ControllingUnitFk
   */
  ControllingUnitFk?: number | null;

  /**
   * CurrencyFk
   */
  CurrencyFk: number;

  /**
   * CustomerBilltoFk
   */
  CustomerBilltoFk?: number | null;

  /**
   * CustomerFk
   */
  CustomerFk?: number | null;

  /**
   * DateEffective
   */
  DateEffective: string | null;

  /**
   * DescriptionInfo
   */
  DescriptionInfo?: IDescriptionInfo | null;

  /**
   * DocumentEntities
   */
  DocumentEntities?: IDocumentEntity[] | null;

  /**
   * EstHeaderCode
   */
  EstHeaderCode?: string | null;

  /**
   * EstHeaderDescription
   */
  EstHeaderDescription?: IDescriptionInfo | null;

  /**
   * EstHeaderFk
   */
  EstHeaderFk?: number | null;

  /**
   * ExchangeRate
   */
  ExchangeRate: number;

  /**
   * Flag
   */
  Flag?: string | null;

  /**
   * FrameworkContractFk
   */
  FrameworkContractFk: number;

  /**
   * HasChildren
   */
  HasChildren: boolean;

  /**
   * Icon
   */
  Icon?: string | null;

  /**
   * Id
   */
  Id: number;

  /**
   * IndirectCostsBalancingConfigDetailFk
   */
  IndirectCostsBalancingConfigDetailFk?: number | null;

  /**
   * IsBillOptionalItems
   */
  IsBillOptionalItems: boolean;

  /**
   * IsCanceled
   */
  IsCanceled: boolean;

  /**
   * IsDays
   */
  IsDays: boolean;

  /**
   * IsDiverseDebitorsAllowed
   */
  IsDiverseDebitorsAllowed: boolean;

  /**
   * IsFramework
   */
  IsFramework: boolean;

  /**
   * IsFreeItemsAllowed
   */
  IsFreeItemsAllowed: boolean;

  /**
   * IsLive
   */
  IsLive: boolean;

  /**
   * IsMainContractFramework
   */
  IsMainContractFramework?: boolean | null;

  /**
   * IsNotAccrualPrr
   */
  IsNotAccrualPrr: boolean;

  /**
   * IsOrdered
   */
  IsOrdered: boolean;

  /**
   * IsOrderedStatus
   */
  IsOrderedStatus: boolean;

  /**
   * IsTransferred
   */
  IsTransferred: boolean;

  /**
   * IsWarrenty
   */
  IsWarrenty: boolean;

  /**
   * LanguageFk
   */
  LanguageFk: number;

  /**
   * NotApprChangeOrderGrossOc
   */
  NotApprChangeOrderGrossOc: number;

  /**
   * NotApprChangeOrderNetOc
   */
  NotApprChangeOrderNetOc: number;

  /**
   * ObjUnitFk
   */
  ObjUnitFk?: number | null;

  /**
   * OrdBillingschemaEntities
   */
  OrdBillingschemaEntities?: IOrdBillingschemaEntity[] | null;

  /**
   * OrdBoqEntities
   */
  OrdBoqEntities?: IOrdBoqEntity[] | null;

  /**
   * OrdConditionFk
   */
  OrdConditionFk?: number | null;

  /**
   * OrdGeneralsEntities
   */
  OrdGeneralsEntities?: IGeneralsEntity[] | null;

  /**
   * OrdHeaderCode
   */
  OrdHeaderCode?: string | null;

  /**
   * OrdHeaderDescription
   */
  OrdHeaderDescription?: IDescriptionInfo | null;

  /**
   * OrdHeaderEntities_OrdHeaderFk
   */
  OrdHeaderEntities_OrdHeaderFk?: IOrdHeaderEntity[] | null;

  /**
   * OrdHeaderEntity_OrdHeaderFk
   */
  OrdHeaderEntity_OrdHeaderFk?: IOrdHeaderEntity | null;

  /**
   * OrdHeaderFk
   */
  OrdHeaderFk?: number | null;

  /**
   * OrdStatusEntity
   */
  OrdStatusEntity?: IOrdStatusEntity | null;

  /**
   * OrdStatusFk
   */
  OrdStatusFk: number;

  /**
   * OrdWarrentyTypeFk
   */
  OrdWarrentyTypeFk?: number | null;

  /**
   * OrderDate
   */
  OrderDate?: Date | string | null;

  /**
   * OrderNoCustomer
   */
  OrderNoCustomer?: string | null;

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
   * PermissionObjectInfo
   */
  PermissionObjectInfo?: string | null;

  /**
   * PlannedEnd
   */
  PlannedEnd?: Date | string | null;

  /**
   * PlannedStart
   */
  PlannedStart?: Date | string | null;

  /**
   * PrcIncotermFk
   */
  PrcIncotermFk?: number | null;

  /**
   * PrcStructureFk
   */
  PrcStructureFk?: number | null;

  /**
   * PrjChangeFk
   */
  PrjChangeFk?: number | null;

  /**
   * ProjectFk
   */
  ProjectFk: number;

  /**
   * ProjectnoCustomer
   */
  ProjectnoCustomer?: string | null;

  /**
   * QtoHeaderCode
   */
  QtoHeaderCode?: string | null;

  /**
   * QtoHeaderDescription
   */
  QtoHeaderDescription?: string | null;

  /**
   * QtoIds
   */
  QtoIds?: string | null;

  /**
   * Remark
   */
  Remark?: string | null;

  /**
   * RestrictFrameworkContractCallOff
   */
  RestrictFrameworkContractCallOff: boolean;

  /**
   * RevisionApplicable
   */
  RevisionApplicable: boolean;

  /**
   * RubricCategoryFk
   */
  RubricCategoryFk?: number | null;

  /**
   * SearchPattern
   */
  SearchPattern?: string | null;

  /**
   * SubsidiaryBilltoFk
   */
  SubsidiaryBilltoFk?: number | null;

  /**
   * SubsidiaryFk
   */
  SubsidiaryFk: number;

  /**
   * TaxCodeFk
   */
  TaxCodeFk: number;

  /**
   * Total
   */
  Total: number;

  /**
   * TypeFk
   */
  TypeFk?: number | null;

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
   * UserDefinedDate01
   */
  UserDefinedDate01?: Date | string | null;

  /**
   * UserDefinedDate02
   */
  UserDefinedDate02?: Date | string | null;

  /**
   * UserDefinedDate03
   */
  UserDefinedDate03?: Date | string | null;

  /**
   * UserDefinedDate04
   */
  UserDefinedDate04?: Date | string | null;

  /**
   * UserDefinedDate05
   */
  UserDefinedDate05?: Date | string | null;

  /**
   * VatGroupFk
   */
  VatGroupFk?: number | null;

  /**
   * WarrantyAmount
   */
  WarrantyAmount: number;

  /**
   * WipCurrent
   */
  WipCurrent?: number | null;

  /**
   * WipDuration
   */
  WipDuration?: number | null;

  /**
   * WipFirst
   */
  WipFirst?: Date | string | null;

  /**
   * WipFrom
   */
  WipFrom?: Date | string | null;

  /**
   * WipTypeFk
   */
  WipTypeFk?: number | null;

  /**
   * WipUntil
   */
  WipUntil?: Date | string | null;

  /**
   * timeStr
   */
  timeStr?: object | null;
}
