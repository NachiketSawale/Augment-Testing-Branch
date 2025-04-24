/*
 * Copyright(c) RIB Software GmbH
 */

import { IPrcConfigurationEntity } from './prc-configuration-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IPrcConfig2dataformatEntityGenerated extends IEntityBase {

  /**
   * BasDataformatFk
   */
  BasDataformatFk: number;

  /**
   * Id
   */
  Id: number;

  /**
   * IsDefault
   */
  IsDefault: boolean;

  /**
   * PrcConfigurationEntity
   */
  PrcConfigurationEntity?: IPrcConfigurationEntity | null;

  /**
   * PrcConfigurationFk
   */
  PrcConfigurationFk: number;
}
