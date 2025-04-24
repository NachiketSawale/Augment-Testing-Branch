/*
 * Copyright(c) RIB Software GmbH
 */

import { IBidHeaderEntity } from './bid-header-entity.interface';
import { IBilHeaderEntity } from './bil-header-entity.interface';
import { IBusinesspartnerEntity } from './businesspartner-entity.interface';
import { IConHeaderEntity } from './con-header-entity.interface';
import { IContactFormDataEntity } from './contact-form-data-entity.interface';
import { ILgmJobEntity } from './lgm-job-entity.interface';
import { IOrdHeaderEntity } from './ord-header-entity.interface';
import { IProjectEntity } from './project-entity.interface';
import { IWipHeaderEntity } from './wip-header-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IContactEntityGenerated extends IEntityBase {

  /**
   * AddressFk
   */
  AddressFk?: number | null;

  /**
   * BidHeaderEntities_ContactBilltoFk
   */
  BidHeaderEntities_ContactBilltoFk?: IBidHeaderEntity[] | null;

  /**
   * BidHeaderEntities_ContactFk
   */
  BidHeaderEntities_ContactFk?: IBidHeaderEntity[] | null;

  /**
   * BilHeaderEntities_ContactBilltoFk
   */
  BilHeaderEntities_ContactBilltoFk?: IBilHeaderEntity[] | null;

  /**
   * BilHeaderEntities_ContactFk
   */
  BilHeaderEntities_ContactFk?: IBilHeaderEntity[] | null;

  /**
   * Birthdate
   */
  Birthdate?: Date | string | null;

  /**
   * BusinesspartnerEntity
   */
  BusinesspartnerEntity?: IBusinesspartnerEntity | null;

  /**
   * BusinesspartnerFk
   */
  BusinesspartnerFk: number;

  /**
   * Children
   */
  Children?: string | null;

  /**
   * ClerkResponsibleFk
   */
  ClerkResponsibleFk?: number | null;

  /**
   * CompanyFk
   */
  CompanyFk: number;

  /**
   * ConHeaderEntities_Contact2Fk
   */
  ConHeaderEntities_Contact2Fk?: IConHeaderEntity[] | null;

  /**
   * ConHeaderEntities_ContactFk
   */
  ConHeaderEntities_ContactFk?: IConHeaderEntity[] | null;

  /**
   * ContactAbcFk
   */
  ContactAbcFk?: number | null;

  /**
   * ContactFormdataEntities
   */
  ContactFormdataEntities?: IContactFormDataEntity[] | null;

  /**
   * ContactOriginFk
   */
  ContactOriginFk?: number | null;

  /**
   * ContactRoleFk
   */
  ContactRoleFk?: number | null;

  /**
   * ContactTimelinessFk
   */
  ContactTimelinessFk?: number | null;

  /**
   * CountryFk
   */
  CountryFk?: number | null;

  /**
   * Email
   */
  Email?: string | null;

  /**
   * EncryptiontypeFk
   */
  EncryptiontypeFk: number;

  /**
   * FamilyName
   */
  FamilyName?: string | null;

  /**
   * FirstName
   */
  FirstName?: string | null;

  /**
   * Id
   */
  Id: number;

  /**
   * Initials
   */
  Initials?: string | null;

  /**
   * Internet
   */
  Internet?: string | null;

  /**
   * Isdefault
   */
  Isdefault: boolean;

  /**
   * Islive
   */
  Islive: boolean;

  /**
   * LanguageFk
   */
  LanguageFk?: number | null;

  /**
   * LastLogin
   */
  LastLogin?: Date | string | null;

  /**
   * LgmJobEntities
   */
  LgmJobEntities?: ILgmJobEntity[] | null;

  /**
   * MobilePattern
   */
  MobilePattern?: string | null;

  /**
   * Nickname
   */
  Nickname?: string | null;

  /**
   * OrdHeaderEntities_ContactBilltoFk
   */
  OrdHeaderEntities_ContactBilltoFk?: IOrdHeaderEntity[] | null;

  /**
   * OrdHeaderEntities_ContactFk
   */
  OrdHeaderEntities_ContactFk?: IOrdHeaderEntity[] | null;

  /**
   * PartnerName
   */
  PartnerName?: string | null;

  /**
   * Password
   */
  Password?: string | null;

  /**
   * ProjectEntities
   */
  ProjectEntities?: IProjectEntity[] | null;

  /**
   * Pronunciation
   */
  Pronunciation?: string | null;

  /**
   * Remark
   */
  Remark?: string | null;

  /**
   * SearchPattern
   */
  SearchPattern?: string | null;

  /**
   * SubsidiaryFk
   */
  SubsidiaryFk?: number | null;

  /**
   * TelefaxPattern
   */
  TelefaxPattern?: string | null;

  /**
   * Telephone2Pattern
   */
  Telephone2Pattern?: string | null;

  /**
   * TelephoneNumber2Fk
   */
  TelephoneNumber2Fk?: number | null;

  /**
   * TelephoneNumberFk
   */
  TelephoneNumberFk?: number | null;

  /**
   * TelephoneNumberMobilFk
   */
  TelephoneNumberMobilFk?: number | null;

  /**
   * TelephoneNumberTelefaxFk
   */
  TelephoneNumberTelefaxFk?: number | null;

  /**
   * TelephonePattern
   */
  TelephonePattern?: string | null;

  /**
   * TelephonePrivatFk
   */
  TelephonePrivatFk?: number | null;

  /**
   * TelephonePrivatPattern
   */
  TelephonePrivatPattern?: string | null;

  /**
   * Title
   */
  Title?: string | null;

  /**
   * TitleFk
   */
  TitleFk?: number | null;

  /**
   * UserName
   */
  UserName?: string | null;

  /**
   * WipHeaderEntities
   */
  WipHeaderEntities?: IWipHeaderEntity[] | null;

  /**
   * WrongAttempts
   */
  WrongAttempts: number;
}
