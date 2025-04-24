/*
 * Copyright(c) RIB Software GmbH
 */

import { IBidHeaderEntity } from './bid-header-entity.interface';
import { IBusinesspartnerEntity } from './businesspartner-entity.interface';
import { IConHeaderEntity } from './con-header-entity.interface';
import { IContactEntity } from './contact-entity.interface';
import { IEstimateEntity } from './estimate-entity.interface';
import { IBilHeaderEntity } from './bil-header-entity.interface';
import { IHsqChecklistEntity } from './hsq-checklist-entity.interface';
import { IInvHeaderEntity } from './inv-header-entity.interface';
import { ILgmJobEntity } from './lgm-job-entity.interface';
import { IOrdHeaderEntity } from './ord-header-entity.interface';
import { IPesHeaderEntity } from './pes-header-entity.interface';
import { IPrcPackageEntity } from './prc-package-entity.interface';
import { IPrjEstRuleEntity } from './prj-est-rule-entity.interface';
import { IProjectEntity } from './project-entity.interface';
import { IProjectFormDataEntity } from './project-form-data-entity.interface';
import { IPsdActivityEntity } from './psd-activity-entity.interface';
import { IQtnHeaderEntity } from './qtn-header-entity.interface';
import { IQtoHeaderEntity } from './qto-header-entity.interface';
import { IReqHeaderEntity } from './req-header-entity.interface';
import { IResRequisitionEntity } from './res-requisition-entity.interface';
import { IResReservationEntity } from './res-reservation-entity.interface';
import { IRfqHeaderEntity } from './rfq-header-entity.interface';
import { IWipHeaderEntity } from './wip-header-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IProjectEntityGenerated extends IEntityBase {

  /**
   * AddressFk
   */
  AddressFk?: number | null;

  /**
   * BidHeaderEntities
   */
  BidHeaderEntities?: IBidHeaderEntity[] | null;

  /**
   * BlobsFk
   */
  BlobsFk?: number | null;

  /**
   * BusinessUnitFk
   */
  BusinessUnitFk?: number | null;

  /**
   * BusinesspartnerEntity
   */
  BusinesspartnerEntity?: IBusinesspartnerEntity | null;

  /**
   * BusinesspartnerFk
   */
  BusinesspartnerFk?: number | null;

  /**
   * CalCalendarFk
   */
  CalCalendarFk?: number | null;

  /**
   * CalloffDate
   */
  CalloffDate?: Date | string | null;

  /**
   * CalloffRemark
   */
  CalloffRemark?: string | null;

  /**
   * Calloffno
   */
  Calloffno?: string | null;

  /**
   * CatConfigFk
   */
  CatConfigFk: number;

  /**
   * CatConfigtypeFk
   */
  CatConfigtypeFk?: number | null;

  /**
   * ClerkFk
   */
  ClerkFk: number;

  /**
   * ClosingDatetime
   */
  ClosingDatetime?: Date | string | null;

  /**
   * ClosingLocation
   */
  ClosingLocation?: string | null;

  /**
   * CompanyFk
   */
  CompanyFk: number;

  /**
   * CompanyResponsibleFk
   */
  CompanyResponsibleFk: number;

  /**
   * ConHeaderEntities
   */
  ConHeaderEntities?: IConHeaderEntity[] | null;

  /**
   * ContactEntity
   */
  ContactEntity?: IContactEntity | null;

  /**
   * ContactFk
   */
  ContactFk?: number | null;

  /**
   * ContentFk
   */
  ContentFk?: number | null;

  /**
   * ContentTypeFk
   */
  ContentTypeFk?: number | null;

  /**
   * ContextFk
   */
  ContextFk?: number | null;

  /**
   * ContractTypeFk
   */
  ContractTypeFk?: number | null;

  /**
   * Contractno
   */
  Contractno?: string | null;

  /**
   * ControllingunittemplateFk
   */
  ControllingunittemplateFk?: number | null;

  /**
   * CountryFk
   */
  CountryFk?: number | null;

  /**
   * CurrencyFk
   */
  CurrencyFk: number;

  /**
   * CustomerFk
   */
  CustomerFk?: number | null;

  /**
   * CustomerGroupFk
   */
  CustomerGroupFk?: number | null;

  /**
   * DateEffective
   */
  DateEffective: Date | string;

  /**
   * DateReceipt
   */
  DateReceipt?: Date | string | null;

  /**
   * Distance
   */
  Distance?: number | null;

  /**
   * Email
   */
  Email?: string | null;

  /**
   * EndDate
   */
  EndDate?: Date | string | null;

  /**
   * EstimateEntities
   */
  EstimateEntities?: IEstimateEntity[] | null;

  /**
   * GroupFk
   */
  GroupFk: number;

  /**
   * HandoverDate
   */
  HandoverDate?: Date | string | null;

  /**
   * HeaderEntities
   */
  HeaderEntities?: IBilHeaderEntity[] | null;

  /**
   * HsqChecklistEntities
   */
  HsqChecklistEntities?: IHsqChecklistEntity[] | null;

  /**
   * Id
   */
  Id: number;

  /**
   * InternetWebcam
   */
  InternetWebcam?: string | null;

  /**
   * InvHeaderEntities
   */
  InvHeaderEntities?: IInvHeaderEntity[] | null;

  /**
   * Isadministration
   */
  Isadministration: boolean;

  /**
   * Isintercompany
   */
  Isintercompany: boolean;

  /**
   * Islive
   */
  Islive: boolean;

  /**
   * LanguageContractFk
   */
  LanguageContractFk?: number | null;

  /**
   * LgmJobEntities
   */
  LgmJobEntities?: ILgmJobEntity[] | null;

  /**
   * MainProject
   */
  MainProject: number;

  /**
   * Matchcode
   */
  Matchcode?: string | null;

  /**
   * MdcAssetMasterFk
   */
  MdcAssetMasterFk?: number | null;

  /**
   * MdcBillingSchemaFk
   */
  MdcBillingSchemaFk?: number | null;

  /**
   * MdcBudgetCodeFk
   */
  MdcBudgetCodeFk?: number | null;

  /**
   * MdcClassificationFk
   */
  MdcClassificationFk?: number | null;

  /**
   * MdcWicFk
   */
  MdcWicFk?: number | null;

  /**
   * MdcWorkCategoryFk
   */
  MdcWorkCategoryFk?: number | null;

  /**
   * OrdHeaderEntities
   */
  OrdHeaderEntities?: IOrdHeaderEntity[] | null;

  /**
   * Overnight
   */
  Overnight?: string | null;

  /**
   * PaymentTermFiFk
   */
  PaymentTermFiFk?: number | null;

  /**
   * PaymentTermPaFk
   */
  PaymentTermPaFk?: number | null;

  /**
   * PesHeaderEntities
   */
  PesHeaderEntities?: IPesHeaderEntity[] | null;

  /**
   * PlannedAwardDate
   */
  PlannedAwardDate?: Date | string | null;

  /**
   * PrcPackageEntities
   */
  PrcPackageEntities?: IPrcPackageEntity[] | null;

  /**
   * PrjEstRuleEntities
   */
  PrjEstRuleEntities?: IPrjEstRuleEntity[] | null;

  /**
   * ProjectDescription
   */
  ProjectDescription?: string | null;

  /**
   * ProjectEntities_ProjectMainFk
   */
  ProjectEntities_ProjectMainFk?: IProjectEntity[] | null;

  /**
   * ProjectEntity_ProjectMainFk
   */
  ProjectEntity_ProjectMainFk?: IProjectEntity | null;

  /**
   * ProjectFormDataEntities
   */
  ProjectFormDataEntities?: IProjectFormDataEntity[] | null;

  /**
   * ProjectMainFk
   */
  ProjectMainFk?: number | null;

  /**
   * ProjectName
   */
  ProjectName?: string | null;

  /**
   * ProjectName2
   */
  ProjectName2?: string | null;

  /**
   * Projectdocpath
   */
  Projectdocpath?: string | null;

  /**
   * Projectindex
   */
  Projectindex: number;

  /**
   * ProjectindexAlpha
   */
  ProjectindexAlpha: string;

  /**
   * Projectno
   */
  Projectno: string;

  /**
   * Projectpath
   */
  Projectpath?: string | null;

  /**
   * PsdActivityEntities
   */
  PsdActivityEntities?: IPsdActivityEntity[] | null;

  /**
   * PublicationDate
   */
  PublicationDate?: Date | string | null;

  /**
   * QtnHeaderEntities
   */
  QtnHeaderEntities?: IQtnHeaderEntity[] | null;

  /**
   * QtoHeaderEntities
   */
  QtoHeaderEntities?: IQtoHeaderEntity[] | null;

  /**
   * RealestateFk
   */
  RealestateFk?: number | null;

  /**
   * RegionFk
   */
  RegionFk?: number | null;

  /**
   * Remark
   */
  Remark?: string | null;

  /**
   * ReqHeaderEntities
   */
  ReqHeaderEntities?: IReqHeaderEntity[] | null;

  /**
   * ResRequisitionEntities
   */
  ResRequisitionEntities?: IResRequisitionEntity[] | null;

  /**
   * ResReservationEntities
   */
  ResReservationEntities?: IResReservationEntity[] | null;

  /**
   * RfqHeaderEntities
   */
  RfqHeaderEntities?: IRfqHeaderEntity[] | null;

  /**
   * RubricCategoryFk
   */
  RubricCategoryFk: number;

  /**
   * SearchPattern
   */
  SearchPattern?: string | null;

  /**
   * StartDate
   */
  StartDate: Date | string;

  /**
   * StatusFk
   */
  StatusFk: number;

  /**
   * SubsidiaryFk
   */
  SubsidiaryFk?: number | null;

  /**
   * TelephoneMobilFk
   */
  TelephoneMobilFk?: number | null;

  /**
   * TelephoneNumberFk
   */
  TelephoneNumberFk?: number | null;

  /**
   * TelephoneTelefaxFk
   */
  TelephoneTelefaxFk?: number | null;

  /**
   * TenderDate
   */
  TenderDate?: Date | string | null;

  /**
   * TenderRemark
   */
  TenderRemark?: string | null;

  /**
   * TypeFk
   */
  TypeFk: number;

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
   * WarrentyEnd
   */
  WarrentyEnd?: Date | string | null;

  /**
   * WarrentyRemark
   */
  WarrentyRemark?: string | null;

  /**
   * WarrentyStart
   */
  WarrentyStart?: Date | string | null;

  /**
   * WipHeaderEntities
   */
  WipHeaderEntities?: IWipHeaderEntity[] | null;
}
