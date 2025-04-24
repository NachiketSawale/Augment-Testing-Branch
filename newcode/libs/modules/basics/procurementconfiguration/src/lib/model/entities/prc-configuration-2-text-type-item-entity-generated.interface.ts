/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IPrcConfiguration2TextTypeItemEntityGenerated extends IEntityBase {

  /**
   * BasTextModuleFk
   */
  BasTextModuleFk?: number | null;

  /**
   * BasTextModuleTypeFk
   */
  BasTextModuleTypeFk?: number | null;

  /**
   * Id
   */
  Id: number;

  /**
   * IsRubricBased
   */
  IsRubricBased: boolean;

  /**
   * PrcConfigHeaderFk
   */
  PrcConfigHeaderFk: number;

  /**
   * PrcConfigurationFk
   */
  PrcConfigurationFk: number;

  /**
   * PrcTextTypeFk
   */
  PrcTextTypeFk: number;
}
