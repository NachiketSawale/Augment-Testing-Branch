/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IProjectRoleEntityGenerated extends IEntityBase {

  /**
   * Address
   */
  //Address?: IAddressEntity | null;

  /**
   * AddressFk
   */
  AddressFk?: number | null;

  /**
   * ClerkFk
   */
  ClerkFk: number;

  /**
   * ClerkRoleFk
   */
  ClerkRoleFk: number;

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
   * ProjectFk
   */
  ProjectFk: number;

  /**
   * RegionFk
   */
  RegionFk?: number | null;

  /**
   * RoleRequiresUniqueness
   */
  RoleRequiresUniqueness: boolean;

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

  /**
   * ValidFrom
   */
  ValidFrom?: Date | null;

  /**
   * ValidTo
   */
  ValidTo?: Date | null;
}
