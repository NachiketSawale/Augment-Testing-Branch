/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IPrcItemScopeDtlBlobEntityGenerated extends IEntityBase {

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
   * PlainText
   */
  PlainText?: string | null;

  /**
   * PrcItemScopeDetailFk
   */
  PrcItemScopeDetailFk: number;

  /**
   * PrcTextTypeFk
   */
  PrcTextTypeFk: number;
}
