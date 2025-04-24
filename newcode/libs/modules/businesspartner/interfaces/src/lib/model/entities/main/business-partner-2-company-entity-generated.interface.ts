/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IBusinessPartner2CompanyEntityGenerated extends IEntityBase {

  /**
   * BasClerkFk
   */
  BasClerkFk?: number | null;

  /**
   * BusinessPartnerFk
   */
  BusinessPartnerFk: number;

  /**
   * CompanyFk
   */
  CompanyFk: number;

  /**
   * CompanyResponsibleFk
   */
  CompanyResponsibleFk: number;

  /**
   * Id
   */
  Id: number;

  /**
   * IsActive
   */
  IsActive: boolean;

  /**
   * Remark
   */
  Remark?: string | null;

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
}
