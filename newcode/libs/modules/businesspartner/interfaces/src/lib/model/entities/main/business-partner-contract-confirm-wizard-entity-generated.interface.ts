/*
 * Copyright(c) RIB Software GmbH
 */

import { IBusinessPartner2CompanyEntity } from './business-partner-2-company-entity.interface';
import { IBusinessPartnerRelationEntity } from './business-partner-relation-entity.interface';
import { IBusinessPartnerStatus2Entity } from './business-partner-status-2-entity.interface';
import { ICreditstandingEntity } from './creditstanding-entity.interface';
import { IGuarantorEntity } from './guarantor-entity.interface';
import { ISubsidiaryEntity } from './subsidiary-entity.interface';
import { IUpdaterequestEntity } from './updaterequest-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IBusinessPartnerContractConfirmWizardEntityGenerated extends IEntityBase {

  /**
   * ActiveFrameworkContract
   */
  ActiveFrameworkContract: boolean;

  /**
   * Avaid
   */
  Avaid?: number | null;

  /**
   * AvgEvaluationA
   */
  AvgEvaluationA: number;

  /**
   * AvgEvaluationB
   */
  AvgEvaluationB: number;

  /**
   * AvgEvaluationC
   */
  AvgEvaluationC: number;

  /**
   * BedirektNo
   */
  BedirektNo?: string | null;

  /**
   * BiIdnr
   */
  BiIdnr?: string | null;

  /**
   * BpdBp2BasCompanyEntities
   */
  BpdBp2BasCompanyEntities?: IBusinessPartner2CompanyEntity[] | null;

  /**
   * BusinessPartnerFk
   */
  BusinessPartnerFk: number;

  /**
   * BusinessPartnerName1
   */
  BusinessPartnerName1: string;

  /**
   * BusinessPartnerName2
   */
  BusinessPartnerName2?: string | null;

  /**
   * BusinessPartnerName3
   */
  BusinessPartnerName3?: string | null;

  /**
   * BusinessPartnerName4
   */
  BusinessPartnerName4?: string | null;

  /**
   * BusinessPartnerStatus2Entity
   */
  BusinessPartnerStatus2Entity?: IBusinessPartnerStatus2Entity | null;

  /**
   * BusinessPartnerStatus2Fk
   */
  BusinessPartnerStatus2Fk?: number | null;

  /**
   * BusinessPartnerStatusFk
   */
  BusinessPartnerStatusFk: number;

  /**
   * ClerkFk
   */
  ClerkFk?: number | null;

  /**
   * Code
   */
  Code?: string | null;

  /**
   * CommunicationChannelFk
   */
  CommunicationChannelFk?: number | null;

  /**
   * CompanyFk
   */
  CompanyFk: number;

  /**
   * ContactEmail
   */
  ContactEmail?: string | null;

  /**
   * ContactFirstName
   */
  ContactFirstName?: string | null;

  /**
   * ContactFk
   */
  ContactFk?: number | null;

  /**
   * ContactLastName
   */
  ContactLastName?: string | null;

  /**
   * CountEvaluationA
   */
  CountEvaluationA: number;

  /**
   * CountEvaluationB
   */
  CountEvaluationB: number;

  /**
   * CountEvaluationC
   */
  CountEvaluationC: number;

  /**
   * CraftCooperative
   */
  CraftCooperative?: string | null;

  /**
   * CraftCooperativeDate
   */
  CraftCooperativeDate?: Date | string | null;

  /**
   * CraftCooperativeType
   */
  CraftCooperativeType?: string | null;

  /**
   * CreditstandingEntity
   */
  CreditstandingEntity?: ICreditstandingEntity | null;

  /**
   * CreditstandingFk
   */
  CreditstandingFk?: number | null;

  /**
   * CrefoNo
   */
  CrefoNo?: string | null;

  /**
   * CustomerAbcFk
   */
  CustomerAbcFk?: number | null;

  /**
   * CustomerBranchFk
   */
  CustomerBranchFk?: number | null;

  /**
   * CustomerGroupFk
   */
  CustomerGroupFk?: number | null;

  /**
   * CustomerSectorFk
   */
  CustomerSectorFk?: number | null;

  /**
   * CustomerStatusFk
   */
  CustomerStatusFk?: number | null;

  /**
   * DunsNo
   */
  DunsNo?: string | null;

  /**
   * Email
   */
  Email?: string | null;

  /**
   * GuarantorEntities
   */
  GuarantorEntities?: IGuarantorEntity[] | null;

  /**
   * HasFrameworkAgreement
   */
  HasFrameworkAgreement: boolean;

  /**
   * Id
   */
  Id: number;

  /**
   * Internet
   */
  Internet?: string | null;

  /**
   * IsAnonymized
   */
  IsAnonymized: boolean;

  /**
   * IsCheck
   */
  IsCheck: boolean;

  /**
   * IsFrameWork
   */
  IsFrameWork: boolean;

  /**
   * IsLive
   */
  IsLive: boolean;

  /**
   * IsNationwide
   */
  IsNationwide?: boolean | null;

  /**
   * LanguageFk
   */
  LanguageFk?: number | null;

  /**
   * LegalFormFk
   */
  LegalFormFk?: number | null;

  /**
   * MatchCode
   */
  MatchCode?: string | null;

  /**
   * PermissionObjectInfo
   */
  PermissionObjectInfo?: string | null;

  /**
   * PrcIncotermFk
   */
  PrcIncotermFk?: number | null;

  /**
   * RefValue1
   */
  RefValue1?: string | null;

  /**
   * RefValue2
   */
  RefValue2?: string | null;

  /**
   * RelationEntities_BpdBusinesspartner2Fk
   */
  RelationEntities_BpdBusinesspartner2Fk?: IBusinessPartnerRelationEntity[] | null;

  /**
   * RelationEntities_BpdBusinesspartnerFk
   */
  RelationEntities_BpdBusinesspartnerFk?: IBusinessPartnerRelationEntity[] | null;

  /**
   * Remark1
   */
  Remark1?: string | null;

  /**
   * Remark2
   */
  Remark2?: string | null;

  /**
   * RemarkMarketing
   */
  RemarkMarketing?: string | null;

  /**
   * RubricCategoryFk
   */
  RubricCategoryFk?: number | null;

  /**
   * Salutation
   */
  Salutation?: string | null;

  /**
   * SubsidiaryDescriptor
   */
  SubsidiaryDescriptor?: ISubsidiaryEntity | null;

  /**
   * TaxNo
   */
  TaxNo?: string | null;

  /**
   * TaxOfficeCode
   */
  TaxOfficeCode?: string | null;

  /**
   * TitleFk
   */
  TitleFk?: number | null;

  /**
   * TradeName
   */
  TradeName?: string | null;

  /**
   * TradeRegister
   */
  TradeRegister?: string | null;

  /**
   * TradeRegisterDate
   */
  TradeRegisterDate?: Date | string | null;

  /**
   * TradeRegisterNo
   */
  TradeRegisterNo?: string | null;

  /**
   * UpdaterequestEntities
   */
  UpdaterequestEntities?: IUpdaterequestEntity[] | null;

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
   * VatCountryFk
   */
  VatCountryFk?: number | null;

  /**
   * VatNo
   */
  VatNo?: string | null;

  /**
   * VatNoEu
   */
  VatNoEu?: string | null;
}
