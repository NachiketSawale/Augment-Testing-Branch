/*
 * Copyright(c) RIB Software GmbH
 */

import { IBidHeaderEntity } from './bid-header-entity.interface';
import { IBusinesspartnerEntity } from './businesspartner-entity.interface';
import { IContactEntity } from './contact-entity.interface';
import { IEstLineItemEntity } from './est-line-item-entity.interface';
import { IBilHeaderEntity } from './bil-header-entity.interface';
import { IOrdHeaderEntity } from './ord-header-entity.interface';
import { IOrdHeaderFormDataEntity } from './ord-header-form-data-entity.interface';
import { IProjectEntity } from './project-entity.interface';
import { IWipHeaderEntity } from './wip-header-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IOrdHeaderEntityGenerated extends IEntityBase {

  /**
   * BankFk
   */
  BankFk?: number | null;

  /**
   * BidHeaderEntity
   */
  BidHeaderEntity?: IBidHeaderEntity | null;

  /**
   * BidHeaderFk
   */
  BidHeaderFk?: number | null;

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
   * BusinesspartnerBilltoFk
   */
  BusinesspartnerBilltoFk?: number | null;

  /**
   * BusinesspartnerEntity
   */
  BusinesspartnerEntity?: IBusinesspartnerEntity | null;

  /**
   * BusinesspartnerEntity_BusinesspartnerBilltoFk
   */
  BusinesspartnerEntity_BusinesspartnerBilltoFk?: IBusinesspartnerEntity | null;

  /**
   * BusinesspartnerFk
   */
  BusinesspartnerFk?: number | null;

  /**
   * CashprojectionFk
   */
  CashprojectionFk?: number | null;

  /**
   * ChangeFk
   */
  ChangeFk?: number | null;

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
   * ContactBilltoFk
   */
  ContactBilltoFk?: number | null;

  /**
   * ContactEntity_ContactBilltoFk
   */
  ContactEntity_ContactBilltoFk?: IContactEntity | null;

  /**
   * ContactEntity_ContactFk
   */
  ContactEntity_ContactFk?: IContactEntity | null;

  /**
   * ContactFk
   */
  ContactFk?: number | null;

  /**
   * ContractTypeFk
   */
  ContractTypeFk: number;

  /**
   * CurrencyFk
   */
  CurrencyFk: number;

  /**
   * CustomerFk
   */
  CustomerFk?: number | null;

  /**
   * DateEffective
   */
  DateEffective: Date | string;

  /**
   * Description
   */
  Description?: string | null;

  /**
   * DescriptionTr
   */
  DescriptionTr?: number | null;

  /**
   * EstHeaderFk
   */
  EstHeaderFk?: number | null;

  /**
   * EstLineItemEntities
   */
  EstLineItemEntities?: IEstLineItemEntity[] | null;

  /**
   * Exchangerate
   */
  Exchangerate: number;

  /**
   * HeaderEntities
   */
  HeaderEntities?: IBilHeaderEntity[] | null;

  /**
   * Id
   */
  Id: number;

  /**
   * Isdays
   */
  Isdays: boolean;

  /**
   * Iswarrenty
   */
  Iswarrenty: boolean;

  /**
   * LanguageFk
   */
  LanguageFk: number;

  /**
   * MdcBillingSchemaFk
   */
  MdcBillingSchemaFk: number;

  /**
   * MdcControllingunitFk
   */
  MdcControllingunitFk?: number | null;

  /**
   * MdcTaxCodeFk
   */
  MdcTaxCodeFk: number;

  /**
   * ObjUnitFk
   */
  ObjUnitFk?: number | null;

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
   * OrdHeaderFormdataEntities
   */
  OrdHeaderFormdataEntities?: IOrdHeaderFormDataEntity[] | null;

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
   * OrdernoCustomer
   */
  OrdernoCustomer?: string | null;

  /**
   * PaymentTermFiFk
   */
  PaymentTermFiFk?: number | null;

  /**
   * PaymentTermPaFk
   */
  PaymentTermPaFk?: number | null;

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
   * ProjectEntity
   */
  ProjectEntity?: IProjectEntity | null;

  /**
   * ProjectFk
   */
  ProjectFk: number;

  /**
   * Remark
   */
  Remark?: string | null;

  /**
   * RevisionApplicable
   */
  RevisionApplicable: boolean;

  /**
   * RubricCategoryFk
   */
  RubricCategoryFk: number;

  /**
   * SearchPattern
   */
  SearchPattern?: string | null;

  /**
   * SubsidiaryFk
   */
  SubsidiaryFk?: number | null;

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
   * Userdefineddate01
   */
  Userdefineddate01?: Date | string | null;

  /**
   * Userdefineddate02
   */
  Userdefineddate02?: Date | string | null;

  /**
   * Userdefineddate03
   */
  Userdefineddate03?: Date | string | null;

  /**
   * Userdefineddate04
   */
  Userdefineddate04?: Date | string | null;

  /**
   * Userdefineddate05
   */
  Userdefineddate05?: Date | string | null;

  /**
   * VatgroupFk
   */
  VatgroupFk?: number | null;

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
   * WipHeaderEntities
   */
  WipHeaderEntities?: IWipHeaderEntity[] | null;

  /**
   * WipTypeFk
   */
  WipTypeFk?: number | null;

  /**
   * WipUntil
   */
  WipUntil?: Date | string | null;
}
