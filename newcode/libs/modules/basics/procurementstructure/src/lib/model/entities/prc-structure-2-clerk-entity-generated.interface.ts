/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IPrcStructure2clerkEntityGenerated extends IEntityBase {

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
   * CompanyFk
   */
  CompanyFk: number;

  /**
   * Id
   */
  Id: number;

  /**
   * PrcStructureFk
   */
  PrcStructureFk: number;
}
