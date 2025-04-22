/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IPrcHeaderblobEntityGenerated extends IEntityBase {

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
   * IsProject
   */
  IsProject: boolean;

  /**
   * IsReload
   */
  IsReload: boolean;

  /**
   * PlainText
   */
  PlainText?: string | null;

  /**
   * PrcHeaderFk
   */
  PrcHeaderFk: number;

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
