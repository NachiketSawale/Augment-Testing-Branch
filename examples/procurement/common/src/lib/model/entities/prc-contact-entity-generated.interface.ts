/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IPrcContactEntityGenerated extends IEntityBase {

  /**
   * BpdContactFk
   */
  BpdContactFk: number;

  /**
   * BpdContactRoleFk
   */
  BpdContactRoleFk?: number | null;

  /**
   * CommentText
   */
  CommentText?: string | null;

  /**
   * ContactRoleTypeFk
   */
  ContactRoleTypeFk?: number | null;

  /**
   * Id
   */
  Id: number;

  /**
   * PrcHeaderFk
   */
  PrcHeaderFk: number;
}
