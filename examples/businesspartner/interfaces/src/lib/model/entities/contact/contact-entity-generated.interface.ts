/*
 * Copyright(c) RIB Software GmbH
 */

import { AddressEntity, TelephoneEntity } from '@libs/basics/shared';
import { IContactAbcEntity } from './contact-abc-entity.interface';
import { IContactOriginEntity } from './contact-origin-entity.interface';
import { IContactRoleEntity } from './contact-role-entity.interface';
import { IContactTimelinessEntity } from './contact-timeliness-entity.interface';
import { IEntityBase, IEntityIdentification } from '@libs/platform/common';
import { IContact2BasCompanyEntity, IContact2ExternalEntity, IContactPhotoEntity } from '../common';

export interface IContactEntityGenerated extends IEntityBase, IEntityIdentification {

  /**
   * AddressDescriptor
   */
  AddressDescriptor?: AddressEntity | null;

  /**
   * AddressFk
   */
  AddressFk?: number | null;

  /**
   * BasCommunicationchannelFk
   */
  BasCommunicationchannelFk?: number | null;

  /**
   * BasLanguageFk
   */
  BasLanguageFk?: number | null;

  /**
   * BirthDate
   */
  BirthDate?: Date | null;

  /**
   * BranchEmail
   */
  BranchEmail?: string | null;

  /**
   * BusinessPartnerFk
   */
  BusinessPartnerFk: number;

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
   * Contact2BasCompanyEntities
   */
  Contact2BasCompanyEntities?: IContact2BasCompanyEntity[] | null;

  /**
   * Contact2externalEntities
   */
  Contact2externalEntities?: IContact2ExternalEntity[] | null;

  /**
   * ContactAbcEntity
   */
  ContactAbcEntity?: IContactAbcEntity | null;

  /**
   * ContactAbcFk
   */
  ContactAbcFk?: number | null;

  /**
   * ContactOriginEntity
   */
  ContactOriginEntity?: IContactOriginEntity | null;

  /**
   * ContactOriginFk
   */
  ContactOriginFk?: number | null;

  /**
   * ContactPhotoEntities
   */
  ContactPhotoEntities?: IContactPhotoEntity[] | null;

  /**
   * ContactRoleEntity
   */
  ContactRoleEntity?: IContactRoleEntity | null;

  /**
   * ContactRoleFk
   */
  ContactRoleFk?: number | null;

  /**
   * ContactTimelinessEntity
   */
  ContactTimelinessEntity?: IContactTimelinessEntity | null;

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
   * EmailPrivate
   */
  EmailPrivate?: string | null;

  /**
   * EncryptionTypeFk
   */
  EncryptionTypeFk: number;

  /**
   * FamilyName
   */
  FamilyName?: string | null;

  /**
   * FirstName
   */
  FirstName?: string | null;

  /**
   * FrmUserExtProviderFk
   */
  FrmUserExtProviderFk?: number | null;

  /**
   * FullName
   */
  FullName?: string | null;

  /**
   * HasPassword
   */
  HasPassword: boolean;

  /**
   * Id
   */
  Id: number;

  /**
   * IdentityProviderName
   */
  IdentityProviderName?: string | null;

  /**
   * Initials
   */
  Initials?: string | null;

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
   * IsDefault
   */
  IsDefault: boolean;

  /**
   * IsDefaultBaseline
   */
  IsDefaultBaseline: boolean;

  /**
   * IsLive
   */
  IsLive: boolean;

  /**
   * IsToExchangeGlobal
   */
  IsToExchangeGlobal: boolean;

  /**
   * IsToExchangeUser
   */
  IsToExchangeUser: boolean;

  /**
   * LastLogin
   */
  LastLogin?: Date | null;

  /**
   * LastLoginOld
   */
  LastLoginOld?: Date | null;

  /**
   * LogonName
   */
  LogonName?: string | null;

  /**
   * MobileDescriptor
   */
  MobileDescriptor?: TelephoneEntity | null;

  /**
   * MobilePattern
   */
  MobilePattern?: string | null;

  /**
   * NickName
   */
  NickName?: string | null;

  /**
   * PartnerName
   */
  PartnerName?: string | null;

  /**
   * Password
   */
  Password?: string | null;

  /**
   * PlainPassword
   */
  PlainPassword?: string | null;

  /**
   * PortalUserGroupFk
   */
  PortalUserGroupFk: number;

  /**
   * PortalUserGroupName
   */
  PortalUserGroupName?: string | null;

  /**
   * PrivateTelephoneNumberDescriptor
   */
  PrivateTelephoneNumberDescriptor?: TelephoneEntity | null;

  /**
   * Pronunciation
   */
  Pronunciation?: string | null;

  /**
   * Provider
   */
  Provider?: string | null;

  /**
   * ProviderAddress
   */
  ProviderAddress?: string | null;

  /**
   * ProviderComment
   */
  ProviderComment?: string | null;

  /**
   * ProviderEmail
   */
  ProviderEmail?: string | null;

  /**
   * ProviderFamilyName
   */
  ProviderFamilyName?: string | null;

  /**
   * ProviderId
   */
  ProviderId?: string | null;

  /**
   * Remark
   */
  Remark?: string | null;

  /**
   * SearchPattern
   */
  SearchPattern?: string | null;

  /**
   * SetInactiveDate
   */
  SetInactiveDate?: Date | string | null;

  /**
   * State
   */
  State?: number | null;

  /**
   * Statement
   */
  Statement?: string | null;

  /**
   * SubsidiaryFk
   */
  SubsidiaryFk?: number | null;

  /**
   * TeleFaxDescriptor
   */
  TeleFaxDescriptor?: TelephoneEntity | null;

  /**
   * TelefaxPattern
   */
  TelefaxPattern?: string | null;

  /**
   * Telephone2Pattern
   */
  Telephone2Pattern?: string | null;

  /**
   * TelephoneNumber2Descriptor
   */
  TelephoneNumber2Descriptor?: TelephoneEntity | null;

  /**
   * TelephoneNumber2Fk
   */
  TelephoneNumber2Fk?: number | null;

  /**
   * TelephoneNumberDescriptor
   */
  TelephoneNumberDescriptor?: TelephoneEntity | null;

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
   * WrongAttempts
   */
  WrongAttempts: number;

  /**
   * bpContactCheck
   */
  bpContactCheck: boolean;
}
