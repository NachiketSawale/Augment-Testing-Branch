/*
 * Copyright(c) RIB Software GmbH
 */

import { IBidBillingschemaEntity } from './bid-billingschema-entity.interface';
import { IBidBoqEntity } from './bid-boq-entity.interface';
import { IBidHeaderEntity } from './bid-header-entity.interface';
import { IBidStatusEntity } from './bid-status-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';
import { IBidDocumentEntity } from './document-entity.interface';
import { IBidGeneralsEntity } from './bid-generals-entity.interface';

export interface IBidHeaderEntityGenerated extends IEntityBase {

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
   * BasSalesTaxMethodFk
   */
  BasSalesTaxMethodFk: number;

  /**
   * BidBillingschemaEntities
   */
  BidBillingschemaEntities?: IBidBillingschemaEntity[] | null;

  /**
   * BidBoqEntities
   */
  BidBoqEntities?: IBidBoqEntity[] | null;

  /**
   * BidGeneralsEntities
   */
  BidGeneralsEntities?: IBidGeneralsEntity[] | null;

  /**
   * BidHeaderEntities_BidHeaderFk
   */
  BidHeaderEntities_BidHeaderFk?: IBidHeaderEntity[] | null;

  /**
   * BidHeaderEntity_BidHeaderFk
   */
  BidHeaderEntity_BidHeaderFk?: IBidHeaderEntity | null;

  /**
   * BidHeaderFk
   */
  BidHeaderFk?: number | null;

  /**
   * BidStatusEntity
   */
  BidStatusEntity?: IBidStatusEntity | null;

  /**
   * BidStatusFk
   */
  BidStatusFk: number;

  /**
   * BillingSchemaFk
   */
  BillingSchemaFk: number;

  /**
   * BlobsFooterFk
   */
  BlobsFooterFk?: number | null;

  /**
   * BlobsHeaderFk
   */
  BlobsHeaderFk?: number | null;

  /**
   * BlobsOffereeFk
   */
  BlobsOffereeFk?: number | null;

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
   * BpdContactFk
   */
  BpdContactFk?: number | null;

  /**
   * BusinesspartnerBilltoFk
   */
  BusinesspartnerBilltoFk?: number | null;

  /**
   * BusinesspartnerFk
   */
  BusinesspartnerFk: number;

  /**
   * ClerkFk
   */
  ClerkFk: number;

  /**
   * ClobsFooterFk
   */
  ClobsFooterFk?: number | null;

  /**
   * ClobsHeaderFk
   */
  ClobsHeaderFk?: number | null;

  /**
   * ClobsOffereeFk
   */
  ClobsOffereeFk?: number | null;

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
  DateEffective: Date | string;

  /**
   * DescriptionInfo
   */
  DescriptionInfo?: IDescriptionInfo | null;

  /**
   * DocumentEntities
   */
  DocumentEntities?: IBidDocumentEntity[] | null;

  /**
   * EstHeaderFk
   */
  EstHeaderFk?: number | null;

  /**
   * EstimationCode
   */
  EstimationCode?: string | null;

  /**
   * EstimationDescription
   */
  EstimationDescription?: IDescriptionInfo | null;

  /**
   * ExchangeRate
   */
  ExchangeRate: number;

  /**
   * Id
   */
  Id: number;

  /**
   * LanguageFk
   */
  LanguageFk: number;

  /**
   * ObjUnitFk
   */
  ObjUnitFk?: number | null;

  /**
   * OrdConditionFk
   */
  OrdConditionFk?: number | null;

  /**
   * OrdPrbltyLastvalDate
   */
  OrdPrbltyLastvalDate?: Date | string | null;

  /**
   * OrdPrbltyPercent
   */
  OrdPrbltyPercent?: number | null;

  /**
   * OrdPrbltyWhoupd
   */
  OrdPrbltyWhoupd?: number | null;

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
   * PriceFixingDate
   */
  PriceFixingDate?: Date | string | null;

  /**
   * PrjChangeFk
   */
  PrjChangeFk?: number | null;

  /**
   * ProjectFk
   */
  ProjectFk: number;

  /**
   * QuoteDate
   */
  QuoteDate?: Date | string | null;

  /**
   * Remark
   */
  Remark?: string | null;

  /**
   * RubricCategoryFk
   */
  RubricCategoryFk: number;

  /**
   * SearchPattern
   */
  SearchPattern?: string | null;

  /**
   * StructureType
   */
  StructureType: number;

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
}
