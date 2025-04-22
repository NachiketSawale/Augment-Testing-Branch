/*
 * Copyright(c) RIB Software GmbH
 */

import { IIdentificationData } from '@libs/platform/common';

export interface IModelObjectRequestGenerated {

  /**
   * itemIds
   */
  itemIds?: IIdentificationData[] | null;

  /**
   * modelId
   */
  modelId?: number | null;
}
