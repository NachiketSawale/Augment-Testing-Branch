/*
 * Copyright(c) RIB Software GmbH
 */

import { IAddressEntity } from '@libs/ui/map';
import { ICustomerEntity } from './customer-entity.interface';
import { IEntityBase } from '@libs/platform/common';
import { TelephoneEntity } from '@libs/basics/shared';
import { IBusinessPartner2PrcStructureEntity } from './business-partner-2-prc-structure-entity.interface';
import { IRegionEntity } from './region-entity.interface';

export interface ISubsidiaryEntityGenerated extends IEntityBase {

  /**
   * AddressDto
   */
  AddressDto?: IAddressEntity | null;

  /**
   * AddressFk
   */
  AddressFk?: number | null;

  /**
   * AddressTypeDto
   * todo - not sure where this entity comes from
   */
  //AddressTypeDto?: IAddressTypeEntity | null;

  /**
   * AddressTypeFk
   */
  AddressTypeFk: number;

  /**
   * BedirektNo
   */
  BedirektNo?: string | null;

  /**
   * BusinessPartner2PrcStructureEntities
   */
  BusinessPartner2PrcStructureEntities?: IBusinessPartner2PrcStructureEntity[] | null;

  /**
   * BusinessPartnerFk
   */
  BusinessPartnerFk: number;

  /**
   * CustomerEntities
   */
  CustomerEntities?: ICustomerEntity[] | null;

  /**
   * Description
   */
  Description?: string | null;

  /**
   * Distance
   */
  Distance?: string | null;

  /**
   * Email
   */
  Email?: string | null;

  /**
   * Id
   */
  Id: number;

  /**
   * Innno
   */
  Innno?: string | null;

  /**
   * IsChecked
   */
  IsChecked: boolean;

  /**
   * IsMainAddress
   */
  IsMainAddress: boolean;

  /**
   * MobilePattern
   */
  MobilePattern?: string | null;

  /**
   * RegionDistance
   */
  RegionDistance?: string | null;

  /**
   * RegionEntities
   */
  RegionEntities?: IRegionEntity[] | null;

  /**
   * Remark
   */
  Remark?: string | null;

  /**
   * SubsidiaryStatusFk
   */
  SubsidiaryStatusFk: number;

  /**
   * TaxNo
   */
  TaxNo?: string | null;

  /**
   * TelefaxPattern
   */
  TelefaxPattern?: string | null;

  /**
   * Telephone2Pattern
   */
  Telephone2Pattern?: string | null;

  /**
   * TelephoneNumber1Dto
   */
  TelephoneNumber1Dto?: TelephoneEntity | null;

  /**
   * TelephoneNumber2Dto
   */
  TelephoneNumber2Dto?: TelephoneEntity | null;

  /**
   * TelephoneNumber2Fk
   */
  TelephoneNumber2Fk?: number | null;

  /**
   * TelephoneNumberFk
   */
  TelephoneNumberFk?: number | null;

  /**
   * TelephoneNumberMobileDto
   */
  TelephoneNumberMobileDto?: TelephoneEntity | null;

  /**
   * TelephoneNumberMobileFk
   */
  TelephoneNumberMobileFk?: number | null;

  /**
   * TelephoneNumberTelefaxDto
   */
  TelephoneNumberTelefaxDto?: TelephoneEntity | null;

  /**
   * TelephoneNumberTelefaxFk
   */
  TelephoneNumberTelefaxFk?: number | null;

  /**
   * TelephonePattern
   */
  TelephonePattern?: string | null;

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
   * VatNo
   */
  VatNo?: string | null;
}
