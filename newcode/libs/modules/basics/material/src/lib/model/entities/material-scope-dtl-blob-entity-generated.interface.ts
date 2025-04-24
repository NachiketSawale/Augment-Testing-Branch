/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IMaterialScopeDtlBlobEntityGenerated extends IEntityBase {

  /**
   * Content
   */
  Content: ArrayBuffer;

  /**
   * ContentString
   */
  ContentString?: string | null;

  /**
   * Id
   */
  Id: number;

  /**
   * MaterialScopeDetailFk
   */
  MaterialScopeDetailFk: number;

  /**
   * PlainText
   */
  PlainText?: string | null;

  /**
   * PrcTextTypeFk
   */
  PrcTextTypeFk: number;
}
