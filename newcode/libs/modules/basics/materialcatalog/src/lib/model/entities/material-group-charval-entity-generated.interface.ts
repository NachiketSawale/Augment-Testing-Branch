/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IMaterialGroupCharvalEntityGenerated extends IEntityBase {

  /**
   * CharacteristicInfo
   */
  CharacteristicInfo?: IDescriptionInfo | null;

  /**
   * Id
   */
  Id: number;

  /**
   * MaterialGroupCharFk
   */
  MaterialGroupCharFk: number;
}
