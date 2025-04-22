/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface ICertificateTypeEntityGenerated extends IEntityBase {

  /**
   * AccessRightDescriptorFk
   */
  AccessRightDescriptorFk?: number | null;

  /**
   * Description
   */
  Description?: string | null;

  /**
   * HasAmount
   */
  HasAmount: boolean;

  /**
   * HasCertificateDate
   */
  HasCertificateDate: boolean;

  /**
   * HasCompany
   */
  HasCompany: boolean;

  /**
   * HasContract
   */
  HasContract: boolean;

  /**
   * HasExpirationDate
   */
  HasExpirationDate: boolean;

  /**
   * HasIssuer
   */
  HasIssuer: boolean;

  /**
   * HasIssuerBP
   */
  HasIssuerBP: boolean;

  /**
   * HasOrder
   */
  HasOrder: boolean;

  /**
   * HasProject
   */
  HasProject: boolean;

  /**
   * HasReference
   */
  HasReference: boolean;

  /**
   * HasReferenceDate
   */
  HasReferenceDate: boolean;

  /**
   * HasValidFrom
   */
  HasValidFrom: boolean;

  /**
   * HasValidTo
   */
  HasValidTo: boolean;

  /**
   * Id
   */
  Id: number;

  /**
   * IsBond
   */
  IsBond: boolean;

  /**
   * IsDefault
   */
  IsDefault: boolean;

  /**
   * IsEmitted
   */
  IsEmitted: boolean;

  /**
   * IsLive
   */
  IsLive: boolean;

  /**
   * IsValued
   */
  IsValued?: boolean | null;

  /**
   * Sorting
   */
  Sorting: number;
}
