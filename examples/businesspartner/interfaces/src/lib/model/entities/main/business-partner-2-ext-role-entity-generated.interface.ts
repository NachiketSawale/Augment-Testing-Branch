/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IBusinessPartner2ExtRoleEntityGenerated extends IEntityBase {

  /**
   * BusinessPartnerFk
   */
  BusinessPartnerFk: number;

  /**
   * ExternalRoleFk
   */
  ExternalRoleFk: number;

  /**
   * Id
   */
  Id: number;
}
