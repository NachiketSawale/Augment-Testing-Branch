/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IRoute2ClerkEntityGenerated extends IEntityBase {

  /**
   * ClerkFk
   */
  ClerkFk: number;

  /**
   * ClerkRoleFk
   */
  ClerkRoleFk: number;

  /**
   * CommentText
   */
  CommentText?: string | null;

  /**
   * From
   */
  From?: string | null;

  /**
   * Id
   */
  Id: number;

  /**
   * TrsRouteFk
   */
  TrsRouteFk: number;

  /**
   * ValidFrom
   */
  ValidFrom?: string | null;

  /**
   * ValidTo
   */
  ValidTo?: string | null;
}
