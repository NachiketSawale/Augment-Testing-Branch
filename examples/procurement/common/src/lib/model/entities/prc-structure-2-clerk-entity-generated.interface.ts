/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IPrcStructure2ClerkEntityGenerated extends IEntityBase {

  /**
   * BasClerkFk
   */
  BasClerkFk: number;

  /**
   * BasClerkRoleFk
   */
  BasClerkRoleFk: number;

  /**
   * BasCompanyFk
   */
  BasCompanyFk: number;

  /**
   * CommentText
   */
  CommentText?: string | null;

  /**
   * Id
   */
  Id: number;

  /**
   * PrcStructureFk
   */
  PrcStructureFk: number;
}
