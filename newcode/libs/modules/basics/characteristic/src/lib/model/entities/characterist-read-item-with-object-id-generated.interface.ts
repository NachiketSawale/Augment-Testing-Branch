/*
 * Copyright(c) RIB Software GmbH
 */

import { IIdentificationData } from '@libs/platform/common';

export interface ICharacteristReadItemWithObjectIdGenerated {

  /**
   * isDynamicCols
   */
  isDynamicCols: boolean;

  /**
   * objectIds
   */
  objectIds?: IIdentificationData[] | null;

  /**
   * sectionId
   */
  sectionId: number;
}
