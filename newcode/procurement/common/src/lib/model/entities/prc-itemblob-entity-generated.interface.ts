/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IPrcItemblobEntityGenerated extends IEntityBase {

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
   * PrcItemFk
   */
  PrcItemFk: number;

  /**
   * PrcTexttypeFk
   */
  PrcTexttypeFk: number;

  /**
   * TextFormatFk
   */
  TextFormatFk?: number | null;

  /**
   * TextModuleTypeFk
   */
  TextModuleTypeFk?: number | null;
}
