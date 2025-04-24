/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IPrcConfiguration2Prj2TextTypeEntityGenerated extends IEntityBase {

  /**
   * BasTextModuleFk
   */
  BasTextModuleFk: number;

  /**
   * Id
   */
  Id: number;

  /**
   * PrcConfigheaderFk
   */
  PrcConfigheaderFk: number;

  /**
   * PrcConfigurationFk
   */
  PrcConfigurationFk?: number | null;

  /**
   * PrcTexttypeFk
   */
  PrcTexttypeFk: number;

  /**
   * PrjProjectFk
   */
  PrjProjectFk: number;
}
