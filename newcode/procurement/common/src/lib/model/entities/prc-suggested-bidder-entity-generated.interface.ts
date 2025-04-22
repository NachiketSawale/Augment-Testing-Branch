/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IPrcSuggestedBidderEntityGenerated extends IEntityBase {

  /**
   * BpName1
   */
  BpName1?: string | null;

  /**
   * BpName2
   */
  BpName2?: string | null;

  /**
   * BusinessPartnerFk
   */
  BusinessPartnerFk?: number | null;

  /**
   * City
   */
  City?: string | null;

  /**
   * CommentText
   */
  CommentText?: string | null;

  /**
   * ContactFk
   */
  ContactFk?: number | null;

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
   * IsHideBpNavWhenNull
   */
  IsHideBpNavWhenNull?: boolean | null;

  /**
   * PrcHeaderFk
   */
  PrcHeaderFk: number;

  /**
   * Remark
   */
  Remark?: string | null;

  /**
   * Street
   */
  Street?: string | null;

  /**
   * SubsidiaryFk
   */
  SubsidiaryFk?: number | null;

  /**
   * SupplierFk
   */
  SupplierFk?: number | null;

  /**
   * Telephone
   */
  Telephone?: string | null;

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
   * Zipcode
   */
  Zipcode?: string | null;
}
