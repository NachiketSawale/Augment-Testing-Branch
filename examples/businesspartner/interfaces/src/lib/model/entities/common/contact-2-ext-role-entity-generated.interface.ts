/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IContact2ExtRoleEntityGenerated extends IEntityBase {

  /**
   * ContactFk
   */
  ContactFk: number;

  /**
   * ExternalRoleFk
   */
  ExternalRoleFk: number;

  /**
   * Id
   */
  Id: number;
}
