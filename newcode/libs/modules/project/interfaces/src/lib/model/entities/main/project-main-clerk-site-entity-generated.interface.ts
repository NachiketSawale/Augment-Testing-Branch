/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IProjectClerkSiteEntityGenerated extends IEntityBase {

  /**
   * Address
   */
  //Address?: IAddressEntity | null;

  /**
   * AddressFk
   */
  AddressFk?: number | null;

  /**
   * AssetMasterFk
   */
  AssetMasterFk?: number | null;

  /**
   * ClerkFk
   */
  ClerkFk: number;

  /**
   * Comment
   */
  Comment?: string | null;

  /**
   * CountryFk
   */
  CountryFk?: number | null;

  /**
   * Email
   */
  Email?: string | null;

  /**
   * Id
   */
  Id: number;

  /**
   * LocationFk
   */
  LocationFk?: number | null;

  /**
   * ProjectFk
   */
  ProjectFk: number;

  /**
   * ProjectRoleFk
   */
  ProjectRoleFk: number;

  /**
   * RegionFk
   */
  RegionFk?: number | null;

  /**
   * Remark
   */
  Remark?: string | null;

  /**
   * TelephoneMobil
   */
  //TelephoneMobil?: ITelephoneNumberEntity | null;

  /**
   * TelephoneMobilFk
   */
  TelephoneMobilFk?: number | null;

  /**
   * TelephoneNumber
   */
  //TelephoneNumber?: ITelephoneNumberEntity | null;

  /**
   * TelephoneNumberFk
   */
  TelephoneNumberFk?: number | null;

  /**
   * TelephoneNumberTelefax
   */
  //TelephoneNumberTelefax?: ITelephoneNumberEntity | null;

  /**
   * TelephonePrivat
   */
  //TelephonePrivat?: ITelephoneNumberEntity | null;

  /**
   * TelephonePrivatFk
   */
  TelephonePrivatFk?: number | null;

  /**
   * TelephonePrivatMobil
   */
  //TelephonePrivatMobil?: ITelephoneNumberEntity | null;

  /**
   * TelephonePrivatMobilFk
   */
  TelephonePrivatMobilFk?: number | null;

  /**
   * TelephoneTelefaxFk
   */
  TelephoneTelefaxFk?: number | null;
}
