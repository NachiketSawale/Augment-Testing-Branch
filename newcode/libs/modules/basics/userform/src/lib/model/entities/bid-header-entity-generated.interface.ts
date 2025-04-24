/*
 * Copyright(c) RIB Software GmbH
 */

import { IBidHeaderEntity } from './bid-header-entity.interface';
import { IBidHeaderFormDataEntity } from './bid-header-form-data-entity.interface';
import { IBusinesspartnerEntity } from './businesspartner-entity.interface';
import { IContactEntity } from './contact-entity.interface';
import { IOrdHeaderEntity } from './ord-header-entity.interface';
import { IProjectEntity } from './project-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IBidHeaderEntityGenerated extends IEntityBase {

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
   * BidHeaderFormdataEntities
   */
  BidHeaderFormdataEntities?: IBidHeaderFormDataEntity[] | null;

  /**
   * BidStatusFk
   */
  BidStatusFk: number;

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
   * ChangeFk
   */
  ChangeFk?: number | null;

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
   * OrdHeaderEntities
   */
  OrdHeaderEntities?: IOrdHeaderEntity[] | null;

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
   * PriceFixingDate
   */
  PriceFixingDate?: Date | string | null;

  /**
   * ProjectEntity
   */
  ProjectEntity?: IProjectEntity | null;

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
}
