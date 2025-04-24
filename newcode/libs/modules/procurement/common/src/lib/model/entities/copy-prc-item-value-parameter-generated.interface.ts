/*
 * Copyright(c) RIB Software GmbH
 */

import { IPrcItemEntity } from './prc-item-entity.interface';

export interface ICopyPrcItemValueParameterGenerated {

  /**
   * moduleName
   */
  moduleName?: string | null;

  /**
   * originPrcItem
   */
  originPrcItem?: IPrcItemEntity | null;

  /**
   * targetPrcItem
   */
  targetPrcItem?: IPrcItemEntity | null;
}
