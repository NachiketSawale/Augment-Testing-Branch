/*
 * Copyright(c) RIB Software GmbH
 */

import { TelephoneEntity } from '@libs/basics/shared';
import { IEntityBase } from '@libs/platform/common';
import { IAddressEntity } from '@libs/ui/map';

export interface IRealEstateEntityGenerated extends IEntityBase {

  /**
   * Address
   */
  Address?: IAddressEntity | null;

  /**
   * AddressFk
   */
  AddressFk?: number | null;

  /**
   * BusinessPartnerFk
   */
  BusinessPartnerFk: number;

  /**
   * Id
   */
  Id: number;

  /**
   * LastAction
   */
  LastAction?: Date | string | null;

  /**
   * ObjectName
   */
  ObjectName?: string | null;

  /**
   * Potential
   */
  Potential: number;

  /**
   * RealestateTypeFk
   */
  RealestateTypeFk: number;

  /**
   * Remark
   */
  Remark?: string | null;

  /**
   * SubsidiaryFk
   */
  SubsidiaryFk?: number | null;

  /**
   * TelefaxPattern
   */
  TelefaxPattern?: string | null;

  /**
   * TelephoneNumber
   */
  TelephoneNumber?: TelephoneEntity | null;

  /**
   * TelephoneNumberFk
   */
  TelephoneNumberFk?: number | null;

  /**
   * TelephoneNumberTeleFax
   */
  TelephoneNumberTeleFax?: TelephoneEntity | null;

  /**
   * TelephoneNumberTelefaxFk
   */
  TelephoneNumberTelefaxFk?: number | null;

  /**
   * TelephonePattern
   */
  TelephonePattern?: string | null;
}
