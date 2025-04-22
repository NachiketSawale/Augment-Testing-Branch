/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo } from '@libs/platform/common';
import { IContactEntity } from '../contact';


export interface IBusinessPartnerLookupVEntityGenerated {

  /**
   * ActiveFrameworkContract
   */
  ActiveFrameworkContract: boolean;

  /**
   * ActiveFrmkCont
   */
  ActiveFrmkCont?: number | null;

  /**
   * AddressLine
   */
  AddressLine?: string | null;

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
   * BasCommunicationChannelFk
   */
  BasCommunicationChannelFk?: number | null;

  /**
   * BedirektNo
   */
  BedirektNo?: string | null;

  /**
   * BpIsExisted
   */
  BpIsExisted: boolean;

  /**
   * BpdStatus2Fk
   */
  BpdStatus2Fk?: number | null;

  /**
   * BpdStatusFk
   */
  BpdStatusFk: number;

  /**
   * BusinessPartnerName1
   */
  BusinessPartnerName1?: string | null;

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
   * City
   */
  City?: string | null;

  /**
   * ClerkFk
   */
  ClerkFk?: number | null;

  /**
   * Code
   */
  Code?: string | null;

  /**
   * CompanyFk
   */
  CompanyFk: number;

  /**
   * ContactDtos
   */
  ContactDtos?: IContactEntity[] | null;

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
   * Country
   */
  Country?: string | null;

  /**
   * CountryFk
   */
  CountryFk?: number | null;

  /**
   * CountryVatFk
   */
  CountryVatFk?: number | null;

  /**
   * County
   */
  County?: string | null;

  /**
   * CraftCooperative
   */
  CraftCooperative?: string | null;

  /**
   * CraftCooperativeType
   */
  CraftCooperativeType?: string | null;

  /**
   * CraftcooperativeDate
   */
  CraftcooperativeDate?: Date | string | null;

  /**
   * CreateUserName
   */
  CreateUserName?: string | null;

  /**
   * Creditstanding
   */
  Creditstanding?: string | null;

  /**
   * CreditstandingFk
   */
  CreditstandingFk?: number | null;

  /**
   * CrefoNo
   */
  CrefoNo?: string | null;

  /**
   * CustomerAbc
   */
  CustomerAbc?: string | null;

  /**
   * CustomerAbcFk
   */
  CustomerAbcFk?: number | null;

  /**
   * CustomerBranchFk
   */
  CustomerBranchFk?: number | null;

  /**
   * CustomerGroup
   */
  CustomerGroup?: string | null;

  /**
   * CustomerGroupFk
   */
  CustomerGroupFk?: number | null;

  /**
   * CustomerSector
   */
  CustomerSector?: string | null;

  /**
   * CustomerSectorFk
   */
  CustomerSectorFk?: number | null;

  /**
   * CustomerStatus
   */
  CustomerStatus?: string | null;

  /**
   * CustomerStatusFk
   */
  CustomerStatusFk?: number | null;

  /**
   * Description
   */
  Description?: string | null;

  /**
   * DunsNo
   */
  DunsNo?: string | null;

  /**
   * Email
   */
  Email?: string | null;

  /**
   * FaxNumber
   */
  FaxNumber?: string | null;

  /**
   * HasFrameworkAgreement
   */
  HasFrameworkAgreement: boolean;

  /**
   * Icon
   */
  Icon?: number | null;

  /**
   * Id
   */
  Id: number;

  /**
   * Inserted
   */
  Inserted: Date | string;

  /**
   * Internet
   */
  Internet?: string | null;

  /**
   * IsFrameWork
   */
  IsFrameWork: boolean;

  /**
   * IsLive
   */
  IsLive: boolean;

  /**
   * IsNationWide
   */
  IsNationWide?: boolean | null;

  /**
   * Iso2
   */
  Iso2?: string | null;

  /**
   * LanguageDesc
   */
  LanguageDesc?: string | null;

  /**
   * LanguageFk
   */
  LanguageFk?: number | null;

  /**
   * Latitude
   */
  Latitude?: number | null;

  /**
   * LegalForm
   */
  LegalForm?: string | null;

  /**
   * LegalFormFk
   */
  LegalFormFk?: number | null;

  /**
   * Longitude
   */
  Longitude?: number | null;

  /**
   * MatchCode
   */
  MatchCode?: string | null;

  /**
   * Mobile
   */
  Mobile?: string | null;

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
   * Status2DescriptionTranslateInfo
   */
  Status2DescriptionTranslateInfo?: IDescriptionInfo | null;

  /**
   * Status2Icon
   */
  Status2Icon?: number | null;

  /**
   * StatusDescriptionTranslateInfo
   */
  StatusDescriptionTranslateInfo?: IDescriptionInfo | null;

  /**
   * Street
   */
  Street?: string | null;

  /**
   * SubsidiaryFk
   */
  SubsidiaryFk?: number | null;

  /**
   * SupplierId
   */
  SupplierId?: number | null;

  /**
   * TaxNo
   */
  TaxNo?: string | null;

  /**
   * TaxOfficeCode
   */
  TaxOfficeCode?: string | null;

  /**
   * TelephoneNumber1
   */
  TelephoneNumber1?: string | null;

  /**
   * Telephonenumber2
   */
  Telephonenumber2?: string | null;

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
   * UpdateUserName
   */
  UpdateUserName?: string | null;

  /**
   * Updated
   */
  Updated?: Date | string | null;

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
   * VatNo
   */
  VatNo?: string | null;

  /**
   * VatNoEu
   */
  VatNoEu?: string | null;

  /**
   * ZipCode
   */
  ZipCode?: string | null;
}
