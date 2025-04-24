/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IPrcConfiguration2TabEntityGenerated extends IEntityBase {

  /**
   * Id
   */
  Id: number;

  /**
   * IsDisabled
   */
  IsDisabled: boolean;

  /**
   * ModuleTabFk
   */
  ModuleTabFk: number;

  /**
   * PrcConfigHeaderFk
   */
  PrcConfigHeaderFk: number;

  /**
   * Style
   */
  Style: number;
}
