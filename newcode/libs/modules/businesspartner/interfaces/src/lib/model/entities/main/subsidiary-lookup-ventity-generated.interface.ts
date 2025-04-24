/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo } from '@libs/platform/common';

export interface ISubsidiaryLookupVEntityGenerated {

  /**
   * Address
   */
  Address?: string | null;

  /**
   * AddressInfo
   */
  AddressInfo?: string | null;

  /**
   * AddressLine
   */
  AddressLine?: string | null;

  /**
   * AddressTypeInfo
   */
  AddressTypeInfo?: IDescriptionInfo | null;

  /**
   * BusinessPartnerFk
   */
  BusinessPartnerFk: number;

  /**
   * City
   */
  City?: string | null;

  /**
   * County
   */
  County?: string | null;

  /**
   * DisplayText
   */
  DisplayText?: string | null;

  /**
   * Email
   */
  Email?: string | null;

  /**
   * Id
   */
  Id: number;

  /**
   * IsMainAddress
   */
  IsMainAddress: boolean;

  /**
   * Iso2
   */
  Iso2?: string | null;

  /**
   * Street
   */
  Street?: string | null;

  /**
   * SubsidiaryDescription
   */
  SubsidiaryDescription?: string | null;

  /**
   * SubsidiaryStatusFk
   */
  SubsidiaryStatusFk: number;

  /**
   * Telefax
   */
  Telefax?: string | null;

  /**
   * TelefaxPattern
   */
  TelefaxPattern?: string | null;

  /**
   * TelephoneNumber1
   */
  TelephoneNumber1?: string | null;

  /**
   * TelephonePattern
   */
  TelephonePattern?: string | null;

  /**
   * ZipCode
   */
  ZipCode?: string | null;
}
