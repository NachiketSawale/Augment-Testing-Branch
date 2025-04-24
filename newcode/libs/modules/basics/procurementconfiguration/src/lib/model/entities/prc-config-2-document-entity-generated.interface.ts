/*
 * Copyright(c) RIB Software GmbH
 */

import { IPrcConfigurationEntity } from './prc-configuration-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IPrcConfig2documentEntityGenerated extends IEntityBase {

  /**
   * BasClerkdocumenttypeFk
   */
  BasClerkdocumenttypeFk?: number | null;

  /**
   * BasRubricFk
   */
  BasRubricFk: number;

  /**
   * Id
   */
  Id: number;

  /**
   * PrcConfigurationEntity
   */
  PrcConfigurationEntity?: IPrcConfigurationEntity | null;

  /**
   * PrcConfigurationFk
   */
  PrcConfigurationFk: number;

  /**
   * PrcDocumenttypeFk
   */
  PrcDocumenttypeFk?: number | null;

  /**
   * PrjDocumenttypeFk
   */
  PrjDocumenttypeFk?: number | null;

  /**
   * SlsDocumenttypeFk
   */
  SlsDocumenttypeFk?: number | null;
}
